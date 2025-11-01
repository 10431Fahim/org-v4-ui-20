import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LazyLoadDirective} from './image-lazy-load';
@NgModule({
  imports: [
    CommonModule,
    LazyLoadDirective
  ],
  declarations: [],
  exports: [LazyLoadDirective]
})
export class DirectivesModule { }
