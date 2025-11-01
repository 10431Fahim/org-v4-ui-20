import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeenDofaComponent } from './teen-dofa.component';


const routes: Routes = [
  {
    path: '',
    component: TeenDofaComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeenDofaRoutingModule { }
