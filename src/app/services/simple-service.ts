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
import { Injectable     } from '@angular/core';
import { Http, Response } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * A (very) simple http service to request and return data from back-end services
 */

@Injectable()
export class SimpleService 
{
 /**
  * Construct a new basic service
  *
  * @param _http: Http Injected Http instance from the platform
  */
  constructor(protected _http: Http) 
  {
    // empty
  }

 /**
  * Retrieve data from this service
  *
  * @param _url: string URL of external service
  *
  * @return Observable<any>
  */
  public getData(url: string): Observable<any>
  {
    if (url != "")
    {
       return this._http.get(url)
                        .map(this.__extractData)
                        .catch(this.__errHandler);
    }
  }

  private __extractData( res: Response ): any
  {
    let body: Object = res.json();

    return body || { };
  }

  private __errHandler( error: Response | any ): any
  {
    let errMsg: string = "DATA REQUEST FAILED: ";

    if (error instanceof Response) 
    {
      const body: any = error.json() || '';
      const err: any  = body.error || JSON.stringify(body);
      
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    else
      errMsg = error.message ? error.message : error.toString();

    console.error(errMsg);

    return Observable.throw(errMsg);
  }
}
