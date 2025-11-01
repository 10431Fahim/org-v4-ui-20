import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JatioSthaiComitteComponent } from './jatio-sthai-comitte.component';

const routes: Routes = [
  {
    path:'',component:JatioSthaiComitteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JatioSthaiSongothonRoutingModule { }
