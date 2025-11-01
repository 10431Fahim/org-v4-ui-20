import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaymentComponent} from './payment.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';
import {PaymentCancelComponent} from './payment-cancel/payment-cancel.component';
import {PaymentFailComponent} from './payment-fail/payment-fail.component';
import {PaymentNagadComponent} from './payment-nagad/payment-nagad.component';
import {PaymentBkashComponent} from './payment-bkash/payment-bkash.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      {path: '', redirectTo: 'success',pathMatch: 'full',},
      {path: 'success', component: PaymentSuccessComponent},
      {path: 'cancel', component: PaymentCancelComponent},
      {path: 'fail', component: PaymentFailComponent},
      {path: 'payment-nagad', component: PaymentNagadComponent},
      {path: 'check-bkash-payment', component: PaymentBkashComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
