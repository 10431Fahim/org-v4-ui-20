import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-upodeshta-counsil',
  templateUrl: './upodeshta-counsil.component.html',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  standalone:true,
  styleUrls: ['./upodeshta-counsil.component.scss']})
export class UpodeshtaCounsilComponent implements OnInit {

  constructor(
    ) { }

  ngOnInit(): void {
  }

}
