import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-payment-cancel',
  templateUrl: './payment-cancel.component.html',
  imports: [
    RouterLink,
    MatButton
  ],
  standalone:true,
  styleUrls: ['./payment-cancel.component.scss'],

})
export class PaymentCancelComponent implements OnInit {

  constructor(

  ) { }

  ngOnInit(): void {
  }

}
