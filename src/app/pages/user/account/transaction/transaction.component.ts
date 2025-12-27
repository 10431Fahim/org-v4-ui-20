import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, effect, DestroyRef, inject} from '@angular/core';
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {UserDataService} from "../../../../services/common/user-data.service";
import {ReloadService} from "../../../../services/core/reload.service";
import {ActivatedRoute} from "@angular/router";
import {ContactService} from "../../../../services/common/contact.service";
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  standalone: true,
  imports: [
    DatePipe,
    MatIcon
  ],
  styleUrls: ['./transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  user = signal<any>(null);
  userData = signal<any>(null);
  phoneNo = signal<any>(null);
  language = signal<string>('en');
  isLoading = signal<boolean>(false);

  // Computed signals for derived state
  hasUserData = computed(() => this.userData() !== null);
  hasTransactions = computed(() => this.user() !== null && Array.isArray(this.user()) && this.user().length > 0);
  isBengaliLanguage = computed(() => this.language() === 'bn');
  transactionCount = computed(() => this.user()?.length || 0);

  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);

  //Subscription (keeping for backward compatibility, will migrate to signals)
  private subReloadService!: Subscription;
  private subUserDataService!: Subscription;
  constructor(
    private dialog: MatDialog,
    protected userDataService: UserDataService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService
  ) {
    // Angular 20 Effects for side effects management
    effect(() => {
      const userData = this.userData();
      if (userData?.phoneNo) {
        this.phoneNo.set(userData.phoneNo);
      }
    });

    effect(() => {
      const transactions = this.user();
      if (transactions && Array.isArray(transactions)) {
      }
    });
  }

  ngOnInit(): void {
    // Query parameters handling with signals
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        const language = qParam.get('language') || 'en';
        this.language.set(language);
      });

    // Get logged user info with modern subscription handling
    this.subReloadService = this.reloadService.refreshData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getLoggedInUserInfo();
      });

    this.getLoggedInUserInfo();
  }

  /**
   * Login function
   * getLoggedInUserInfo()
   */
  private getLoggedInUserInfo() {
    this.isLoading.set(true);
    this.subUserDataService = this.userDataService.getLoggedInUserData("name age country resident city zip countryPermanent cityPermanent zipPermanent qualification occupation whatsAppNumber memberShipType paymentStatus amount createdAt paymentMethod username email memberId gender phoneNo countryCode createdAt")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.user.set(res?.data?.transactions);
          this.userData.set(res?.data?.user);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);
        }
      });
  }



  downloadForm(data: any): void {
    // Build HTML content based on sodosso-form design and registration form data
    const formData = data;
    const userData = this.userData();
    let htmlContent: any;

    const issueDate = new Date().toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const transactionDate = formData?.createdAt
      ? new Date(formData.createdAt).toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : issueDate;
    const currency =
      userData?.country === 'BD' || userData?.country === 'Bangladesh'
        ? 'টাকা'
        : ' USD';
    const amount = formData?.amount || userData?.amount || '০';
    // Use transaction ID or member ID for QR code
    const mongoId = formData?._id || formData?.id || userData?.memberId || '';
    const qrCodeUrl = mongoId
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mongoId.toString())}`
      : '';

    if (this.isBengaliLanguage()) {
      htmlContent = `
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<div #pdfContent id="pdf-content" class="pdf-style" style="
    width:1000px;
    font-family:'Kalpurush','Noto Sans Bengali','Century','Times New Roman',Times,Georgia,serif;
    font-weight:400;
    font-style:normal;
    margin:0 auto;
    background:#fff;
    padding:15px;
    border-radius:10px;
    box-shadow:0 15px 45px rgba(0,0,0,0.25);
    border:12px solid #b89c5d;
    outline:10px solid #006A4E;
    position:relative;
">
            <div style="
                border:4px solid #d5bc79;
                padding:30px 30px 20px;
                position:relative;
                background:#fafaf7;
                overflow:hidden;
            ">
                <div style="
                    position:absolute;
                    inset:0;
                    background:url('https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png') center no-repeat;
                    background-size:cover;
                    opacity:.07;
                    pointer-events:none;
                    z-index:1;
                "></div>
                <img src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
                    crossorigin="anonymous"
                    referrerpolicy="no-referrer"
                    style="
                        width:100px;
                        opacity:.96;
                        position:absolute;
                        top:60px;
                        left:30px;
                        z-index:20;
                    ">
                <div style="
                    text-align:center;
                    position:relative;
                    z-index:30;
                ">
                    <div style="font-size:14px;color:#444;margin-bottom:4px;">
                        বিসমিল্লাহির রহমানির রাহীম
                    </div>
                    <div style="font-size:28px;font-weight:400;color:#006A4E;letter-spacing:1px;">
                        বাংলাদেশ জাতীয়তাবাদী দল – বিএনপি
                    </div>
                    <div style="font-size:16px;color:#333;margin-top:3px;font-style:normal;">
                        কেন্দ্রীয় দফতর
                    </div>
                    <div style="font-size:20px;color:#333;margin-top:4px;font-weight:400;">
                        ${formData?.transactionType || 'লেনদেন রশিদ'}
                    </div>
                </div>
                <div style="text-align:center;margin-top:15px;position:relative;z-index:30;">
                    <span style="
                        display:inline-block;
                        background:linear-gradient(90deg,#006A4E,#D60000);
                        color:#fff;
                        padding:6px 30px;
                        border-radius:35px;
                        font-size:14px;
                        font-weight:400;
                        border:2px solid #fff;
                        box-shadow:0 0 12px rgba(0,0,0,0.25);
                    ">
                        লেনদেন রশিদ
                    </span>
                    <br>
                    <span style="
                        font-size:24px;
                        font-weight:400;
                        color:#006A4E;
                        border-bottom:3px solid #d6c386;
                        padding:3px 20px;
                        display:inline-block;
                        margin-top:6px;
                    ">
                        ${userData?.name || ''}
                    </span>
                </div>
                <table style="
                    width:100%;
                    border-collapse:collapse;
                    margin-top:18px;
                    font-size:16px;
                    color:#222;
                    position:relative;
                    z-index:30;
                ">
                    <tr>
                        <td style="padding:4px 2px 4px 0;">সদস্য আইডি</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.memberId || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">বয়স</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.age || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">ফোন/মোবাইল</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.countryCode || ''}${userData?.phoneNo || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">ইমেইল</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.email || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">বর্তমান বসবাসের দেশ</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.country || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">শহর</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.city || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">জিপ/পোস্টাল কোড</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.zip || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">স্থায়ী ঠিকানা (দেশ)</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.countryPermanent || ''}</span></td>
                    </tr>
                </table>
                <div style="
                    margin-top:18px;
                    text-align:center;
                    font-size:16px;
                    font-weight:400;
                    padding:10px 18px;
                    border-radius:10px;
                    border:2px solid #d3bb76;
                    background:linear-gradient(90deg,rgba(0,106,78,.08),rgba(214,0,0,.08));
                    color:#574f3a;
                    position:relative;
                    z-index:30;
                ">
                    ${formData?.transactionType || 'লেনদেন'}: <b style="color:#D60000;font-weight:400;">${amount}${currency}</b> · 
                    তারিখ: <b style="font-weight:400;">${transactionDate}</b>
                </div>
                <div style="
                    margin-top:18px;
                    display:flex;
                    justify-content:space-between;
                    font-size:15px;
                    text-align:center;
                    position:relative;
                    z-index:30;
                ">
                    <div style="margin-top:15px;flex:1;text-align:center;">
                        <img src="https://api.bnpbd.org/api/upload/images/sign.png" 
                             crossorigin="anonymous"
                             referrerpolicy="no-referrer"
                             alt="Chairman Signature" 
                             style="max-width:90px;height:30px;display:block;margin:0 auto 6px auto;">
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #006A4E;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">চেয়ারপার্সন</span>
                    </div>
                    <div style="flex:1;text-align:center;">
                        <div style="margin-top:25px;height:18px;margin-bottom:6px;font-size:13px;color:#333;">
                            ${transactionDate}
                        </div>
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #444;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">তারিখ</span>
                    </div>
                    <div style="flex:1;text-align:center;">
                        ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous" referrerpolicy="no-referrer" style="max-width:45px;height:45px;display:block;margin:0 auto 6px auto;object-fit:contain;">` : ''}
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #D60000;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">আদায়কারীর স্বাক্ষর</span>
                    </div>
                </div>
            </div>
</div>
`;
    }else{
      const transactionDateEn = formData?.createdAt
        ? new Date(formData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
      const currencyEn =
        userData?.country === 'BD' || userData?.country === 'Bangladesh'
          ? ' Taka'
          : ' USD';
      
      htmlContent = `
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<div #pdfContent id="pdf-content" class="pdf-style" style="
    width:1000px;
    font-family:'Kalpurush','Noto Sans Bengali','Century','Times New Roman',Times,Georgia,serif;
    font-weight:400;
    font-style:normal;
    margin:0 auto;
    background:#fff;
    padding:15px;
    border-radius:10px;
    box-shadow:0 15px 45px rgba(0,0,0,0.25);
    border:12px solid #b89c5d;
    outline:10px solid #006A4E;
    position:relative;
">
            <div style="
                border:4px solid #d5bc79;
                padding:30px 30px 20px;
                position:relative;
                background:#fafaf7;
                overflow:hidden;
            ">
                <div style="
                    position:absolute;
                    inset:0;
                    background:url('https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png') center no-repeat;
                    background-size:cover;
                    opacity:.07;
                    pointer-events:none;
                    z-index:1;
                "></div>
                <img src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
                 
                    style="
                        width:100px;
                        opacity:.96;
                        position:absolute;
                        top:60px;
                        left:30px;
                        z-index:200;
                    ">
                <div style="
                    text-align:center;
                    position:relative;
                    z-index:30;
                ">
                    <div style="font-size:14px;color:#444;margin-bottom:4px;">
                        Bismillahir Rahmanir Rahim
                    </div>
                    <div style="font-size:28px;font-weight:400;color:#006A4E;letter-spacing:1px;">
                        Bangladesh Nationalist Party – BNP
                    </div>
                    <div style="font-size:16px;color:#333;margin-top:3px;font-style:normal;">
                        Central Office
                    </div>
                    <div style="font-size:20px;color:#333;margin-top:4px;font-weight:400;">
                        ${formData?.transactionType || 'Transaction Receipt'}
                    </div>
                </div>
                <div style="text-align:center;margin-top:15px;position:relative;z-index:30;">
                    <span style="
                        display:inline-block;
                        background:linear-gradient(90deg,#006A4E,#D60000);
                        color:#fff;
                        padding:6px 30px;
                        border-radius:35px;
                        font-size:14px;
                        font-weight:400;
                        border:2px solid #fff;
                        box-shadow:0 0 12px rgba(0,0,0,0.25);
                    ">
                        Transaction Receipt
                    </span>
                    <br>
                    <span style="
                        font-size:24px;
                        font-weight:400;
                        color:#006A4E;
                        border-bottom:3px solid #d6c386;
                        padding:3px 20px;
                        display:inline-block;
                        margin-top:6px;
                    ">
                        ${userData?.name || ''}
                    </span>
                </div>
                <table style="
                    width:100%;
                    border-collapse:collapse;
                    margin-top:18px;
                    font-size:16px;
                    color:#222;
                    position:relative;
                    z-index:30;
                ">
                    <tr>
                        <td style="padding:4px 2px 4px 0;">Member ID</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.memberId || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">Age</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.age || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">Phone/Mobile</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.countryCode || ''}${userData?.phoneNo || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">Email</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.email || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">Present Resident Country</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.country || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">City</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.city || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">Zip/Postal Code</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.zip || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">Permanent Address (Country)</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${userData?.countryPermanent || ''}</span></td>
                    </tr>
                </table>
                <div style="
                    margin-top:18px;
                    text-align:center;
                    font-size:16px;
                    font-weight:400;
                    padding:10px 18px;
                    border-radius:10px;
                    border:2px solid #d3bb76;
                    background:linear-gradient(90deg,rgba(0,106,78,.08),rgba(214,0,0,.08));
                    color:#574f3a;
                    position:relative;
                    z-index:30;
                ">
                    ${formData?.transactionType || 'Transaction'}: <b style="color:#D60000;font-weight:400;">${amount}${currencyEn}</b> · 
                    Date: <b style="font-weight:400;">${transactionDateEn}</b>
                </div>
                <div style="
                    margin-top:18px;
                    display:flex;
                    justify-content:space-between;
                    font-size:15px;
                    text-align:center;
                    position:relative;
                    z-index:30;
                ">
                    <div style="margin-top:15px;flex:1;text-align:center;">
                        <img src="https://api.bnpbd.org/api/upload/images/sign.png" 
                             crossorigin="anonymous"
                             referrerpolicy="no-referrer"
                             alt="Chairman Signature" 
                             style="max-width:90px;height:30px;display:block;margin:0 auto 6px auto;">
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #006A4E;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">Chairperson</span>
                    </div>
                    <div style="flex:1;text-align:center;">
                        <div style="margin-top:25px;height:18px;margin-bottom:6px;font-size:13px;color:#333;">
                            ${transactionDateEn}
                        </div>
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #444;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">Date</span>
                    </div>
                    <div style="flex:1;text-align:center;">
                        ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous" referrerpolicy="no-referrer" style="max-width:45px;height:45px;display:block;margin:0 auto 6px auto;object-fit:contain;">` : ''}
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #D60000;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">Collector's Signature</span>
                    </div>
                </div>
            </div>
</div>
    `;
    }

    this.contactService.generatePDF(htmlContent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pdfBlob) => {
          const url = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${data?.transactionType || 'Transaction'}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          console.error('Failed to generate PDF');
        }
      });
  }
  /**
   * Hook
   * ngOnDestroy()
   */
  ngOnDestroy(): void {
    if (this.subReloadService) {
      this.subReloadService.unsubscribe();
    }
    if (this.subUserDataService) {
      this.subUserDataService.unsubscribe();
    }
  }
}
