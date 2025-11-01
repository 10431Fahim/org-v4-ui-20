import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpodeshtaCounsilComponent } from './upodeshta-counsil.component';

const routes: Routes = [
  {
    path:'',component:UpodeshtaCounsilComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpodeshtaCounsilRoutingModule { }
