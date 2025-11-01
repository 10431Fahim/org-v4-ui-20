import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VisionsResourcesRoutingModule} from './visions-resources-routing.module';


import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ProductCarOneLoaderModule} from "../../shared/loader/product-car-one-loader/product-car-one-loader.module";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgxPaginationModule} from "ngx-pagination";
import {PathagarModule} from "../pathagar/pathagar.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MaterialModule} from "../../material/material.module";
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    VisionsResourcesRoutingModule,
    PipesModule,
    RouterModule,
    ProductCarOneLoaderModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    TranslateModule,
    NgxPaginationModule,
    PathagarModule,
    MatDialogModule,
    MaterialModule,
    // PdfViewerModule,
  ]
})
export class VisionsResourcesModule { }
