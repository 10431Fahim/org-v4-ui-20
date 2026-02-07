import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Manifesto } from './manifesto';

const routes: Routes = [
  {
    path: '',
    component: Manifesto
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManifestoRoutingModule { }
