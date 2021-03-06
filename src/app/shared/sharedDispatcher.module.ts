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
 * Shared Dispatcher module (necessary to enforce a singleton FluxDispatcher across eagerly and lazy-loaded routes
 *
 * @author Jim Armstrong (www.algorithmist.net)
 * 
 * @version 1.0
 */

// platform imports
import { NgModule, ModuleWithProviders } from '@angular/core';

// providers
import { FluxDispatcher } from '../components/flux-redux/FluxDispatcher';

@NgModule({})
export class SharedDispatcherModule 
{
  static forRoot():ModuleWithProviders 
  {
    return {
      ngModule: SharedDispatcherModule,
      providers: [FluxDispatcher]
    };
  }
}