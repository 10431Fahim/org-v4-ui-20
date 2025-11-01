import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentlyNewsLoaderComponent } from './recently-news-loader.component';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    RecentlyNewsLoaderComponent
  ],
  exports:[
    RecentlyNewsLoaderComponent
  ]
})
export class RecentlyNewsLoaderModule { }
