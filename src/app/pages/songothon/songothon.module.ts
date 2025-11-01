import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongothonRoutingModule } from './songothon-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import {RecentlyAllNewsModule} from '../../shared/lazy/recently-all-news/recently-all-news.module';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SongothonRoutingModule,
    RecentlyAllNewsModule,
    TranslateModule,
  ]
})
export class SongothonModule { }
