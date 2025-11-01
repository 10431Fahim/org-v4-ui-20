import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathagarComponent } from './pathagar.component';
import { PathagarRoutingModule } from './pathagar-routing.module';
import { BannerModule } from '../../shared/lazy/banner/banner.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PathagarRoutingModule,
    BannerModule,
    TranslateModule,
    PathagarComponent,
  ],
  exports:[
    PathagarComponent
  ]
})
export class PathagarModule { }
