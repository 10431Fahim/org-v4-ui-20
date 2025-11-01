import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {YoutubeVideoComponent} from "./youtube-video/youtube-video.component";
import {VideoDetailsComponent} from "./video-details/video-details.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'all-videos', component: YoutubeVideoComponent},
  {path: 'video-details/:id', component: VideoDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
