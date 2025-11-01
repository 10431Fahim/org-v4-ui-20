import { Component, OnInit } from '@angular/core';
import {NgxSkeletonLoaderComponent} from 'ngx-skeleton-loader';

@Component({
  selector: 'app-program-loader',
  templateUrl: './program-loader.component.html',
  imports: [
    NgxSkeletonLoaderComponent
  ],
  styleUrls: ['./program-loader.component.scss']
})
export class ProgramLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
