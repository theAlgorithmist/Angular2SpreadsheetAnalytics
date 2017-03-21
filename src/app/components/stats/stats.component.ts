/** 
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// platform imports
import {  Component 
        , OnInit
        , AfterViewInit
        , ChangeDetectorRef
        , trigger
        , state
        , style
        , transition
        , animate
       } from '@angular/core';

// base Flux component
import { FluxComponent } from '../flux-redux/flux.component';

// dispatcher
import { FluxDispatcher } from '../flux-redux/FluxDispatcher';

// actions
import { BasicActions } from '../../actions/BasicActions';

// Typescript Math Toolkit
import { TSMT$DataStats } from '../../lib/DataStats';
import { TSMT$Table     } from '../../lib/Table';

@Component({
  selector: 'stat-summary',

  templateUrl: 'stats.component.html',

  styleUrls: ['stats.component.css'],

  animations: [
    trigger('visibleState', [
      state('invisible', style({ transform: 'translateY(0px)'  })),
      state('visible'  , style({ transform: 'translateY(-450px)' })),
      transition('visible => invisible', animate('300ms ease-in')),
      transition('invisible => visible', animate('300ms ease-in'))
    ])
  ]
})

/**
 * Table statistics summary component for Auto Data Analysis demo 
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
 export class StatsSummaryComponent extends FluxComponent implements OnInit, AfterViewInit
 {
   // this is the show or hide text that is displayed at the top of the summary panel
   public summaryString: string = " > Show Summary Statistics";

   protected _table: TSMT$Table;             // Reference to Typescript MathToolkit table class for analysis

   protected _visible: boolean = false;      // true if table data section is visible
   protected _visibleState: string;          // visible state as a string, 'visible', 'invisible'
   protected _previousState: string;         // previous state

   // simple table stats
   protected _quartile: Array<number>;       // price quantile (n=4)
   protected _quintile: Array<number>;       // price quantile (n=5)
   protected _priceMean: number;             // mean car price
   protected _priceStd: number;              // car price std. dev.

   // two-way table analysis stats
   protected _tableChi2: number;             // total (cross-tab) chi-squared
   protected _observations: number;          // total number of observations or rows in the original table
   private _tblRows: Array<Object>;          // result of pre-processing results of cross-tab analysis to make everything work nicely with ngFor and the template
   private _colCount1: number;               // 1st-column count
   private _colCount2: number;               // 2nd-column count

 /**
   * Construct the status summary app component
   *
   * @return Nothing
   */
   constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef)
   {
     super(_d);

     this._table         = new TSMT$Table();
     this._previousState = "none";
     this._visibleState  = "invisible";
   }

  /**
   * Component lifecycle - on init
   *
   * @return nothing - reserved for future use
   */
   public ngOnInit()
   {
     // for future use
   }

  /**
   * Component lifecycle - after view init
   *
   * @return nothing - reserved for future use
   */
   public ngAfterViewInit()
   {
     // for future use
   }

   // update the component based on a new state of the global store
   protected __onModelUpdate(data: Object): void
   {
     switch (data['action'])
     {
       case BasicActions.GET_AUTO_DATA:

         // Note: things can get dicey as we have a situation where two components obtain references to the same slice of the global store copy.  For
         // efficiency, the slice was copied (so the global store can not be mutated outside the model) but the SAME reference was sent to all subscribers.  
         // So, we have to take care not to mutate the data.  This is the downside of having a lot of control over the global store.  You may, of course,
         // make a different copy for each subscriber.  The tradeoff is performance vs. better guarantee of immutability.

         let headers: Array<number | string>         = < Array<number | string> > data['autodataheaders'];
         let autoData: Array<Array<number | string>> = < Array<Array<number | string>> > data['autodata'];
         let types: Array<number>                    = < Array<number> > data['autodatatypes'];

         // the header and table data need to be merged before initialzing the TSMT Table; there are some subtle issues with unshift and contact in this instance
         let tableData: Array<Array<any>> = new Array<Array<any>>();
         tableData.push( headers );
         autoData.map( (row) => {tableData.push(row)} );

         // init the table (this auto-clears any prior data)
         this._table.fromArray(tableData, types);

         this.__computeStats();

         // this works since the data is returned after an http request, which triggers a CD cycle; otherwise, you might have to do the following
         //this._chgDetector.detectChanges();
   
       break;  
     }
   }

   protected __computeStats(): void
   {
     // quartile (quantile, n=4) [3800, 10995, 13951.5, 14904.5, 21992]
     this._quartile = this._table.getQuantiles("price", 0.25);

     // quintile (quantile n=5) [3800, 10759.4, 12993.8, 13992, 14999, 21992]
     this._quintile = this._table.getQuantiles("price", 0.2);

     // mean and std. dev. of the 'price' column
     this._priceMean = this._table.getMean("price"); // 12961.93
     this._priceStd  = this._table.getStd("price");  // 3122.48

     // cross-table analysis - group black, silver, white, and gray cars into a 'simple' color.  Group blue, bold, green, red, and yellow
     // colors into a 'bold' color.  Study purchase trends on simple vs. bold coloring

     let crossTable: Object = this._table.crossTable("model", "color", 
                                                     ["Black Silver White Gray", "Blue Gold Green Red Yellow"], 
                                                     ["Simple-Color", "Bold-Color"]);

     // The output table has four columns and number of rows determined by number of unique models (plus one).  Outer column/row is for row/column counts.
     this._tableChi2    = parseFloat(crossTable['chi2']);
     this._observations = parseFloat(crossTable['df']) + 1;

     // this pre-processing helps everything fit neatly into the ngFor world - we know that the 'model' column is string data in advance
     let table: Object = crossTable['table'];

     this._tblRows = new Array<Object>();

     // make a clean array of output table rows from the result (this is why TSMT does not monkey-patch an Object with an associative array)
     let key: string;
     let rowData: Array<any>;
     let rowCount: number;
     let cell1: Object;
     let cell2: Object;

     // this works because we know the number of columns will be fixed at four - one for the 'model' name, one each for the two characterisitcs 
     // (simple/bold) and one for the row counts.  In the future, I may add this formatting to the TSMT Table - handling the column counts makes
     // formatting the table a bit tricky and settling on a strategy that most everyone likes may take time.
     for( key in table )
     {
       rowData = table[key];
       cell1   = rowData[0];
       cell2   = rowData[1];
 
       this._tblRows.push({ model: key, 
                            c1n: cell1['n'], c1r: cell1['r'], c1t: cell1['t'], 
                            c2n: cell2['n'], c2r: cell2['r'], c2t: cell2['t'], 
                            count: rowData[2] });
     }

     let colCounts: Array<number> = crossTable['colCounts'];

     // assign the column counts (final row of the output cross-table) - there should only be two.
     this._colCount1 = colCounts[0];
     this._colCount2 = colCounts[1];
   }

   // toggle the show/hide panel text and kick off an animation one way or the other
   protected __onShowClicked(): void
   {
     this.summaryString  = this._visible ? " > Show Summary Statistics" : " > Hide Summary Statistics";
     this._previousState = this._visibleState;
     this._visibleState  = this._previousState == "invisible" ? "visible" : "invisible";
   }

   // executed when animation begins
   protected __onAnimationBegin(): void
   {
     if (this._previousState == "invisible" && this._visibleState == "visible")
       this._visible = true;
   }

   // executed when animation ends
   protected __onAnimationEnd(): void
   {
     if (this._previousState == "visible" && this._visibleState == "invisible")
       this._visible = false;
   }
 }

