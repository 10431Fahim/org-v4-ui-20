import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ReportDetailsComponent } from './report-details/report-details.component';
import {PipesModule} from "../../shared/pipes/pipes.module";
import {RouterModule} from "@angular/router";
import {RecentlyAllNewsModule} from "../../shared/lazy/recently-all-news/recently-all-news.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    PipesModule,
    RouterModule,
    RecentlyAllNewsModule,
    TranslateModule,
  ]
})
export class ReportsModule { }
