import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {BrandCardModule} from '../../shared/lazy/brand-card/brand-card.module';
import {ReviewCardModule} from '../../shared/lazy/review-card/review-card.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {RecentlyAllNewsModule} from '../../shared/lazy/recently-all-news/recently-all-news.module';
import {TranslateModule} from '@ngx-translate/core';
import {ProgramLoaderModule} from '../../shared/loader/program-loader/program-loader.module';
import {YoutubeLoaderModule} from '../../shared/loader/youtube-loader/youtube-loader.module';
import {ConferenceCardModule} from "../../shared/lazy/conference-card/conference-card.module";
import {ConferenceModule} from "../conference/conference.module";
import {MatButtonModule} from '@angular/material/button';
import {YoutubeVideoComponent} from './youtube-video/youtube-video.component';
import {PressConferenceLoaderModule} from '../../shared/loader/press-conference-loader/press-conference-loader.module';
import {NewsCardOneLoaderModule} from '../../shared/loader/news-card-one-loader/news-card-one-loader.module';
import {MatIconModule} from '@angular/material/icon';
import {MaterialModule} from '../../material/material.module';
import {LazyLoadComponentModule} from "../../shared/directives/lazy-load-component/lazy-load-component.module";
import {AutoCrossoriginModule} from '../../shared/directives/auto-crossorigin/auto-crossorigin.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    BrandCardModule,
    ReviewCardModule,
    RouterModule,
    PipesModule,
    RecentlyAllNewsModule,
    TranslateModule,
    ProgramLoaderModule,
    YoutubeLoaderModule,
    ConferenceCardModule,
    ConferenceModule,
    MatButtonModule,
    PressConferenceLoaderModule,
    NewsCardOneLoaderModule,
    MatIconModule,
    MaterialModule,
    LazyLoadComponentModule,
    AutoCrossoriginModule,
    YoutubeVideoComponent
  ]
})
export class HomeModule {
}
