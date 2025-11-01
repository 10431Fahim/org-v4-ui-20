import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCarOneLoaderComponent } from './product-car-one-loader.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";



@NgModule({
  declarations: [

  ],
  exports: [
    ProductCarOneLoaderComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    ProductCarOneLoaderComponent
  ]
})
export class ProductCarOneLoaderModule { }
