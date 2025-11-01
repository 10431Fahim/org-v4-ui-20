import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PremiershipBrgumKhaladaZia2Component } from './premiership-brgum-khalada-zia2.component';

const routes: Routes = [
  {
    path:'',component:PremiershipBrgumKhaladaZia2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiershipBrgumKhaladaZia2RoutingModule { }
