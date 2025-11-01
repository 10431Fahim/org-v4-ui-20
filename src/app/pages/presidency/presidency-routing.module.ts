import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresidencyComponent } from './presidency.component';
const routes: Routes = [
  {
    path:'',component:PresidencyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresidencyRoutingModule { }
