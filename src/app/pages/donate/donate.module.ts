import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonateRoutingModule } from './donate-routing.module';
import { DonateComponent } from './donate.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {OtpVerificationModule} from "../../shared/lazy/otp-verification/otp-verification.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatStepperModule} from "@angular/material/stepper";
import {PipesModule} from "../../shared/pipes/pipes.module";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    DonateRoutingModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    OtpVerificationModule,
    MatStepperModule,
    PipesModule,
    DonateComponent,
  ]
})
export class DonateModule { }
