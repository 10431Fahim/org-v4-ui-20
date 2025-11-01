import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpVerificationComponent } from './otp-verification.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../pipes/pipes.module';
import {MatInputModule} from '@angular/material/input';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipesModule,
    MatInputModule,
    OtpVerificationComponent,
  ],
  exports: [
    OtpVerificationComponent
  ]
})
export class OtpVerificationModule { }
