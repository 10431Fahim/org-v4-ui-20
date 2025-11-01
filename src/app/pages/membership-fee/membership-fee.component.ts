import {Component, Inject, OnInit, PLATFORM_ID, ViewChild, signal, computed, effect, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import * as _moment from "moment";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {UiService} from "../../services/core/ui.service";
import {MembershipFeeService} from "../../services/common/membership-fee.service";
import {Subscription} from "rxjs";
import {OtpService} from "../../services/common/otp.service";
import {ReloadService} from "../../services/core/reload.service";
import {UserService} from "../../services/common/user.service";
import {PaymentMethod} from "../../interfaces/common/payment-method.interface";
import {PAYMENT_METHODS} from "../../core/utils/app-data";
import {UtilsService} from "../../services/core/utils.service";
import {PaymentService} from "../../services/common/payment.service";
import {StorageService} from "../../services/core/storage.service";
import {CurrencyPipe, DOCUMENT, isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
import {MatStep, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import COUNTRY_DATA from "../../core/utils/country";
import {GeoService} from "../../services/core/geo.service";
import {MatInput} from '@angular/material/input';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {DigitOnlyDirective} from '@uiowa/digit-only';
import {MatCheckbox} from '@angular/material/checkbox';
import {SafeUrlPipe} from '../../shared/pipes/safe-url.pipe';
import {UserDataService} from '../../services/common/user-data.service';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

const moment = _moment;
const moment1 = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY'},
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'}};

@Component({
  selector: 'app-membership-fee',
  templateUrl: './membership-fee.component.html',
  styleUrls: ['./membership-fee.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true}},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  imports: [
    NgIf,
    TranslatePipe,
    ReactiveFormsModule,
    MatStepper,
    MatStep,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatIcon,
    MatError,
    NgForOf,
    NgIf,
    CurrencyPipe,
    MatInput,
    MatStepperNext,
    MatMenuTrigger,
    DigitOnlyDirective,
    MatCheckbox,
    MatStepperPrevious,
    MatMenuItem,
    SafeUrlPipe,
    MatMenu,
    FormsModule,
    RouterLink
  ],
  standalone: true})
export class MembershipFeeComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement!: NgForm;
  @ViewChild('stepper') stepper!: MatStepper;
  dataForm?: FormGroup | any;  // Data Form
  
  // Angular 20 Signals
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('bn');
  isOtpSent = signal<boolean>(false);
  isOtpValid = signal<boolean>(false);
  isVerified = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  sendVerificationCode = signal<boolean>(false);
  countDown = signal<number>(0);
  isCountDownEnd = signal<boolean>(false);
  isBtnHide = signal<boolean>(true);
  confarmSubmit = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedPaymentMethod = signal<string>('');
  
  // Computed properties
  isFormValid = computed(() => this.dataForm?.valid ?? false);
  isStepComplete = computed(() => this.isVerified() && this.isOtpValid());
  canProceedToNextStep = computed(() => this.isStepComplete());
  
  // Legacy properties (keeping for compatibility)
  otpCode: any;
  currency = 'BDT';
  navigateFrom: any = null;
  timeInstance = null;
  title = 'newMat';
  value: any;
  user: any = null;

  countryData: any[] = COUNTRY_DATA;
  getSingleCountry?: any = COUNTRY_DATA.find(c => c.code === 'BD') || COUNTRY_DATA[0];

  // startDate: any;
  // endDate: any;

  committee: any[] = [];
  designationData: any[] | any = [];

  amountEn: number | any;
  amountBng: any;

  amount: number = 0;


  // Static Data
  paymentMethods: PaymentMethod[] = PAYMENT_METHODS;

  // Subscriptions
  subDataOne!: Subscription;
  private subOtpGenerate!: Subscription;
  private subOtpValidate!: Subscription;
  private subReloadOne!: Subscription;


  constructor(
    public translateService: TranslateService,
    private _formBuilder: FormBuilder,
    public otpService: OtpService,
    private uiService: UiService,
    protected userDataService: UserDataService,
    private userService: UserService,
    private paymentService: PaymentService,
    private reloadService: ReloadService,
    private membershipFeeService: MembershipFeeService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: Document,
    private geoService: GeoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    // Effect to watch form changes and update validation
    effect(() => {
      if (this.dataForm) {
        this.updateFormValidation();
      }
    });
  }

  ngOnInit(): void {
    // Initialize country with default value to avoid ExpressionChangedAfterItHasBeenCheckedError
    if (!this.getSingleCountry && this.countryData.length > 0) {
      this.getSingleCountry = this.countryData.find(c => c.code === 'BD') || this.countryData[0];
    }

    this.dataForm = this._formBuilder.group({
      phoneNo: [null, [Validators.required]],
      code: [null],
      // months: [null, Validators.required],
      amount: [null, Validators.required],
      name: [null, Validators.required],
      organization: [this.organizationName[0]?.name || null],
      committee: [null, Validators.required],
      designation: [null, Validators.required],
      others: [null],
      startDate: [null],
      startDate1: [null, Validators.required],
      endDate: [null],
      endDate1: [null, Validators.required],
      memberType: ['membership-fee'],
      // Add checkbox form controls
      tramsCondition1: [null, Validators.required],
      tramsCondition2: [null, Validators.required],
      agreeWithTermsAndConditions: [null, Validators.required],
      // Add country-related fields
      countryCode: [null],
      countryName: [null],
      currency: [null]});

    // Initialize form with default country data
    if (this.getSingleCountry && this.dataForm) {
      this.dataForm.patchValue({
        countryCode: this.getSingleCountry.dial_code || this.getSingleCountry.dial_code1,
        countryName: this.getSingleCountry.name,
        currency: this.getSingleCountry.currency || 'BDT'
      });
    }

    // this.startDate1.setValue(this.startDate1);
    this.getSelectMethod();

    // Ensure a payment method is selected
    this.ensurePaymentMethodSelected();

    // Subscribe to form value changes to auto-calculate amount
    this.dataForm.valueChanges.subscribe(() => {
      // console.log('Form values changed:', value);
      this.checkAndCalculateAmount();
    });


    // Get logged in user
    this.subReloadOne = this.reloadService.refreshData$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    this.getLoggedInUserInfo();

    // Load country location asynchronously (will update if different)
    this.useMyLocation()
  }


  startDate1: string = '';
  endDate1: string = '';

  monthData: number = 0;
  yearData: number = 0;
  totalMonth: number = 0;

  calculateDifference() {
    this.startDate1 = this.dataForm?.value.startDate1;
    this.endDate1 = this.dataForm?.value.endDate1;
    if (this.startDate1 && this.endDate1) {
      // Parse the input values as strings to extract year and month.
      const startYear = +this.startDate1.split('-')[0]; // Convert to a number.
      const startMonth = +this.startDate1.split('-')[1];
      const endYear = +this.endDate1.split('-')[0];
      const endMonth = +this.endDate1.split('-')[1];

      // Validate date range
      if (endYear < startYear || (endYear === startYear && endMonth < startMonth)) {
        this.uiService.warn('End date must be after start date');
        this.totalMonth = 0;
        this.amount = 0;
        this.dataForm.patchValue({amount: 0});
        return;
      }

      // Calculate the year and month difference.
      const yearDiff = endYear - startYear;
      const monthDiff = endMonth - startMonth;
      this.yearData = yearDiff * 12;

      this.monthData = monthDiff;
      this.totalMonth = this.monthData + this.yearData + 1; // Add 1 for inclusive counting

      // Calculate amount if designation is selected
      if (this.designationData?.length > 0 && this.totalMonth > 0) {
        const baseAmount = this.designationData[0]?.amount || 0;
        const calculatedAmount = baseAmount * this.totalMonth;

        this.dataForm.patchValue({amount: calculatedAmount});
        this.amount = calculatedAmount;
        // console.log('Amount updated:', calculatedAmount);
      }
    }
  }


  resendOtp() {
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
          // console.log(error);
        })
      });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please fill up all the required field');
      return;
    }

    // Check if checkboxes are checked
    if (!this.dataForm.get('tramsCondition1').value) {
      this.uiService.warn('Please accept the information terms and conditions');
      return;
    }

    if (!this.dataForm.get('tramsCondition2').value) {
      this.uiService.warn('Please accept the personal fund terms and conditions');
      return;
    }

    if (!this.dataForm.get('agreeWithTermsAndConditions').value) {
      this.uiService.warn('Please agree to the terms and conditions');
      return;
    }

    // Check if payment method is selected
    if (!this.selectedPaymentMethod()) {
      this.uiService.warn('Please select a payment method');
      return;
    }

    // Check if country is selected
    if (!this.getSingleCountry) {
      this.uiService.warn('Please select a country');
      return;
    }

    this.uiService.success('Data Added SuccessFully');
    this.addMembershipFee();
    // this.openDialog(mData);
  }


  onEnterOtp(event: string) {
    this.otpCode = event;
    this.validateOtpWithPhoneNo({phoneNo: this.dataForm.value.phoneNo, code: this.otpCode})
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

  onEditBtn() {
    this.isOtpSent.set(false);
    this.isBtnHide.set(true);
  }


  /**
   * HTTP REQ HANDLE
   * addMembershipFee()
   */
  private addMembershipFee() {
    // Use getRawValue() to include disabled form controls
    const formValue = this.dataForm.getRawValue();
    const mData = {
      ...formValue,
        ...{
          paymentMethod: this.selectedPaymentMethod(),
          // Add country data
          countryCode: this.getSingleCountry?.dial_code || this.getSingleCountry?.dial_code1,
          countryName: this.getSingleCountry?.name,
          currency: this.getSingleCountry?.currency || 'BDT'}
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
    // console.log('Payment method selected:', data.name, 'with slug:', data.slug);
    this.uiService.success(`Payment method "${data.name}" selected successfully`);
  }

  getSelectMethod() {
    const savedMethod = this.storageService.getDataFromLocalStorage('paymentSlug');
    if (savedMethod) {
      this.selectedPaymentMethod.set(savedMethod);
    } else {
      // Set default payment method if none is saved
      const defaultMethod = this.paymentMethods[0]?.slug || '';
      this.selectedPaymentMethod.set(defaultMethod);
      // Save the default method to localStorage
      if (defaultMethod) {
        this.storageService.storeDataToLocalStorage(defaultMethod, 'paymentSlug');
      }
    }
    // console.log('Selected payment method:', this.selectedPaymentMethod());
  }


  private filterCommittee(data: any) {
    this.committee = this.allCommittee.filter(item =>
      item.name === data);
  }


  private filterDesignation(data: any) {
    this.designationData = this.committee[0]?.designation.filter((item: { name: any; }) =>
      item.name === data);

    if (this.designationData?.length) {
      const baseAmount = this.designationData[0]?.amount || 0;
      const calculatedAmount = baseAmount * this.totalMonth;

      // Update form with calculated amount
      this.dataForm.patchValue({amount: calculatedAmount});
      this.dataForm.get('amount').setValue(calculatedAmount);
      this.dataForm.get('amount').updateValueAndValidity();

      // Update component properties
      this.amount = calculatedAmount;
      this.amountEn = calculatedAmount;
      this.amountBng = this.designationData[0]?.amountBn;

      // console.log('Amount calculated from designation:', calculatedAmount);

      // Force change detection
      setTimeout(() => {
        this.dataForm.get('amount').updateValueAndValidity();
      }, 100);
    }
  }


  onDesignationSelect(event: MatSelectChange) {
    const id = event.value;
    this.filterDesignation(id);

    // Recalculate amount when designation changes
    if (this.totalMonth > 0) {
      this.calculateDifference();
    }
  }


  /**
   * ON CATEGORY SELECT
   */
  onCommitteeSelect(event: MatSelectChange) {
    const id = event.value;
    this.filterCommittee(id);

    // Reset designation and amount when committee changes
    this.dataForm.patchValue({
      designation: null,
      amount: null
    });
    this.designationData = [];
    this.amount = 0;
  }


  organizationName: any[] = [
    {
      id: "1",
      name: "BNP",
      nameBn: "বিএনপি"
    }
  ]


  allCommittee: any[] = [
    {
      id: 1,
      name: "National Standing Committee",
      nameBn: "জাতীয় স্থায়ী কমিটি",
      designation: [
        {
          id: "1",
          name: "Chairperson",
          nameBn: "চেয়ারপার্সন ",
          amount: 1000,
          amountBn: "১০০০",
        },
        {
          id: "2",
          name: "Acting Chairman",
          nameBn: "ভারপ্রাপ্ত চেয়ারম্যান",
          amount: 1000,
          amountBn: "১০০০",
        },
        {
          id: "3",
          name: "Member",
          nameBn: "সদস্য",
          amount: 1000,
          amountBn: "১০০০",
        }
  
      ]
    },
    {
      id: 2,
      name: "Advisory Council of Chairman",
      nameBn: "চেয়ারম্যানের উপদেষ্টা কাউন্সিল",
      designation: [
        {
          id: "1",
          name: "Member",
          nameBn: "সদস্য",
          amount: 500,
          amountBn: "৫০০",
        }
  
      ]
    },
    {
      id: 3,
      name: "National Executive Committee",
      nameBn: "জাতীয় নির্বাহী কমিটি",
      designation: [
        {
          id: "1",
          name: "Chairperson",
          nameBn: "চেয়ারপার্সন",
          amount: 1000,
          amountBn: "১০০০",
        },
        {
          id: "2",
          name: "Senior Vice Chairman",
          nameBn: "সিনিয়র ভাইস চেয়ারম্যান",
          amount: 1000,
          amountBn: "১০০০",
        },
        {
          id: "3",
          name: "Vice-Chairman",
          nameBn: "ভাইস চেয়ারম্যান",
          amount: 500,
          amountBn: "৫০০",
        },
        {
          id: "4",
          name: "Secretary General",
          nameBn: "মহাসচিব",
          amount: 1000,
          amountBn: "১০০০",
        },
         {
          id: "5",
          name: "Senior Joint Secretary General",
          nameBn: "সিনিয়র যুগ্ম মহাসচিব",
          amount: 1000,
          amountBn: "১০০০",
        },
        {
          id: "6",
          name: "Joint Secretary General",
          nameBn: "যুগ্মমহাসচিব",
          amount: 300,
          amountBn: "৩০০",
        },
        {
          id: "7",
          name: "Treasurer",
          nameBn: "কোষাধ্যক্ষ",
          amount: 300,
          amountBn: "৩০০",
        },
        {
          id: "8",
          name: "Secretary",
          nameBn: "সম্পাদক",
          amount: 300,
          amountBn: "৩০০",
        },
        {
          id: "9",
          name: "Assistant Secretary",
          nameBn: "সহ-সম্পাদক",
          amount: 300,
          amountBn: "৩০০",
        },
        {
          id: "10",
          name: "Executive Members",
          nameBn: "নির্বাহীসদস্য",
          amount: 100,
          amountBn: "১০০",
        }
  
      ]
    },
    {
      id: 4,
      name: "District Executive Committee",
      nameBn: "জেলা নির্বাহী কমিটি",
      designation: [
        {
          id: "1",
          name: " President",
          nameBn: "সভাপতি",
          amount: 500,
          amountBn: "৫০০",
        },
        {
          id: "2",
          name: "Vice President",
          nameBn: "সহ-সভাপতি",
          amount: 300,
          amountBn: "৩০০",
        },
        {
          id: "3",
          name: "General Secretary",
          nameBn: "সাধারণ সম্পাদক",
          amount: 500,
          amountBn: "৫০০",
        },
        {
          id: "4",
          name: "Joint-General Secretary",
          nameBn: "যুগ্ম-সাধারণ সম্পাদক",
          amount: 300,
          amountBn: "৩০০",
        },
        {
          id: "5",
          name: "Secretaries",
          nameBn: "সম্পাদকগণ",
          amount: 200,
          amountBn: "২০০",
        },
        {
          id: "6",
          name: " Joint-Secretaries",
          nameBn: "সহ-সম্পাদকগণ",
          amount: 100,
          amountBn: "১০০",
        },
        {
          id: "7",
          name: "Executive Members",
          nameBn: "নির্বাহী সদস্য",
          amount: 50,
          amountBn: "৫০",
        }
  
      ]
    },
    {
      id: 5,
      name: "Metropolitan Executive Committee",
      nameBn: "মহানগর নির্বাহী কমিটি",
      designation: [
        {
          id: "1",
          name: " President",
          nameBn: "সভাপতি",
          amount: 400,
          amountBn: "৪০০",
        },
        {
          id: "2",
          name: "Vice President",
          nameBn: "সহ-সভাপতি",
          amount: 200,
          amountBn: "২০০",
        },
        {
          id: "3",
          name: "General Secretary",
          nameBn: "সাধারণ সম্পাদক",
          amount: 400,
          amountBn: "৪০০",
        },
        {
          id: "4",
          name: "Joint-General Secretary",
          nameBn: "যুগ্ম-সাধারণ সম্পাদক",
          amount: 200,
          amountBn: "২০০",
        },
        {
          id: "5",
          name: "Secretaries",
          nameBn: "সম্পাদকগণ",
          amount: 150,
          amountBn: "১৫০",
        },
        {
          id: "6",
          name: " Joint-Secretaries",
          nameBn: "সহ-সম্পাদকগণ",
          amount: 100,
          amountBn: "১০০",
        },
        {
          id: "7",
          name: "Executive Members",
          nameBn: "নির্বাহী সদস্য",
          amount: 40,
          amountBn: "৪০",
        }
  
  
      ]
    },
    {
      id: 6,
      name: "Upazila/Thana/Municipality",
      nameBn: "উপজেলা/থানা/পৌরসভা",
      designation: [
        {
          id: "1",
          name: " President",
          nameBn: "সভাপতি",
          amount: 400,
          amountBn: "৪০০",
        },
        {
          id: "2",
          name: "Vice President",
          nameBn: "সহ-সভাপতি",
          amount: 200,
          amountBn: "২০০",
        },
        {
          id: "3",
          name: "General Secretary",
          nameBn: "সাধারণ সম্পাদক",
          amount: 400,
          amountBn: "৪০০",
        },
        {
          id: "4",
          name: "Joint-General Secretary",
          nameBn: "যুগ্ম-সাধারণ সম্পাদক",
          amount: 200,
          amountBn: "২০০",
        },
        {
          id: "5",
          name: "Secretaries",
          nameBn: "সম্পাদকগণ",
          amount: 150,
          amountBn: "১৫০",
        },
        {
          id: "6",
          name: " Joint-Secretaries",
          nameBn: "সহ-সম্পাদকগণ",
          amount: 100,
          amountBn: "১০০",
        },
        {
          id: "7",
          name: "Executive Members",
          nameBn: "নির্বাহী সদস্য",
          amount: 40,
          amountBn: "৪০",
        },
  
      ]
    },
  
    {
      id: 7,
      name: "Union and Municipality Ward",
      nameBn: "ইউনিয়ন এবং পৌর/মহানগর ওয়ার্ড",
      designation: [
        {
          id: "1",
          name: " President",
          nameBn: "সভাপতি",
          amount: 100,
          amountBn: "১০০",
        },
        {
          id: "2",
          name: "Vice President",
          nameBn: "সহ-সভাপতি",
          amount: 50,
          amountBn: "৫০",
        },
        {
          id: "3",
          name: "General Secretary",
          nameBn: "সাধারণ সম্পাদক",
          amount: 100,
          amountBn: "১০০",
        },
        {
          id: "4",
          name: "Joint-General Secretary",
          nameBn: "যুগ্ম-সাধারণ সম্পাদক",
          amount: 50,
          amountBn: "৫০",
        },
        {
          id: "5",
          name: "Secretaries",
          nameBn: "সম্পাদকগণ",
          amount: 40,
          amountBn: "৪০",
        },
        {
          id: "6",
          name: " Joint-Secretaries",
          nameBn: "সহ-সম্পাদকগণ",
          amount: 30,
          amountBn: "৩০",
        },
        {
          id: "7",
          name: "Executive Members",
          nameBn: "নির্বাহী সদস্য",
          amount: 20,
          amountBn: "২০",
        }
  
  
      ]
    },
    {
      id: 8,
      name: "Union Ward",
      nameBn: "ইউনিয়ন ওয়ার্ড",
      designation: [
        {
          id: "1",
          name: " President",
          nameBn: "সভাপতি",
          amount: 50,
          amountBn: "৫০",
        },
        {
          id: "2",
          name: "Vice President",
          nameBn: "সহ-সভাপতি",
          amount: 40,
          amountBn: "৪০",
        },
        {
          id: "3",
          name: "General Secretary",
          nameBn: "সাধারণ সম্পাদক",
          amount: 50,
          amountBn: "৫০",
        },
        {
          id: "4",
          name: "Joint-General Secretary",
          nameBn: "যুগ্ম-সাধারণ সম্পাদক",
          amount: 40,
          amountBn: "৪০",
        },
        {
          id: "5",
          name: "Secretaries",
          nameBn: "সম্পাদকগণ",
          amount: 30,
          amountBn: "৩০",
        },
        {
          id: "6",
          name: " Joint-Secretaries",
          nameBn: "সহ-সম্পাদকগণ",
          amount: 20,
          amountBn: "২০",
        },
        {
          id: "7",
          name: "Executive Members",
          nameBn: "নির্বাহী সদস্য",
          amount: 10,
          amountBn: "১০",
        }
  
      ]
    },
  ]

  /**
   * Handle stepper step completion
   */
  onStepComplete() {
    // If first step is completed, calculate amount automatically
    if (this.stepper.selectedIndex === 0) {
      this.calculateAmountAutomatically();
    }
  }

  /**
   * Calculate amount automatically when first step is completed
   */
  private calculateAmountAutomatically() {
    const formValue = this.dataForm.value;

    // Check if all required fields for amount calculation are filled
    if (formValue.organization && formValue.committee && formValue.designation &&
      formValue.startDate1 && formValue.endDate1) {

      // Calculate total months
      this.calculateDifference();

      // Get designation data and calculate amount
      if (this.designationData?.length > 0 && this.totalMonth > 0) {
        const baseAmount = this.designationData[0]?.amount || 0;
        const calculatedAmount = baseAmount * this.totalMonth;

        // Update form with calculated amount
        this.dataForm.patchValue({
          amount: calculatedAmount
        });

        // Update component properties
        this.amount = calculatedAmount;
        this.amountEn = calculatedAmount;
        this.amountBng = this.designationData[0]?.amountBn;

        // console.log('Amount calculated automatically:', calculatedAmount);

        // Force update the amount field
        this.updateAmountField();

        // Show success message
        this.uiService.success(`Amount calculated: ${calculatedAmount} BDT for ${this.totalMonth} months`);
      } else {
        this.uiService.warn('Please select designation and valid date range');
      }
    }
  }

  /**
   * Reset amount when form fields change
   */
  onFormFieldChange() {
    // Reset amount when any field changes
    if (!this.dataForm.get('organization').value ||
      !this.dataForm.get('committee').value ||
      !this.dataForm.get('designation').value ||
      !this.dataForm.get('startDate1').value ||
      !this.dataForm.get('endDate1').value) {
      this.amount = 0;
      this.dataForm.patchValue({amount: null});
    }
  }

  /**
   * Force update amount field
   */
  private updateAmountField() {
    if (this.designationData?.length > 0 && this.totalMonth > 0) {
      const baseAmount = this.designationData[0]?.amount || 0;
      const calculatedAmount = baseAmount * this.totalMonth;

      this.amount = calculatedAmount;

      // Update form with calculated amount
      this.dataForm.patchValue({amount: calculatedAmount});
      this.dataForm.get('amount').setValue(calculatedAmount);
      this.dataForm.get('amount').updateValueAndValidity();

      // console.log('Amount field updated:', calculatedAmount);
    }
  }

  /**
   * Check if all required fields are filled and calculate amount
   */
  private checkAndCalculateAmount() {
    const formValue = this.dataForm.value;

    // Check if all required fields for amount calculation are filled
    if (formValue.organization && formValue.committee && formValue.designation &&
      formValue.startDate1 && formValue.endDate1) {

      // Calculate total months
      this.calculateDifference();

      // Get designation data and calculate amount
      if (this.designationData?.length > 0 && this.totalMonth > 0) {
        const baseAmount = this.designationData[0]?.amount || 0;
        const calculatedAmount = baseAmount * this.totalMonth;

        // Only update if amount has changed
        if (this.amount !== calculatedAmount) {
          this.amount = calculatedAmount;
          this.amountEn = calculatedAmount;
          this.amountBng = this.designationData[0]?.amountBn;

          // Update form with calculated amount
          this.dataForm.patchValue({amount: calculatedAmount}, {emitEvent: false});

          // console.log('Amount auto-calculated:', calculatedAmount);
        }
      }
    }
  }

  /**
   * Handle organization selection
   */
  onOrganizationSelect(event: MatSelectChange) {
    // console.log('Organization selected:', event.value);

    // Reset dependent fields when organization changes
    this.dataForm.patchValue({
      committee: null,
      designation: null,
      amount: null
    });
    this.committee = [];
    this.designationData = [];
    this.amount = 0;

    // Trigger form field change
    this.onFormFieldChange();
  }

  /**
   * Manually set organization (for testing)
   */
  setDefaultOrganization() {
    if (this.organizationName.length > 0) {
      const defaultOrg = this.organizationName[0].name;
      this.dataForm.patchValue({organization: defaultOrg});
      // console.log('Default organization set:', defaultOrg);

      // Trigger the selection event
      this.onOrganizationSelect({value: defaultOrg} as MatSelectChange);
    }
  }

  /**
   * Ensure a payment method is always selected
   */
  private ensurePaymentMethodSelected() {
    if (!this.selectedPaymentMethod() && this.paymentMethods.length > 0) {
      this.selectedPaymentMethod.set(this.paymentMethods[0].slug);
      localStorage.setItem('paymentSlug', this.selectedPaymentMethod());
      // console.log('Auto-selected payment method:', this.selectedPaymentMethod());
    }
  }

  get filteredCountryData() {
    return this.countryData
      .filter(data =>
        data.name.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        data.dial_code.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        data.dial_code1.toLowerCase().includes(this.searchQuery().toLowerCase())
      )
      .sort((a, b) => {
        const query = this.searchQuery().toLowerCase();
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
    const foundCountry = this.countryData.find(
      (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
    );

    // Only update if country actually changed to avoid unnecessary change detection triggers
    if (foundCountry && (!this.getSingleCountry || this.getSingleCountry.code !== foundCountry.code)) {
      // Use Promise.resolve().then() to defer to next microtask, safer than setTimeout
      Promise.resolve().then(() => {
        this.getSingleCountry = foundCountry;

        // Update form with country data
        if (this.dataForm) {
          this.dataForm.patchValue({
            countryCode: this.getSingleCountry.dial_code || this.getSingleCountry.dial_code1,
            countryName: this.getSingleCountry.name,
            currency: this.getSingleCountry.currency || 'BDT'
          });
        }
      });
    }
  }


  /**
   * HTTP REQ HANDLE
   * getLoggedInUserInfo()
   */
  private getLoggedInUserInfo() {
    // Only call API if user is logged in to avoid 401 Unauthorized errors
    if (!this.userService.getUserStatus()) {
      // User is not logged in, skip API call
      this.user = null;
      return;
    }

    const select = 'phoneNo phone name designation committee organizationName';
    this.subDataOne = this.userDataService.getLoggedInUserData(select)
      .subscribe({
        next: (res) => {
          this.user = res.data?.user;

          // Auto-populate form fields with user data
          if (this.user) {
            this.populateUserData();
          }
        },
        error: (error) => {
          // Handle 401 or other errors gracefully
          if (error.status === 401) {
            // User token expired or not authenticated
            this.user = null;
            // Optionally log out the user if needed
            // this.userService.userLogOut();
          } else {
            console.log('Error fetching user data:', error);
          }
        }
      });
  }

  /**
   * Populate form fields with logged-in user data
   */
  private populateUserData() {
    if (this.user && this.dataForm) {
      // Populate name field
      if (this.user.name) {
        this.dataForm.patchValue({
          name: this.user.name
        });
        // console.log('Auto-populated name:', this.user.name);
      }

      // Populate phone number field
      if (this.user.phoneNo || this.user.phone) {
        const phoneNumber = this.user.phoneNo || this.user.phone;
        this.dataForm.patchValue({
          phoneNo: phoneNumber
        });
        // console.log('Auto-populated phone:', phoneNumber);

        // If user is logged in, mark phone as verified
        this.isVerified.set(true);
        this.isOtpSent.set(true);
        this.isOtpValid.set(true);
        this.isBtnHide.set(false);
      }

      // Auto-populate organization (set to default BNP if not available in user data)
      const organizationValue = this.user.organizationName || this.organizationName[0]?.name || null;
      if (organizationValue) {
        this.dataForm.patchValue({
          organization: organizationValue
        });
        // console.log('Auto-populated organization:', organizationValue);
      }

      // Set committee if available in user data
      if (this.user.committee) {
        // Filter committee based on user's committee name
        this.filterCommittee(this.user.committee);
        
        this.dataForm.patchValue({
          committee: this.user.committee
        });
        // console.log('Auto-populated committee:', this.user.committee);

        // Filter designation based on committee
        if (this.user.designation) {
          this.filterDesignation(this.user.designation);
          
          // Set designation if available in user data
          this.dataForm.patchValue({
            designation: this.user.designation
          });
          // console.log('Auto-populated designation:', this.user.designation);

          // Recalculate amount after setting designation
          setTimeout(() => {
            if (this.dataForm.get('startDate1').value && this.dataForm.get('endDate1').value) {
              this.calculateDifference();
            }
          }, 300);
        }
      }

      // Disable organization, committee, and designation fields when user is logged in
      // Use setTimeout to avoid "changed after checked" errors
      setTimeout(() => {
        if (this.dataForm.get('organization')) {
          this.dataForm.get('organization').disable();
        }
        if (this.dataForm.get('committee')) {
          this.dataForm.get('committee').disable();
        }
        if (this.dataForm.get('designation')) {
          this.dataForm.get('designation').disable();
        }
        
        // Update form validation after disabling fields
        this.dataForm.updateValueAndValidity();
      }, 0);
    }
    this.reloadCommitteeAndDesignation();
  }

  private reloadCommitteeAndDesignation() {
  // Filter committee based on selected organization
  if (this.dataForm.get('organization').value) {
    this.filterCommittee(this.dataForm.get('committee').value);
  }

  // Filter designation based on selected committee
  if (this.dataForm.get('committee').value && this.committee.length > 0) {
    this.filterDesignation(this.dataForm.get('designation').value);
  }

  // Recalculate amount
  if (this.dataForm.get('startDate1').value && this.dataForm.get('endDate1').value) {
    this.calculateDifference();
  }
}

  /**
   * Update form validation based on signals
   */
  private updateFormValidation() {
    if (this.dataForm) {
      // Update form validation based on current state
      this.dataForm.updateValueAndValidity();
    }
  }

  /**
   * Check if user is logged in and has required data
   */
  public isUserLoggedIn(): boolean {
    return this.user && this.user.name && (this.user.phoneNo || this.user.phone);
  }
}



