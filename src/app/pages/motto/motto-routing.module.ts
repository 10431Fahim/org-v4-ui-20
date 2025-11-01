import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MottoComponent } from './motto.component';

const routes: Routes = [
  {
    path: '',
    component: MottoComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MottoRoutingModule { }
