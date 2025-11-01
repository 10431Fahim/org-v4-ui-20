import { Component, OnInit, OnDestroy, signal, computed, effect, inject, DestroyRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MatStepper } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Services
import { OtpService } from '../../services/common/otp.service';
import { UserDataService } from '../../services/common/user-data.service';
import { UiService } from '../../services/core/ui.service';
import { UserService } from '../../services/common/user.service';
import { DonateService } from '../../services/common/donate.service';
import { PaymentService } from '../../services/common/payment.service';
import { ReloadService } from '../../services/core/reload.service';
import { UtilsService } from '../../services/core/utils.service';
import { GeoService } from '../../services/core/geo.service';

// Interfaces and Data
import { PaymentMethod } from '../../interfaces/common/payment-method.interface';
import { PAYMENT_METHODS} from '../../core/utils/app-data';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import COUNTRY_DATA from '../../core/utils/country';
import {DigitOnlyDirective} from '@uiowa/digit-only';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatIconModule,
    SafeUrlPipe,
    DigitOnlyDirective,
    RouterLink
  ],
  standalone: true
})
export class DonateComponent implements OnInit, OnDestroy {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly translateService = inject(TranslateService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly otpService = inject(OtpService);
  private readonly userDataService = inject(UserDataService);
  private readonly uiService = inject(UiService);
  private readonly userService = inject(UserService);
  private readonly donateService = inject(DonateService);
  private readonly paymentService = inject(PaymentService);
  private readonly reloadService = inject(ReloadService);
  private readonly utilsService = inject(UtilsService);
  private readonly document = inject(DOCUMENT);
  private readonly geoService = inject(GeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  // ViewChild references
  @ViewChild('formElement') formElement!: NgForm;

  // Angular 20 Signals for reactive state management
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('');
  dataForm = signal<FormGroup | null>(null);
  isOtpSent = signal<boolean>(false);
  isOtpValid = signal<boolean>(false);
  isVerified = signal<boolean>(false);
  otpCode = signal<string>('');
  isLoading = signal<boolean>(false);
  checkDonationData = signal<any>(null);
  checkDonationNotice = signal<any>(null);
  navigateFrom = signal<string | null>(null);
  sendVerificationCode = signal<boolean>(false);
  countDown = signal<number>(0);
  isCountDownEnd = signal<boolean>(false);
  timeInstance = signal<any>(null);
  isBtnHide = signal<boolean>(true);
  title = signal<string>('newMat');
  value = signal<any>(null);
  currency = signal<string>('BDT');
  user = signal<any>(null);
  isUserLoggedIn = signal<boolean>(false);
  countryData = signal<any[]>(COUNTRY_DATA);
  searchQuery = signal<string>('');
  getSingleCountry = signal<any>(null);
  selectedIndex = signal<number>(0);
  confarmSubmit = signal<boolean>(false);

  // Country validation properties
  maxDonationAmount = signal<number>(10000); // Default for Bangladesh
  maxDonationCurrency = signal<string>('BDT');
  isBangladesh = signal<boolean>(true);
  minDonationAmount = signal<number>(20); // Default min for Bangladesh

  // Static Data
  paymentMethods = signal<PaymentMethod[]>(PAYMENT_METHODS);
  selectedPaymentMethod = signal<string>('SSl Commerz');

  // Computed signals for derived state
  currentLanguage = computed(() => this.translateService.currentLang);
  isLanguageBengali = computed(() => this.currentLanguage() === 'bn');
  isLanguageEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());

  // Form validation computed signals
  isFormValid = computed(() => {
    const form = this.dataForm();
    return form ? form.valid : false;
  });

  isAmountValid = computed(() => {
    const form = this.dataForm();
    const amount = form?.get('amount')?.value;
    const minAmount = this.minDonationAmount();
    return amount && amount >= minAmount && amount <= this.maxDonationAmount();
  });

  canProceedToPayment = computed(() => {
    return this.isFormValid() &&
           this.isAmountValid() &&
           this.selectedPaymentMethod() &&
           this.getSingleCountry() &&
           this.isVerified();
  });

  // Country validation computed signals
  countryValidationInfo = computed(() => {
    const country = this.getSingleCountry();
    if (!country) return null;

    const countryName = country.name;
    const isBangladesh = countryName.toLowerCase() === 'bangladesh';

    return {
      countryName: countryName,
      maxAmount: isBangladesh ? 10000 : 100,
      currency: isBangladesh ? 'BDT' : 'USD',
      isBangladesh: isBangladesh
    };
  });

  // Computed signals for unique tracking
  paymentMethodsWithId = computed(() => {
    return this.paymentMethods().map((method, index) => ({
      ...method,
      uniqueId: `${method.name}_${method.slug}_${index}`
    }));
  });

  filteredCountryDataWithId = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.countryData()
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
      })
      .map((country, index) => ({
        ...country,
        uniqueId: `${country.name}_${country.code}_${index}`
      }));
  });

  // Donation data for backend computed signal
  donationDataForBackend = computed(() => {
    const form = this.dataForm();
    if (!form) return null;

    const formData = form.value;
    return {
      ...formData,
      paymentMethod: this.selectedPaymentMethod(),
      countryCode: this.getSingleCountry()?.code,
      countryName: this.getSingleCountry()?.name,
      currency: this.maxDonationCurrency(),
      maxDonationAmount: this.maxDonationAmount(),
      maxDonationCurrency: this.maxDonationCurrency(),
      isBangladesh: this.isBangladesh(),
      amountWithCurrency: `${formData.amount} ${this.maxDonationCurrency()}`,
      donationLimit: `${this.maxDonationAmount()} ${this.maxDonationCurrency()}`
    };
  });

  // Effects for side effects
  constructor() {
    // Effect for language changes - only run when user explicitly changes language
    effect(() => {
      const lang = this.isChangeLanguageToggle();
      if (lang && lang !== '') {
        this.translateService.use(lang);
        this.isChangeLanguage.set(lang === 'bn');
      }
    });

    // Effect for country changes
    effect(() => {
      const country = this.getSingleCountry();
      if (country) {
        const countryName = country.name;
        const isBangladesh = countryName.toLowerCase() === 'bangladesh';

        this.isBangladesh.set(isBangladesh);
        this.maxDonationAmount.set(isBangladesh ? 10000 : 100);
        this.maxDonationCurrency.set(isBangladesh ? 'BDT' : 'USD');
        this.minDonationAmount.set(isBangladesh ? 20 : 10);

        // Update form currency
        const form = this.dataForm();
        if (form) {
          form.patchValue({
            currency: this.maxDonationCurrency()
          });
          const ctrl = form.get('amount');
          if (ctrl) {
            ctrl.setValidators([Validators.required, Validators.min(this.minDonationAmount())]);
            ctrl.updateValueAndValidity({ emitEvent: false });
          }
        }
      }
    });

    // Effect for amount validation
    effect(() => {
      const form = this.dataForm();
      const amount = form?.get('amount')?.value;
      const maxAmount = this.maxDonationAmount();
      const minAmount = this.minDonationAmount();

      if (amount && amount < minAmount) {
        setTimeout(() => {
          form?.get('amount')?.setErrors({
            minAmount: `Minimum donation amount is ${minAmount} ${this.maxDonationCurrency()}`
          });
        }, 0);
      } else if (amount && amount > maxAmount) {
        // Use setTimeout to defer the form modification to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          form?.get('amount')?.setErrors({
            maxAmount: `Maximum donation amount is ${maxAmount} ${this.maxDonationCurrency()}`
          });
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    // Initialize form
    this.initializeForm();

    // Set default payment method
    this.getSelectMethod();

    // Set default country (Bangladesh)
    this.setDefaultCountry();

    // Check user login status
    this.checkUserLoginStatus();

    // Subscribe to reload service
    this.subscribeToReloadService();

    // Use geolocation
    this.useMyLocation();
  }

  private initializeForm(): void {
    const form = this.formBuilder.group({
      phoneNo: [null, [Validators.required]],
      code: [null],
      amount: [null, [Validators.required, Validators.min(this.minDonationAmount())]],
      tramsCondition1: [null, Validators.required],
      tramsCondition2: [null, Validators.required],
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      countryCode: [null],
      countryName: [null],
      currency: [null],
      agreeWithTermsAndConditions: [false]
    });

    this.dataForm.set(form);
  }

  private setDefaultCountry(): void {
    const bd = this.countryData().find(c => c.code?.toUpperCase?.() === 'BD');
    if (bd) {
      this.onGetSingleCountry(bd);
    }
  }

  private checkUserLoginStatus(): void {
    this.isUserLoggedIn.set(this.userService.getUserStatus());
    if (this.isUserLoggedIn()) {
      this.getLoggedInUserInfo();
    }
  }

  private subscribeToReloadService(): void {
    this.reloadService.refreshData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isUserLoggedIn()) {
          this.getLoggedInUserInfo();
        }
      });
  }

  // Navigation methods
  goNext(): void {
    this.selectedIndex.update(current => current + 1);
  }

  // OTP methods
  resendOtp(): void {
    const form = this.dataForm();
    if (!form || form.invalid) {
      this.uiService.wrong('Please enter 11 digit phone number.');
      return;
    }
    this.generateOtpWithPhoneNo(form.value.phoneNo);
  }

  generateOtpWithPhoneNo(phoneNo: string): void {
    this.isLoading.set(true);
    this.otpService.generateOtpWithPhoneNo(phoneNo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
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
        },
        error: (error) => {
          this.isOtpSent.set(false);
          this.isLoading.set(false);
        }
      });
  }

  validateOtpWithPhoneNo(data: { phoneNo: string, code: string }): void {
    this.isLoading.set(true);
    this.otpService.validateOtpWithPhoneNo(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
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
        },
        error: (error) => {
          this.isOtpValid.set(false);
          this.isLoading.set(false);
          console.log(error);
        }
      });
  }

  onEnterOtp(event: string): void {
    this.otpCode.set(event);
    const form = this.dataForm();
    if (form) {
      this.validateOtpWithPhoneNo({
        phoneNo: form.value.phoneNo,
        code: this.otpCode()
      });
    }
  }

  onSubmitOtp(): void {
    const form = this.dataForm();
    if (!form || !form.value.phoneNo || form.value.phoneNo.length !== 11) {
      this.uiService.wrong('Please enter 11 digit phone number.');
      return;
    }

    if (!this.isOtpSent()) {
      this.generateOtpWithPhoneNo(form.value.phoneNo);
    } else {
      this.validateOtpWithPhoneNo(form.value);
    }
  }

  onEditBtn(): void {
    this.isOtpSent.set(false);
    this.isBtnHide.set(true);
  }

  // Form submission
  onSubmit(): void {
    const form = this.dataForm();
    if (!form || form.invalid) {
      this.uiService.warn('Please fill up all the required field');
      return;
    }

    // Check if payment method is selected
    if (!this.selectedPaymentMethod()) {
      this.uiService.warn('Please select a payment method');
      return;
    }

    // Check if country is selected
    if (!this.getSingleCountry()) {
      this.uiService.warn('Please select a country');
      return;
    }

    // Validate amount based on country
    const amount = form.get('amount')?.value;
    if (amount < this.minDonationAmount()) {
      // this.uiService.warn(`Minimum donation amount for ${this.getSingleCountry().name} is ${this.minDonationAmount()} ${this.maxDonationCurrency()}`);
      return;
    }
    if (amount > this.maxDonationAmount()) {
      // this.uiService.warn(`Maximum donation amount for ${this.getSingleCountry().name} is ${this.maxDonationAmount()} ${this.maxDonationCurrency()}`);
      return;
    }

    if (!form.value.agreeWithTermsAndConditions) {
      this.uiService.warn('Please select Terms & Conditions checkbox');
      return;
    }

    this.isLoading.set(true);
    this.uiService.success('Data Added SuccessFully');
    this.addDonate();
  }

  private addDonate(): void {
    const donationData = this.donationDataForBackend();
    if (!donationData) return;

    this.donateService.addDonate(donationData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);

          if (res.success) {
            this.uiService.success(res.message);

            if (res.data.link) {
              // SSLCommerz redirect for professional purchase
              this.document.location.href = res.data.link;
            }
          } else {
            this.uiService.success(res.message);
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.uiService.warn('Payment processing failed. Please try again.');
          console.log(error);
        }
      });
  }

  // Payment method selection
  onSelectPaymentMethod(data: PaymentMethod): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('paymentSlug', data.slug);
    }
    this.selectedPaymentMethod.set(data.slug);
    this.uiService.success(`Payment method "${data.name}" selected successfully`);
  }

  private getSelectMethod(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedMethod = localStorage.getItem('paymentSlug');
      if (savedMethod) {
        this.selectedPaymentMethod.set(savedMethod);
      } else {
        // Set default payment method if none is saved
        this.selectedPaymentMethod.set(this.paymentMethods()[0]?.slug || '');
      }
    } else {
      // Set default payment method when running on server
      this.selectedPaymentMethod.set(this.paymentMethods()[0]?.slug || '');
    }
  }

  // Language methods
  onChangeLanguage(language: string): void {
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string): void {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(language === 'bn');
      this.translateService.use(language);
    } else {
      this.isChangeLanguageToggle.set('bn');
      this.isChangeLanguage.set(true);
      this.translateService.use('bn');
    }
  }

  // Country methods
  async useMyLocation(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const cc2 = await this.geoService.getCountryByBrowserLocation();
    if (!cc2) return;

    const found =
      this.countryData().find(c => c.code?.toUpperCase() === cc2) ||
      this.countryData().find(c => c.code === 'BD');

    if (found) {
      this.onGetSingleCountry(found);
    } else {
      this.onGetSingleCountry(this.countryData()[0]);
    }
  }

  onGetSingleCountry(countryObj: any): void {
    const foundCountry = this.countryData().find(
      (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
    );

    this.getSingleCountry.set(foundCountry);

    // Update form with country information
    const form = this.dataForm();
    if (form && foundCountry) {
      const countryName = foundCountry.name;
      this.isBangladesh.set(countryName.toLowerCase() === 'bangladesh');

      // Update currency and max amount based on country
      if (this.isBangladesh()) {
        this.maxDonationAmount.set(10000);
        this.maxDonationCurrency.set('BDT');
        this.minDonationAmount.set(20);
      } else {
        this.maxDonationAmount.set(100);
        this.maxDonationCurrency.set('USD');
        this.minDonationAmount.set(10);
      }

      form.patchValue({
        countryCode: foundCountry.code,
        countryName: foundCountry.name,
        currency: this.maxDonationCurrency()
      });

      // Reset amount field when country changes
      form.patchValue({
        amount: null
      });

      // Clear any existing validation errors
      form.get('amount')?.setErrors(null);

      const ctrl = form.get('amount');
      if (ctrl) {
        ctrl.setValidators([Validators.required, Validators.min(this.minDonationAmount())]);
        ctrl.updateValueAndValidity({ emitEvent: false });
      }

      // Show notification about country change
      // this.uiService.success(`Country changed to ${foundCountry.name}. Maximum donation: ${this.maxDonationAmount()} ${this.maxDonationCurrency()}`);
    }
  }

  // User data methods
  private getLoggedInUserInfo(): void {
    const select = 'phoneNo countryCode countryName code phone currency city country currency name email';
    this.userDataService.getLoggedInUserData(select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.user.set(res.data?.user);
          // Populate form with user data if user is logged in
          if (this.user() && this.dataForm()) {
            this.populateFormWithUserData();
          }
        },
        error: (error) => {
          console.log(error);
          // If error occurs, user might not be logged in
          this.user.set(null);
          this.isUserLoggedIn.set(false);
        }
      });
  }

  private populateFormWithUserData(): void {
    const user = this.user();
    const form = this.dataForm();

    if (user && form) {
      // Set country from user account data if available
      if (user.countryCode && user.countryName) {
        const userCountry = this.countryData().find(c =>
          c.code?.toUpperCase?.() === user.countryCode?.toUpperCase?.() ||
          c.name?.toLowerCase?.() === user.countryName?.toLowerCase?.()
        );

        if (userCountry) {
          this.onGetSingleCountry(userCountry);
        } else {
          // Fallback to Bangladesh if user country not found
          const bd = this.countryData().find(c => c.code?.toUpperCase?.() === 'BD');
          if (bd) this.onGetSingleCountry(bd);
        }
      } else {
        // Default to Bangladesh if no country data in user account
        const bd = this.countryData().find(c => c.code?.toUpperCase?.() === 'BD');
        if (bd) this.onGetSingleCountry(bd);
      }

      form.patchValue({
        name: user.name || '',
        phoneNo: user.phoneNo || '',
        email: user.email || '',
        countryCode: this.getSingleCountry()?.code || '',
        countryName: this.getSingleCountry()?.name || '',
        currency: this.maxDonationCurrency()
      });

      // If user has phone number, mark as verified and hide verify button
      if (user.phoneNo) {
        this.isVerified.set(true);
        this.isBtnHide.set(false);
        this.isOtpSent.set(false);
        this.isOtpValid.set(true);
      }
    }
  }

  // Donation check method
  checkDonation(stepper: MatStepper): void {
    const donationData = this.donationDataForBackend();
    if (!donationData) return;

    this.donateService.checkDonation(donationData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);

          if (res.success) {
            this.checkDonationData.set(res.data.summary);
            this.checkDonationNotice.set(res.message);

            if (this.checkDonationData()?.requestedAmount > this.checkDonationData()?.remainingLimit) {
              // Don't proceed if limit exceeded
              return;
            }

            // Proceed to next step if everything is OK
            stepper.next();
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.uiService.warn('Payment processing failed. Please try again.');
          console.log(error);
        }
      });
  }

  ngOnDestroy(): void {
    // All subscriptions are automatically cleaned up with takeUntilDestroyed
  }
}
