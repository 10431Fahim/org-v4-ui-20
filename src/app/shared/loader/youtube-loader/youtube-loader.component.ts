import { Component, OnInit } from '@angular/core';
import {NgxSkeletonLoaderComponent} from 'ngx-skeleton-loader';

@Component({
  selector: 'app-youtube-loader',
  templateUrl: './youtube-loader.component.html',
  imports: [
    NgxSkeletonLoaderComponent
  ],
  styleUrls: ['./youtube-loader.component.scss']
})
export class YoutubeLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
