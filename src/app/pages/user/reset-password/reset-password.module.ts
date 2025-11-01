
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MaterialModule} from '../../../material/material.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    MaterialModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ResetPasswordModule { }
