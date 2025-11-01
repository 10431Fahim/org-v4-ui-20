import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongothonComponent } from './songothon.component';

const routes: Routes = [
  {
    path:'',component:SongothonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongothonRoutingModule { }
