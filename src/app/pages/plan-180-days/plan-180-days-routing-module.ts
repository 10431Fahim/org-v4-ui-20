import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Plan180Days } from './plan-180-days';

const routes: Routes = [
  { path: '', component: Plan180Days }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Plan180DaysRoutingModule { }
