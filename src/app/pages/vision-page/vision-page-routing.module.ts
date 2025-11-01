import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisionPageComponent } from './vision-page.component';

const routes: Routes = [
  {
    path:"",
    component:VisionPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisionPageRoutingModule { }
