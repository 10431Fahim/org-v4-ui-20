import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceRoutingModule } from './conference-routing.module';
import { ConferenceComponent } from './conference.component';
import { TranslateModule } from '@ngx-translate/core';
import {ProductCarOneLoaderModule} from "../../shared/loader/product-car-one-loader/product-car-one-loader.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgxPaginationModule} from "ngx-pagination";
import {ConferenceCardModule} from "../../shared/lazy/conference-card/conference-card.module";
import { ConferenceDetailsComponent } from './conference-details/conference-details.component';
import {PipesModule} from "../../shared/pipes/pipes.module";
import {NewsCardOneLoaderModule} from '../../shared/loader/news-card-one-loader/news-card-one-loader.module';
import {PressConferenceLoaderModule} from '../../shared/loader/press-conference-loader/press-conference-loader.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ConferenceRoutingModule,
    TranslateModule,
    ProductCarOneLoaderModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    PipesModule,
    ConferenceCardModule,
    NewsCardOneLoaderModule,
    PressConferenceLoaderModule
  ],
  // exports:[
  //   ConferenceComponent
  // ]
})
export class ConferenceModule { }
