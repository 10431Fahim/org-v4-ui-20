import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-payment-fail',
  templateUrl: './payment-fail.component.html',
  imports: [
    NgIf,
    MatButton,
    RouterLink
  ],
  styleUrls: ['./payment-fail.component.scss'],

})
export class PaymentFailComponent implements OnInit {

  message: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(qParam => {
      this.message = qParam.get('message') || null;
    });
  }

}
