import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanToBuildNationComponent } from './plan-to-build-nation.component';

const routes: Routes = [
  {
    path: '',
    component: PlanToBuildNationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanToBuildNationRoutingModule { }
