import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubeLoaderComponent } from './youtube-loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    RouterModule,
    YoutubeLoaderComponent
  ],
  exports:[
    YoutubeLoaderComponent
  ]
})
export class YoutubeLoaderModule { }
