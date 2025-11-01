import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubPathagarComponent } from './sub-pathagar.component';

const routes: Routes = [
  {
    path:':id',component:SubPathagarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubPathagarRoutingModule { }
