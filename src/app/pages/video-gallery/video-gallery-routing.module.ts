import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VideoGalleryComponent} from "./video-gallery.component";


const routes: Routes = [
  {
    path:"",
    component:VideoGalleryComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoGalleryRoutingModule { }
