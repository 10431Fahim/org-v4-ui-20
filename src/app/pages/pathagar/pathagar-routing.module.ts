import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathagarComponent } from './pathagar.component';

const routes: Routes = [
  {
    path: '', component: PathagarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PathagarRoutingModule { }
