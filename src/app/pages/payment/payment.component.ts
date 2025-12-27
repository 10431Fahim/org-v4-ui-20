import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [
    RouterOutlet
  ],
  standalone:true,
  styleUrls: ['./payment.component.scss']})
export class PaymentComponent implements OnInit {

  constructor(
    ) { }

  ngOnInit(): void {
  }

}
