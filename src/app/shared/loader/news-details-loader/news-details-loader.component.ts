import {Component, Input, OnInit} from '@angular/core';
import {NgxSkeletonLoaderComponent} from 'ngx-skeleton-loader';

@Component({
  selector: 'app-news-details-loader',
  templateUrl: './news-details-loader.component.html',
  imports: [
    NgxSkeletonLoaderComponent
  ],
  standalone:true,
  styleUrls: ['./news-details-loader.component.scss']
})
export class NewsDetailsLoaderComponent implements OnInit {
  @Input() type: string = 'grid';
  constructor() { }

  ngOnInit(): void {
  }

}
