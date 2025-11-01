import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JatioNirbahiComitteComponent } from './jatio-nirbahi-comitte.component';

const routes: Routes = [
  {
    path:'',component:JatioNirbahiComitteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JatioNirbahiComitteRoutingModule { }
