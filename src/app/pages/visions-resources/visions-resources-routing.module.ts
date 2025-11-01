import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VisionsResourcesComponent} from "./visions-resources.component";
import { StoryDetailsComponent } from './story-details/story-details.component';
import {PressReleasesDetailsComponent} from "./press-releases-details/press-releases-details.component";

const routes: Routes = [
  {
    path:"",
    component:VisionsResourcesComponent
  } ,
  {
    path:"story-details/:id",
    component:StoryDetailsComponent
  } ,
  {
    path:"press-releases-details/:id",
    component:PressReleasesDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisionsResourcesRoutingModule { }
