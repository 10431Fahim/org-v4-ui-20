import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VideoGalleryRoutingModule} from './video-gallery-routing.module';
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    VideoGalleryRoutingModule,
    PipesModule
  ]
})
export class VideoGalleryModule { }
