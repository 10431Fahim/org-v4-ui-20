import {Component, Inject, OnInit, PLATFORM_ID, ViewChild, signal, computed, effect, inject, afterNextRender} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators, FormsModule} from "@angular/forms";
import {PaymentMethod} from "../../interfaces/common/payment-method.interface";
import {PAYMENT_METHODS} from "../../core/utils/app-data";
import {Subscription} from "rxjs";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {OtpService} from "../../services/common/otp.service";
import {UiService} from "../../services/core/ui.service";
import {UserService} from "../../services/common/user.service";
import {PaymentService} from "../../services/common/payment.service";
import {UtilsService} from "../../services/core/utils.service";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {DonateService} from "../../services/common/donate.service";
import {MembershipFeeService} from "../../services/common/membership-fee.service";
import {UserDataService} from "../../services/common/user-data.service";
import {ReloadService} from "../../services/core/reload.service";
import {StorageService} from "../../services/core/storage.service";
import COUNTRY_DATA from "../../core/utils/country";
import {GeoService} from "../../services/core/geo.service";
import {MatStep, MatStepper, MatStepperNext} from '@angular/material/stepper';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {DigitOnlyDirective} from '@uiowa/digit-only';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {RouterLink} from '@angular/router';
import {SafeUrlPipe} from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-general-member-fee',
  templateUrl: './general-member-fee.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    MatStepper,
    ReactiveFormsModule,
    FormsModule,
    MatStep,
    MatFormField,
    MatLabel,
    MatMenuTrigger,
    DigitOnlyDirective,
    MatError,
    MatInput,
    MatCheckbox,
    RouterLink,
    MatMenuItem,
    SafeUrlPipe,
    MatMenu,
    MatStepperNext
  ],
  styleUrls: ['./general-member-fee.component.scss']})
export class GeneralMemberFeeComponent implements OnInit{

  // Data Form
  @ViewChild('formElement') formElement!: NgForm;
  
  // Angular 20 Signals for reactive state management
  isChangeLanguage = signal(false);
  isChangeLanguageToggle = signal('bn');
  dataForm!: FormGroup;  // Data Form
  isOtpSent = signal(false);
  isOtpValid = signal(false);
  isVerified = signal(false);
  otpCode = signal<any>(null);
  isLoading = signal(false);
  sendVerificationCode = signal(false);
  countDown = signal(0);
  isCountDownEnd = signal(false);
  timeInstance = signal<any>(null);
  isBtnHide = signal(true);
  title = signal('newMat');
  value = signal<any>(null);
  currency = signal('BDT');
  user = signal<any>(null);

  countryData: any[] = COUNTRY_DATA;
  searchQuery = signal('');
  getSingleCountry = signal<any>(null);

  confarmSubmit = signal(false);

  // Static Data
  paymentMethods: PaymentMethod[] = PAYMENT_METHODS;
  selectedPaymentMethod = signal('SSl Commerz');

  // Signal to track when form is ready
  formReady = signal(false);

  // Computed signals for derived state
  filteredCountryData = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.countryData
      .filter(data =>
        data.name.toLowerCase().includes(query) ||
        data.dial_code.toLowerCase().includes(query) ||
        data.dial_code1.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        // Prioritize items that start with the search query
        if (aName.startsWith(query) && !bName.startsWith(query)) {
          return -1;
        }
        if (!aName.startsWith(query) && bName.startsWith(query)) {
          return 1;
        }
        // Further sort alphabetically
        return aName.localeCompare(bName);
      });
  });

  // Computed signal for selected amount based on country
  selectedAmount = computed(() => {
    const selectedCountry = this.getSingleCountry()?.name;
    if (selectedCountry === 'Bangladesh') {
      return 20; // 20 Taka
    } else if (selectedCountry === 'Saudi Arabia') {
      return 5; // 5 Dollar
    } else {
      return 10; // Others 10 Dollar
    }
  });

  // Computed signal for currency based on country
  selectedCurrency = computed(() => {
    const countryName = this.getSingleCountry()?.name;
    const isBangladesh = countryName?.toLowerCase() === 'bangladesh';
    return isBangladesh ? 'BDT' : 'USD';
  });

  // Subscriptions
  private  subDataOne!: Subscription;
  private subOtpGenerate!: Subscription;
  private subOtpValidate!: Subscription;
  private subReloadOne!: Subscription;

  // Angular 20 inject function for dependency injection
  private translateService = inject(TranslateService);
  private _formBuilder = inject(FormBuilder);
  private otpService = inject(OtpService);
  private uiService = inject(UiService);
  private userDataService = inject(UserDataService);
  private userService = inject(UserService);
  private donateService = inject(DonateService);
  private paymentService = inject(PaymentService);
  private membershipFeeService = inject(MembershipFeeService);
  private utilsService = inject(UtilsService);
  private reloadService = inject(ReloadService);
  private storageService = inject(StorageService);
  private geoService = inject(GeoService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Angular 20 Effects must be created in constructor (injection context)
    this.setupEffects();
  }

  ngOnInit(): void {
    this.dataForm = this._formBuilder.group({
      phoneNo: [null, [Validators.required]],
      code: [null],
      amount: [10, Validators.required],
      name: [null, Validators.required],
      email: [null],
      // Add checkbox controls (required)
      information: [false, Validators.requiredTrue],
      personalFund: [false, Validators.requiredTrue],
      agreeWithTermsAndConditions: [false, Validators.requiredTrue],
      // Add country-related fields
      countryCode: [null],
      countryName: [null],
      memberType: ['primary-member-fee'],
      currency: [null]});

    this.getSelectMethod();
    // Get logged in user
    this.subReloadOne = this.reloadService.refreshData$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    this.getLoggedInUserInfo();

    // Mark form as ready after initialization
    this.formReady.set(true);
  }

  private setupEffects(): void {
    // Only setup effects on browser platform to avoid SSR issues
    if (!isPlatformBrowser(this.platformId)) return;

    // Effect to update form amount when country changes
    effect(() => {
      if (this.formReady()) {
        const amount = this.selectedAmount();
        const currency = this.selectedCurrency();
        if (this.dataForm) {
          this.dataForm.patchValue({
            amount: amount,
            currency: currency
          });
        }
      }
    });

    // Effect to update form country data when getSingleCountry changes
    effect(() => {
      if (this.formReady()) {
        const country = this.getSingleCountry();
        if (this.dataForm && country) {
          this.dataForm.patchValue({
            countryCode: country.code,
            countryName: country.name,
            currency: this.selectedCurrency()
          });
        }
      }
    });
  }

  getSelectedAmount(): any {
    // This method is now handled by computed signal and effects
    return this.selectedAmount();
  }


  setCurrencyValue() {
    // This is now handled by computed signal and effects
    // Currency is automatically updated when country changes
  }

  resendOtp(){
    if (this.dataForm.invalid) {
      this.uiService.wrong('Please enter 11 digit phone number.');
      return;
    }
    this.generateOtpWithPhoneNo(this.dataForm.value.phoneNo);
  }


  generateOtpWithPhoneNo(phoneNo: string) {
    this.isLoading.set(true);
    this.subOtpGenerate = this.otpService.generateOtpWithPhoneNo(phoneNo)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent.set(true);
            this.uiService.success(res.message);
            this.isLoading.set(false);
            this.isBtnHide.set(false);
            this.sendVerificationCode.set(true);
          } else {
            this.isOtpSent.set(false);
            this.uiService.warn(res.message);
          }
        }),
        error: ((error) => {
          this.isOtpSent.set(false);
          this.isLoading.set(false);
          // console.log(error);
        })
      });
  }


  validateOtpWithPhoneNo(data: { phoneNo: string, code: string }) {
    this.isLoading.set(true);
    this.subOtpValidate = this.otpService.validateOtpWithPhoneNo(data)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpValid.set(true);
            this.sendVerificationCode.set(false);
            this.isLoading.set(false);
            this.uiService.success(res.message);
            this.isVerified.set(true);
          } else {
            this.isOtpValid.set(false);
            this.isLoading.set(false);
            this.uiService.warn(res.message);
            this.isVerified.set(false);
          }
        }),
        error: ((error) => {
          this.isOtpValid.set(false);
          this.isLoading.set(false);
          console.log(error);
        })
      });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please fill up all the required field');
      return;
    }

    if (!this.dataForm.value.agreeWithTermsAndConditions) {
      this.uiService.warn('Please select Terms & Conditions checkbox');
      return;
    }

    this.uiService.success('Data Added SuccessFully');
    this.addDonate();
    // this.openDialog(mData);
  }


  onEnterOtp(event: string) {
    this.otpCode.set(event);
    this.validateOtpWithPhoneNo({phoneNo: this.dataForm.value.phoneNo, code: this.otpCode()})
  }

  onSubmitOtp() {
    if (!this.dataForm.value.phoneNo && this.dataForm.value.phoneNo.length !== 11) {
      this.uiService.wrong('Please enter 11 digit phone number.');
      return;
    }
    if (!this.isOtpSent()) {
      this.generateOtpWithPhoneNo(this.dataForm.value.phoneNo);
    } else {
      this.validateOtpWithPhoneNo(this.dataForm.value)
    }
  }

  /**
   * Get currency based on country
   */
  private getCurrencyForCountry(countryName: string): string {
    const isBangladesh = countryName?.toLowerCase() === 'bangladesh';
    return isBangladesh ? 'BDT' : 'USD';
  }

  /**
   * HTTP REQ HANDLE
   * addDonate()
   */
  private addDonate() {
    const mData ={
      ...this.dataForm.value,
      ...{
        paymentMethod: this.selectedPaymentMethod(),
        // Add country data
        countryCode: this.getSingleCountry()?.code,
        countryName: this.getSingleCountry()?.name,
        currency: this.selectedCurrency()
      }
    }

    this.subDataOne = this.membershipFeeService.addMembershipFee(mData)
      .subscribe({
        next: (res => {
          this.uiService.success(res.message);
          // this.formElement.resetForm();
          this.confarmSubmit.set(true);
          if (res.data.link) {
            // 👉 SSLCommerz redirect for professional purchase
            this.document.location.href = res.data.link;
          }
        }),
        error: (error => {
          // console.log(error);
        })
      });
  }


  onSelectPaymentMethod(data: PaymentMethod) {
    this.storageService.storeDataToLocalStorage(data.slug, 'paymentSlug');
    this.selectedPaymentMethod.set(data.slug);
  }

  getSelectMethod() {
    try {
      const storedMethod = this.storageService.getDataFromLocalStorage('paymentSlug');
      if (storedMethod) {
        this.selectedPaymentMethod.set(storedMethod);
      }
    } catch (error) {
      console.warn('Failed to parse stored payment method, cleaning up localStorage:', error);
      // If JSON parsing fails, try to get the raw value and clean it up
      if (isPlatformBrowser(this.platformId)) {
        const rawValue = localStorage.getItem('paymentSlug');
        if (rawValue) {
          // Remove quotes if they exist and set the value
          const cleanValue = rawValue.replace(/^"(.*)"$/, '$1');
          this.selectedPaymentMethod.set(cleanValue);
          // Store it properly for future use
          this.storageService.storeDataToLocalStorage(cleanValue, 'paymentSlug');
        } else {
          // Clear corrupted data and use default
          localStorage.removeItem('paymentSlug');
          this.selectedPaymentMethod.set('SSl Commerz');
        }
      }
    }
  }



  onEditBtn(){
    this.isOtpSent.set(false);
    this.isBtnHide.set(true);
  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserInfo()
   */
  private getLoggedInUserInfo() {
    const select = 'phoneNo phone name email country countryCode countryName currency';
    this.subDataOne = this.userDataService.getLoggedInUserData(select)
      .subscribe(res => {
        this.user.set(res.data?.user);

        // Populate form with logged-in user data if available
        if (this.user() && this.dataForm) {
          this.dataForm.patchValue({
            name: this.user().name || null,
            phoneNo: this.user().phoneNo || null,
            email: this.user().email || null,
            // Also populate country data from user profile if available
            countryCode: this.user().countryCode || this.getSingleCountry()?.code || null,
            countryName: this.user().countryName || this.getSingleCountry()?.name || null,
            currency: this.user().currency || this.selectedCurrency() || 'BDT'
          });

          this.isVerified.set(true);
          this.isOtpSent.set(true);
          this.isOtpValid.set(true);
          this.isBtnHide.set(false);
        }

        // Prefer user's saved country for dialing code and flag
        const userCountryCode = this.user()?.countryCode;
        const userCountryName = this.user()?.countryName || this.user()?.country;
        if (userCountryCode || userCountryName) {
          const found = this.countryData.find(c =>
            (userCountryCode && c.code?.toUpperCase() === String(userCountryCode).toUpperCase()) ||
            (userCountryName && c.name?.toLowerCase() === String(userCountryName).toLowerCase())
          );
          if (found) {
            this.onGetSingleCountry(found);
          }
        }

        // If still not set, fallback to browser geo
        if (!this.getSingleCountry()) {
          this.useMyLocation();
        }

      }, error => {
        console.log(error);
        // On error, fallback to browser geo
        if (!this.getSingleCountry()) {
          this.useMyLocation();
        }
      });
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'en');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string){
    if(this.isChangeLanguageToggle() !== language){
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(this.isChangeLanguageToggle());
    }
    else{
      this.isChangeLanguageToggle.set('bn');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }

  async useMyLocation() {
    if (!isPlatformBrowser(this.platformId)) return;
    const cc2 = await this.geoService.getCountryByBrowserLocation();
    if (!cc2) return; // ইউজার ডিসঅ্যালাউ করলে/ফেল করলে কিছু করবেন না
    // console.log('cc2', cc2)
    const found =
      this.countryData.find(c => c.code?.toUpperCase() === cc2) ||
      this.countryData.find(c => c.code === 'BD');

    // console.log("found", found);
    // this.getSingleCountry = found;
    // this.registrationForm.patchValue({
    //   countryCode: found.dial_code || found.dial_code1,
    //   countryName: found.name,
    // });

    if (found) {
      this.onGetSingleCountry(found)
    } else {
      this.onGetSingleCountry(this.countryData[0]);
    }
  }

  onGetSingleCountry(countryObj: any) {
    this.getSingleCountry.set(this.countryData.find(
      (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
    ));

    // Update form with country information
    if (this.dataForm && this.getSingleCountry()) {
      this.dataForm.patchValue({
        countryCode: this.getSingleCountry().code,
        countryName: this.getSingleCountry().name,
        currency: this.selectedCurrency()
      });
      this.getSelectedAmount()
    }
  }

}
