import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramRoutingModule } from './program-routing.module';

import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import {NewsCardOneLoaderModule} from '../../shared/loader/news-card-one-loader/news-card-one-loader.module';
import {NewsDetailsLoaderModule} from '../../shared/loader/news-details-loader/news-details-loader.module';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ProgramRoutingModule,
    RouterModule,
    PipesModule,
    TranslateModule,
    NewsCardOneLoaderModule,
    NewsDetailsLoaderModule,
  ]
})
export class ProgramModule { }
