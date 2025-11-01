import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PremiershipBrgumKhaladaZia1Component } from './premiership-brgum-khalada-zia1.component';


const routes: Routes = [
  {
    path:'',component:PremiershipBrgumKhaladaZia1Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiershipBrgumKhaladaZia1RoutingModule { }
