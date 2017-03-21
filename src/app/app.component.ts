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
       } from '@angular/core';

// components
import { LoadingComponent } from './components/loading/loading.component';

// base Flux component
import { FluxComponent } from './components/flux-redux/flux.component';

// Global store and dispatcher
import { AutoModel      } from './model/AutoModel';
import { FluxDispatcher } from './components/flux-redux/FluxDispatcher';

// actions
import { BasicActions } from './actions/BasicActions';

// rxjs imports
import { Subject      } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',

  templateUrl: 'app.component.html',

  styleUrls: ['app.component.css']
})

/**
 * Root component for Auto Data Table Analysis demo 
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
 export class AppComponent extends FluxComponent implements OnInit, AfterViewInit
 {
   protected _loading: boolean = true;                 // true if content is being loaded

   protected _headers:Array<string>;                   // reference to table headers 

   protected _autoData:Array<Array<number | string>>;  // reference to auto data by rows

 /**
   * Construct the main app component
   *
   * @return Nothing
   */
   constructor(private _m: AutoModel, private _d: FluxDispatcher)
   {
     super(_d);

     // since there is no formal framework that ties the dispatcher and global store together, this step is done manually.  
     _d.model = _m;
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
   * @return nothing - dispatch action to request map paraams
   */
   public ngAfterViewInit()
   {
     this._d.dispatchAction(BasicActions.GET_AUTO_DATA, null);
   }

   // update the component based on a new state of the global store
   protected __onModelUpdate(data: Object): void
   {
     switch (data['action'])
     {
       case BasicActions.GET_AUTO_DATA:

         if (this._loading)
           this._loading = false;

         this._headers = < Array<string> > data['autodataheaders'];

         this._autoData = < Array<Array<number | string>> > data['autodata'];

       break;  
     }
   }
 }

