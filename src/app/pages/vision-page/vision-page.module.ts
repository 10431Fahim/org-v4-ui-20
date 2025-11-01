import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisionPageRoutingModule } from './vision-page-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    VisionPageRoutingModule,
    PipesModule,
    TranslateModule
  ]
})
export class VisionPageModule { }
