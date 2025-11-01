import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllNoticeRoutingModule } from './all-notice-routing.module';
import { AllNoticeComponent } from './all-notice.component';
import { NoticeDetailsComponent } from './notice-details/notice-details.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {RecentlyAllNewsModule} from '../../shared/lazy/recently-all-news/recently-all-news.module';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AllNoticeRoutingModule,
    PipesModule,
    RouterModule,
    RecentlyAllNewsModule,
    TranslateModule,
    AllNoticeComponent,
    NoticeDetailsComponent,
  ]
})
export class AllNoticeModule { }
