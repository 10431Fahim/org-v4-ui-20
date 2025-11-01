import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OngoSongothonComponent } from './ongo-songothon.component';

const routes: Routes = [
  {
    path:'',component:OngoSongothonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OngoSongothonRoutingModule { }
