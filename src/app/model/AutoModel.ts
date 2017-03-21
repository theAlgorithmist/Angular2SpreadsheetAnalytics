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

/**
 * Global store for the auto-date table analysis
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 // platform imports
 import { Injectable } from '@angular/core';

 // interfaces
 import { IReduxModel } from '../components/flux-redux/IReduxModel';

 // actions import
 import { BasicActions } from '../actions/BasicActions';

 // services
 import { SimpleService } from '../services/simple-service'; 

 // other imports
 import { TableTypeEnum } from '../lib/Table';

 // rxjs
 import { Subject    } from 'rxjs/Subject';
 import { Observable } from 'rxjs/Observable';

 type autodatatype = string | number;

 @Injectable()
 export class AutoModel implements IReduxModel
 {
   // singleton instance; this is not necessary, but allows the model to be used outside the Angular DI system
   private static _instance: AutoModel;

   // reference to actual store - this remains private to support compile-time immutability
   private _store: Object = new Object();

   // current action
   private _action: number;

   // subscribers to model updates
   private _subscribers:Array<Subject<any>>;

  /**
   * Construct a new Auto model
   *
   * @return nothing
   */
   constructor(protected _service: SimpleService) 
   {
     if (AutoModel._instance instanceof AutoModel) 
       return AutoModel._instance;
     
     // define the structure of the global application store
     this._store['autodataheaders'] = new Array<string>();                // data table headers 
     this._store['autodatatypes'  ] = new Array<number>();                // data table column types (i.e. string, number)
     this._store['autodata'       ] = new Array<Array<autodatatype>>();   // auto data
     this._store['action'         ] = BasicActions.NONE;                  // most recent action that mutated the global store

     // current action
     this._action = BasicActions.NONE;

     this._subscribers = new Array<Subject<any>>();

     // table column types are currently hardcoded and would be normally passed along with other data in a non-demo environment.  services are kept as simple as possible
     // in this demo to make it easier to get up and running in your specific environment
     this._store['autodatatypes'] = [TableTypeEnum.NUMERIC, TableTypeEnum.CHARACTER, TableTypeEnum.NUMERIC, TableTypeEnum.NUMERIC, TableTypeEnum.CHARACTER, TableTypeEnum.CHARACTER];

     // singleton instance
     AutoModel._instance = this;
   }

  /**
   * Subscribe a new Subject to the model
   *
   * @param subject: Subject<any> A Subject with at least an 'next' handler
   *
   * @return Nothing - The Subject is added to the subscriber list
   */
   public subscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     if (subject)
       this._subscribers.push(subject);
   }

  /**
   * Unsubscribe an existing Subject from the model
   *
   * @param subject: Subject<any> Existing subscribed Subject
   *
   * @return Nothing - If found, the Subject is removed from the subscriber list (typically executed when a component is destructed)
   */
   public unsubscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     if (subject)
     {
       let len: number = this._subscribers.length;
       let i: number;

       for (i=0; i<len; ++i)
       {
         if (this._subscribers[i] === subject)
         {
           this._subscribers.splice(i,1);
           break;
         }
       }
     }
   }

  /**
   * Dispatch an Action to the model, which causes the model to be changed - application of a reducer - and then a slice of the new model
   * is sent to all subscribers.  This includes the action that caused the reduction.  A copy of model data is always sent to perserve
   * immutability.
   *
   * @param action: number Action type
   *
   * @param payload: Object (optional) Payload for the action, which may be used by a reducer
   *
   * @return Nothing - All subscribers are notified after the model is updated
   */
   public dispatchAction(action: number, payload: Object=null): void
   {
     let validAction: Boolean = false;
     let data:Object;

     this._action = action;
     switch (this._action)
     {
       case BasicActions.GET_AUTO_DATA:
         let autodata: Array<Array<autodatatype>> = this._store['autodata'];

         if (autodata.length == 0)
         {
           // REPLACE THIS URL WITH THE LOCATION OF THE PHP FILE ON YOUR SERVER - THIS LINK WILL NOT WORK
           this._service.getData("http://algorithmist.net/sse/services/autodata.php")
                        .subscribe( data  => this.__onAutoData(data),
                                    error => console.log(<any>error) );
  
           validAction = false;  // wait for return and full processing of data from the service
         }
         else
         {
           this._store['action'] = BasicActions.GET_AUTO_DATA;
           validAction           = true;
         }
       break;
     }

     // immediately update all subscribers?
     if (validAction)
       this.__updateSubscribers();
   }

   private __updateSubscribers(): void
   {
     // send copy of a slice of the current store to subscribers
     let store: Object = {};
     store['action']   = this._store['action'];

     switch ( this._action )
     {
       case BasicActions.GET_AUTO_DATA:
         store['autodataheaders'] = JSON.parse( JSON.stringify(this._store['autodataheaders']) ); 
         store['autodatatypes'  ] = JSON.parse( JSON.stringify(this._store['autodatatypes'])   ); 
         store['autodata'       ] = JSON.parse( JSON.stringify(this._store['autodata'])        );
       break;
     }

     this._subscribers.map( (s:Subject<any>) => s.next(store) );
   }

   private __onAutoData(data: Object): void
   {
     let autoData: Object = typeof data === 'string' ? JSON.parse(data) : data;

     this._store['autodataheaders'] = autoData['header'].slice();

     const tmpData: Array<Array<autodatatype>> = autoData['data'];
     const items: number                       = tmpData.length;
     let target: Array<Array<autodatatype>>    = this._store['autodata'];

     let i: number;
    
     for (i=0; i<items; ++i)
       target.push( tmpData[i].slice() );

     this._store['action'] = BasicActions.GET_AUTO_DATA;

     this.__updateSubscribers();
   }
 }
