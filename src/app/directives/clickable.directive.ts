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
import {  Directive
        , ElementRef
        , HostListener
        , EventEmitter
        , Output } from '@angular/core';

@Directive({
  selector: '[makeClickable]'
})

/**
 * A simple attribute directive to make a item like a <p> or <h1> clickable with anchor-style text decoration on rollover.  Emits a 'click' event
 */
export class MakeClickableDirective 
{
  @Output('onClick') output: EventEmitter<any>;   // output for this directive

  constructor(private el: ElementRef) 
  { 
    this.output = new EventEmitter<any>();
  }

  // listen to events on host item
  @HostListener('mouseenter') onMouseEnter() 
  {
    this.el.nativeElement.style.textDecoration = "underline";
    this.el.nativeElement.style.cursor         = "pointer";
  }

  @HostListener('mouseleave') onMouseLeave() 
  {
    this.el.nativeElement.style.textDecoration = "none";
    this.el.nativeElement.style.cursor         = "default";  
  }

  @HostListener('click') onMouseClick()
  {
    this.output.emit();
  }
}