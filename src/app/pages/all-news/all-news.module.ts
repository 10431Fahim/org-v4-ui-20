import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllNewsComponent } from './all-news.component';
import { AllNewsRoutingModule } from './all-news-routing.module';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { RouterModule } from '@angular/router';
import { RecentlyAllNewsModule } from '../../shared/lazy/recently-all-news/recently-all-news.module';
import { TranslateModule } from '@ngx-translate/core';
import {NewsCardOneLoaderModule} from '../../shared/loader/news-card-one-loader/news-card-one-loader.module';
import {NewsDetailsLoaderModule} from '../../shared/loader/news-details-loader/news-details-loader.module';
import {ProgramLoaderModule} from '../../shared/loader/program-loader/program-loader.module';
import { TestDetailsComponent } from './test-details/test-details.component';
import {PipesModule} from '../../shared/pipes/pipes.module';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AllNewsRoutingModule,
    PipesModule,
    RouterModule,
    RecentlyAllNewsModule,
    TranslateModule,
    NewsCardOneLoaderModule,
    NewsDetailsLoaderModule,
    ProgramLoaderModule,
    NewsDetailComponent,
    TestDetailsComponent,
    AllNewsComponent,
  ]
})
export class AllNewsModule { }
