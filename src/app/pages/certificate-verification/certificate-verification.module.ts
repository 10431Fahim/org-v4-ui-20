import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateVerificationRoutingModule } from './certificate-verification-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CertificateVerificationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ]
})
export class CertificateVerificationModule { }

