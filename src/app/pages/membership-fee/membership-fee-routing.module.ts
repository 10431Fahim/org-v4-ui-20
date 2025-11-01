import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MembershipFeeComponent} from "./membership-fee.component";

const routes: Routes = [
  {
    path: '',
    component: MembershipFeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipFeeRoutingModule { }
