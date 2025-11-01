import {Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {PaymentService} from '../../../services/common/payment.service';
import {StorageService} from '../../../services/core/storage.service';

@Component({
  selector: 'app-payment-bkash',
  templateUrl: './payment-nagad.component.html',
  styleUrls: ['./payment-nagad.component.scss'],

})
export class PaymentNagadComponent implements OnInit {

  paymentRefID: string = '';
  status: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private storageService: StorageService,
    private router: Router,

  ) {

  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    return false;
    //I have used return false but you can your other functions or any query or condition
  }


  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(qParam => {
      this.paymentRefID = qParam.get('payment_ref_id') || '';
      this.status = qParam.get('status') || '';
      // console.log('this.paymentRefID', this.paymentRefID);
      // console.log('this.status', this.status);
      if (this.paymentRefID) {
        this.nagadVerifyPayment();
      } else {
        this.storageService.removeLocalData(DATABASE_KEY.tempOrderIdSession);
        this.router.navigate(['/payment/fail'], {queryParams: {message: 'Payment canceled.'}});
      }
    });
  }


  private nagadVerifyPayment() {
    const data = {
      paymentRefID: this.paymentRefID,
      status: this.status,
    };

    this.paymentService.nagadVerifyPayment(data)
      .subscribe({
        next: res => {
          if (res.data.status === 'Success') {
            this.router.navigate(['/payment/success', {queryParams: {message: res.message}}]);
          } else {
            this.router.navigate(['/payment/fail'], {queryParams: {message: res.message}});
          }
        },
        error: err => {
          console.log(err)
        }
      });

  }


}
