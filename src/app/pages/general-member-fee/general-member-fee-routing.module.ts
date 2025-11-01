import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GeneralMemberFeeComponent} from "./general-member-fee.component";

const routes: Routes = [
  {
    path: '',
    component: GeneralMemberFeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralMemberFeeRoutingModule { }
