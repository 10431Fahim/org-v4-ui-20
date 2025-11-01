import {Component, Input, OnInit} from '@angular/core';
import {NgxSkeletonLoaderComponent} from 'ngx-skeleton-loader';

@Component({
  selector: 'app-press-conference-loader',
  templateUrl: './press-conference-loader.component.html',
  imports: [
    NgxSkeletonLoaderComponent
  ],
  styleUrls: ['./press-conference-loader.component.scss']
})
export class PressConferenceLoaderComponent implements OnInit {
  @Input() type: string = 'grid';
  constructor() { }

  ngOnInit(): void {
  }

}
