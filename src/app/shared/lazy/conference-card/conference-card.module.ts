import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceCardComponent } from './conference-card.component';
import {TranslateModule} from "@ngx-translate/core";
import {ProductCarOneLoaderModule} from "../../loader/product-car-one-loader/product-car-one-loader.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgxPaginationModule} from "ngx-pagination";
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    TranslateModule,
    TranslateModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    RouterLink,
    ConferenceCardComponent,
  ],
  exports:[
    ConferenceCardComponent
  ]
})
export class ConferenceCardModule { }
