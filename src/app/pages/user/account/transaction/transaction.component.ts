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

    if (this.isBengaliLanguage()) {
      htmlContent = `
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://bnpbd.org/assets/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 140px;" src="https://bnpbd.org/assets/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
    <div>
      <h1 style="font-size: 20px; line-height: 18px; text-align: center; margin-bottom: 0!important;">বিসমিল্লাহির রহমানির রাহিম</h1>
      <h2 style="font-size: 30px; text-align: center; line-height: 20px;">বাংলাদেশ জাতীয়তাবাদী দল</h2>
    </div>
  </div>

  <div style="display:flex; justify-content: center; align-items: center; flex-direction: column; margin-top: -30px;">
    <h3 style="line-height: 16px; font-size: 20px; margin-bottom: 0;">${data?.transactionType}</h3>
    <h3 style="line-height: 20px; font-size: 20px; margin-bottom: 5px; color: #ff5292;">সদস্য আইডি ${userData?.memberId}</h3>
  </div>

  <div style="display: grid; grid-template-columns: 50% 50%;">
    <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
      <span>নাম:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.name} </span>
    </div>
    <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
      <span>বয়স:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.age} </span>
    </div>
  </div>



  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>ফোন/মোবাইল নাম্বার:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.countryCode}${userData?.phoneNo} </span>
  </div>

  <div style="display: grid; grid-template-columns: 50% 50%;">
    <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
      <span>ইমেইল:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.email} </span>
    </div>
    <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
      <span>হোয়াটসঅ্যাপ নাম্বার:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.whatsAppNumber} </span>
    </div>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>বাসিন্দার অবস্থা:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.resident} </span>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>বর্তমান বসবাসের দেশ:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.country} </span>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>শহর:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.city} </span>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>জিপ/পোস্টাল কোড:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.zip} </span>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>স্থায়ী দেশ:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.countryPermanent} </span>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>স্থায়ী শহর:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.cityPermanent} </span>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>স্থায়ী জিপ/পোস্টাল কোড:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.zipPermanent} </span>
  </div>

  <div style="display:flex; margin-top: 8px; font-size: 20px; align-content: center;">
    <span>ফেসবুক প্রোফাইল লিংক:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${userData?.facebookId ?? 'N/A'} </span>
  </div>

  <p style="text-align: center;"><b>${formData?.transactionType}:</b> ${userData?.amount} টাকা</p>

  <div style="display: flex; justify-content: space-between;">
    <div style="display:flex; margin-top: 8px; font-size: 20px; border-top: 1px solid #000;">
      <span>চেয়ারপারসন</span>
    </div>
    <div style="display:flex; margin-top: 8px; font-size: 20px; border-top: 1px solid #000;">
<!--      <span>সদস্যের স্বাক্ষর</span>-->
    </div>
    <div style="display:flex; margin-top: 8px; font-size: 20px; border-top: 1px solid #000;">
      <span>সংগ্রাহকের স্বাক্ষর</span>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 33.33% 33.33% 33.33%; margin-top: 8px;">
    <div style="display:flex; margin-top: 10px; font-size: 20px;"></div>
    <div style="display:flex; margin-top: 10px; font-size: 20px; margin-right: 25px;">
<!--      <span>তারিখ</span>-->
<!--      <p style="border-top: 1px solid #000; width: 100%;"></p>-->
    </div>
    <div style="display:flex; margin-top: 10px; font-size: 20px;">
      <span>তারিখ</span>
      <p style="border-top: 1px solid #000; width: 100%;"></p>
    </div>
  </div>

</div>

`;
    }else{
      htmlContent = `
   <!--<div class="preview-container">-->
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://bnpbd.org/assets/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">
<!--  <div style="display:flex;justify-content: center;margin-bottom: 10px">-->
<!--    <h1 style="font-size: 16px">Bismillahir Rahmanir Rahim</h1>-->
<!--  </div>-->

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 140px;" src="https://bnpbd.org/assets/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px;  line-height: 18px; text-align: center;margin-bottom: 0!important;">Bismillahir Rahmanir Rahim</h1>
    <h2 style="font-size: 30px;text-align: center; line-height: 20px">Bangladesh Nationalist Party</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -30px">
    <h3 style="line-height: 16px;font-size: 20px;margin-bottom: 0">${data?.transactionType}</h3>
    <h3 style="line-height: 20px;font-size: 20px;margin-bottom: 5px;color: #ff5292;">Mrmber ID${userData?.memberId}</h3>
<!--    <h3 style="line-height: 30px;font-size: 20px;margin-bottom: 0">Member's Part</h3>-->
  </div>

<div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span>Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.name} </span>
  </div>
    <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Age:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.age}</span>
  </div>
  </div>


    <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Phone / Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.countryCode}${userData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Email:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.email}</span>
  </div>

  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">WhatsApp Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.whatsAppNumber}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Resident Status:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.resident}</span>
  </div>



<!--  <div style="display: grid;grid-template-columns: 50% 50%">-->
    <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">Present Resident Country:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.country}</span>
    </div>
  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">City:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.city}</span>
    </div>
<!--  </div>-->

<!--<div style="display: grid;grid-template-columns: 50% 50%">-->
  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.zip}</span>
    </div>

    <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Permanent Resident Country:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.countryPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;"> City:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.cityPermanent}</span>
  </div>
  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.zipPermanent}</span>
    </div>
  <div style="display:flex;margin-top: 8px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Facebook Profile Link:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${userData?.facebookId ?? 'N/A'}</span>
  </div>
<!--  </div>-->
<p style="text-align: center"><b>${formData?.transactionType}:</b> ${userData?.amount} Taka</p>

<!--  <div style="display:flex;margin-top: 5px;font-size: 19px">-->
<!--   <p style="line-height: 24px">I solemnly declare that I hold deep respect for the constitution, declaration, and ideals and objectives of the Bangladesh Nationalist Party. I further declare my firm commitment to uphold Bangladeshi nationalism, the politics of production, people's democracy, national unity, and the achievement of peace and prosperity through the implementation of the 19-point program endorsed by the people in 1977. I pledge never to tolerate corruption. I hereby apply to be accepted as a member of the Bangladesh Nationalist Party.</p>-->
<!--  </div>-->

  <div style="display: flex;justify-content: space-between;">
    <div style="display:flex;margin-top: 8px;font-size: 20px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Chairperson</span>
    </div>
    <div style="display:flex;margin-top: 8px;font-size: 20px;border-top: 1px solid #000000;">
<!--      <span style="text-wrap: nowrap;">Member's signature</span>-->
    </div>
    <div style="display:flex;margin-top: 8px;font-size: 20px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Collector's signature</span>
    </div>
  </div>


  <div style="display: grid;grid-template-columns: 33.33% 33.33% 33.33%;margin-top: 8px">
    <div style="display:flex;margin-top: 10px;font-size: 20px">
    </div>
    <div style="display:flex;margin-top: 10px;font-size: 20px;margin-right: 25px">
<!--      <span style="text-wrap: nowrap;">Date</span>-->
<!--      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>-->
    </div>
    <div style="display:flex;margin-top: 10px;font-size: 20px">
      <span style="text-wrap: nowrap;">Date</span>
      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>
    </div>
  </div>

</div>
</div>
    `;
    }

    this.contactService.generatePDF(htmlContent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data?.transactionType}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
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
