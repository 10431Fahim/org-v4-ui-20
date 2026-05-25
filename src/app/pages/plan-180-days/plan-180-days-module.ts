import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plan180DaysRoutingModule } from './plan-180-days-routing-module';
import { Plan180Days } from './plan-180-days';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Plan180DaysRoutingModule,
    Plan180Days
  ]
})
export class Plan180DaysModule { }
