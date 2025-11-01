import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutoCrossoriginDirective} from './auto-crossorigin.directive';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AutoCrossoriginDirective
  ],
  exports: [
    AutoCrossoriginDirective
  ]
})
export class AutoCrossoriginModule { }
