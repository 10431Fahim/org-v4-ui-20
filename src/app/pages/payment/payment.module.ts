import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaymentRoutingModule} from './payment-routing.module';
import {MaterialModule} from '../../material/material.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    MaterialModule
  ]
})
export class PaymentModule {
}
