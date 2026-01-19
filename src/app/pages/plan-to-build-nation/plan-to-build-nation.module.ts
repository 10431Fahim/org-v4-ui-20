import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanToBuildNationRoutingModule } from './plan-to-build-nation-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../shared/pipes/pipes.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlanToBuildNationRoutingModule,
    PipesModule,
    TranslateModule
  ]
})
export class PlanToBuildNationModule { }
