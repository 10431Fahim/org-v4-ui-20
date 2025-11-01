import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PorichitoComponent } from './porichito.component';
import { PorichitoRoutingModule } from './porichito-routing.module';
import { BannerModule } from '../../shared/lazy/banner/banner.module';
import { TranslateModule } from '@ngx-translate/core';
import {PipesModule} from '../../shared/pipes/pipes.module';




@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PorichitoRoutingModule,
    BannerModule,
    PipesModule,
    TranslateModule,
    PorichitoComponent,
  ]
})
export class PorichitoModule { }
