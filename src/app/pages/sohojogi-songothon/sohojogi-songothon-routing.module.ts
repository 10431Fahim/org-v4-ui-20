import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SohojogiSongothonComponent } from './sohojogi-songothon.component';

const routes: Routes = [
  {
    path:'',component:SohojogiSongothonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SohojogiSongothonRoutingModule { }
