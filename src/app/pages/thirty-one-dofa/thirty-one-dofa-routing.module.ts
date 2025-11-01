import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ThirtyOneDofaComponent} from "./thirty-one-dofa.component";

const routes: Routes = [
  {
    path: '',
    component: ThirtyOneDofaComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThirtyOneDofaRoutingModule { }
