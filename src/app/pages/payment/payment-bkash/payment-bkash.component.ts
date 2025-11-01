import {Component, HostListener, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {StorageService} from '../../../services/core/storage.service';
import {PaymentService} from '../../../services/common/payment.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-payment-bkash',
  templateUrl: './payment-bkash.component.html',
  styleUrls: ['./payment-bkash.component.scss'],

})
export class PaymentBkashComponent implements OnInit, OnDestroy {

  paymentID: any;
  status: any;

  // Subscriptions
  private subDataOne!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private storageService: StorageService,
    private router: Router,

  ) {

  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event:any) {
    return false;
    //I have used return false but you can your other functions or any query or condition
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(qParam => {
      this.paymentID = qParam.get('paymentID');
      this.status = qParam.get('status');
      if (this.status && this.paymentID) {
        this.callbackBkashPayment();
      } else {
        this.storageService.removeLocalData(DATABASE_KEY.tempOrderIdSession);
        this.router.navigate(['/payment/fail'], {queryParams: {message: 'Payment canceled.'}});
      }
    });
  }


  private callbackBkashPayment() {
    const data = {
      paymentID: this.paymentID,
      status: this.status,
    };

    this.paymentService.callbackBkashPayment(data)
      .subscribe({
        next: res => {
          if (res.data.statusCode === '0000') {
            this.storageService.removeLocalData(DATABASE_KEY.userCart);
            this.storageService.removeLocalData(DATABASE_KEY.cartsProduct);
            this.router.navigate(['/payment/success'], {queryParams: {message: res.data.message}});
          } else {
            this.router.navigate(['/payment/fail'], {queryParams: {message: res.data.message}});
          }
        },
        error: error => {
          console.log(error);
        }
      })

  }

  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
