import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsDetailsLoaderComponent } from './news-details-loader.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";



@NgModule({
  declarations: [

  ],
  exports: [
    NewsDetailsLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    NewsDetailsLoaderComponent
  ]
})
export class NewsDetailsLoaderModule { }
