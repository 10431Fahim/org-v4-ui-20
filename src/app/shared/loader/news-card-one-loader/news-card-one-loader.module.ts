import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsCardOneLoaderComponent } from './news-card-one-loader.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";



@NgModule({
  declarations: [

  ],
  exports: [
    NewsCardOneLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    NewsCardOneLoaderComponent
  ]
})
export class NewsCardOneLoaderModule { }
