import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubeVideoShowComponent } from './youtube-video-show.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    YoutubeVideoShowComponent
  ]
})
export class YoutubeVideoShowModule { }
