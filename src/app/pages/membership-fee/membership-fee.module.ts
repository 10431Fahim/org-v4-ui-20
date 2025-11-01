import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembershipFeeRoutingModule } from './membership-fee-routing.module';
import { MembershipFeeComponent } from './membership-fee.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatStepperModule} from "@angular/material/stepper";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OtpVerificationModule} from "../../shared/lazy/otp-verification/otp-verification.module";
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MembershipFeeRoutingModule,
    MaterialModule,
    TranslateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    OtpVerificationModule,
    PipesModule,
    MembershipFeeComponent,
  ]
})
export class MembershipFeeModule { }
