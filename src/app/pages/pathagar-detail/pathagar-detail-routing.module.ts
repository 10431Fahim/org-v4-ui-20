import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathagarDetailComponent } from './pathagar-detail.component';

const routes: Routes = [
  {
    path: ':id', component: PathagarDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PathagarDetailRoutingModule { }
