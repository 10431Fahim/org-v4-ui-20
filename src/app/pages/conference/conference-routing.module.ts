import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConferenceComponent } from './conference.component';
import {ConferenceDetailsComponent} from "./conference-details/conference-details.component";

const routes: Routes = [
  {
    path:'',
    component:ConferenceComponent
  },
  {
    path:'press-conference/:id',
    component:ConferenceDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConferenceRoutingModule { }
