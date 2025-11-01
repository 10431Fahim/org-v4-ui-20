import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PressConferenceLoaderComponent } from './press-conference-loader.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";



@NgModule({
  declarations: [

  ],
  exports: [
    PressConferenceLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    PressConferenceLoaderComponent
  ]
})
export class PressConferenceLoaderModule { }
