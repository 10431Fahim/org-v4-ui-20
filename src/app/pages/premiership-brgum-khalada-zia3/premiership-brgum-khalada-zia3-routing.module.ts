import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PremiershipBrgumKhaladaZia3Component } from './premiership-brgum-khalada-zia3.component';

const routes: Routes = [
  {
    path:'',component:PremiershipBrgumKhaladaZia3Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiershipBrgumKhaladaZia3RoutingModule { }
