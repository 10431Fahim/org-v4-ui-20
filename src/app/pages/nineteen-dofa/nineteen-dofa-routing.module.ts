import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NineteenDofaComponent } from './nineteen-dofa.component';

const routes: Routes = [
  {
    path: '',
    component: NineteenDofaComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NineteenDofaRoutingModule { }
