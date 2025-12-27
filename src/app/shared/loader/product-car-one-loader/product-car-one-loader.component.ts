import {Component, Input, OnInit} from '@angular/core';
import {NgxSkeletonLoaderComponent} from 'ngx-skeleton-loader';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-product-car-one-loader',
  templateUrl: './product-car-one-loader.component.html',
  imports: [
    NgxSkeletonLoaderComponent,
    NgIf
  ],
  standalone:true,
  styleUrls: ['./product-car-one-loader.component.scss']
})
export class ProductCarOneLoaderComponent implements OnInit {
  @Input() type: string = 'grid';
  constructor() { }

  ngOnInit(): void {
  }

}
