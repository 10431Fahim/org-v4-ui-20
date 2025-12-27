import {Component, Input, OnInit} from '@angular/core';
import {NgxSkeletonLoaderComponent} from 'ngx-skeleton-loader';

@Component({
  selector: 'app-news-card-one-loader',
  templateUrl: './news-card-one-loader.component.html',
  imports: [
    NgxSkeletonLoaderComponent
  ],
  standalone:true,
  styleUrls: ['./news-card-one-loader.component.scss']
})
export class NewsCardOneLoaderComponent implements OnInit {
  @Input() type: string = 'grid';
  constructor() { }

  ngOnInit(): void {
  }

}
