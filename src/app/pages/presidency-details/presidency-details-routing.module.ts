import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresidencyDetailsComponent } from './presidency-details.component';

const routes: Routes = [
  {
    path:'',component:PresidencyDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresidencyDetailsRoutingModule { }
