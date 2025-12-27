import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateVerificationComponent } from './certificate-verification.component';

const routes: Routes = [
  { path: '', component: CertificateVerificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificateVerificationRoutingModule { }

