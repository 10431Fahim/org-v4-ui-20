import { Component, OnInit } from '@angular/core';
import {NgxSkeletonLoaderComponent} from 'ngx-skeleton-loader';

@Component({
  selector: 'app-recently-news-loader',
  templateUrl: './recently-news-loader.component.html',
  imports: [
    NgxSkeletonLoaderComponent
  ],
  styleUrls: ['./recently-news-loader.component.scss']
})
export class RecentlyNewsLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
