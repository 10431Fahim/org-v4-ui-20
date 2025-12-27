import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {COUNTRY_DB} from "../../../core/utils/app-data";
import COUNTRY_DATA from "../../../core/utils/country";
import {Subscription} from "rxjs";
import {PaymentService} from "../../../services/common/payment.service";
import {MembershipFeeService} from "../../../services/common/membership-fee.service";
import {UtilsService} from "../../../services/core/utils.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {DOCUMENT, isPlatformBrowser, NgForOf, NgIf} from "@angular/common";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {UserService} from "../../../services/common/user.service";
import {UiService} from "../../../services/core/ui.service";
import {ContactService} from "../../../services/common/contact.service";
import {GeoService} from "../../../services/core/geo.service";
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SafeUrlPipe} from '../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-member-registration-form',
  templateUrl: './member-registration-form.component.html',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatMenuTrigger,
    NgForOf,
    NgIf,
    RouterLink,
    MatMenu,
    MatMenuItem,
    SafeUrlPipe,
    FormsModule
  ],
  standalone:true,
  styleUrls: ['./member-registration-form.component.scss'],

})
export class MemberRegistrationFormComponent implements OnInit, OnDestroy {

  // Data Form
  @ViewChild('formElement') formElement!: NgForm;

  navigateFrom: any;
  showMemberIdField = false;
  currency = 'BDT';
  countrys = COUNTRY_DB;
  countryData: any[] = COUNTRY_DATA;
  searchQuery: string = '';
  getSingleCountry?: any;
  registrationForm!: FormGroup;
  submitted = false;
  countrySelected = null;
  citySelected = null;
  language: any;
  cities: any;
  files!: File[];

  // Subscriptions
  private subDataOne!: Subscription;
  private subGetData!: Subscription;

  constructor(
    private paymentService: PaymentService, private membershipFeeService: MembershipFeeService,
    private utilsService: UtilsService,
    private fileUploadService : FileUploadService,
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    public translateService: TranslateService,
    public activatedRoute: ActivatedRoute,
    private userService: UserService,
    private uiService: UiService,
    private contactService: ContactService,
    private geoService: GeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    this.activatedRoute.queryParamMap.subscribe(param => {
      if (param.get('navigateFrom')) {
        this.navigateFrom = param.get('navigateFrom');
      }
    });
    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })
    this.registrationForm.get('memberType')?.valueChanges.subscribe(value => {
      const memberIdControl = this.registrationForm.get('memberId');
      if (value === 'Old Member') {
        this.showMemberIdField = true;
        memberIdControl?.setValidators([Validators.required]);
      } else {
        this.showMemberIdField = false;
        memberIdControl?.clearValidators();
        memberIdControl?.setValue('');
      }
      memberIdControl?.updateValueAndValidity();
    });
    this.useMyLocation()
    // this.onGetSingleCountry(this.countryData[0]);

    // Initialize cities for the default country
    const defaultCountry = this.registrationForm.get('country')?.value;
    const selectedCountry = this.countrys.find((item) => item?.name === defaultCountry);
    this.cities = selectedCountry ? [...selectedCountry.city] : [];
    if (this.cities.length > 0) {
      this.registrationForm.get('city')?.setValue(this.cities[0]);
    }
    // Listen for country changes
    this.registrationForm.get('country')?.valueChanges.subscribe((countryName) => {
      const countryObj = this.countrys.find((item) => item?.name === countryName);
      this.cities = countryObj ? [...countryObj.city] : [];
      // Set city to first city of the new country if available
      this.registrationForm.get('city')?.setValue(this.cities.length > 0 ? this.cities[0] : '');
    });
  }


  private initDataForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      memberId: [''],
      memberType: ['New Member', Validators.required],
      organizationName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]],
      designation: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      country: ['Bangladesh', Validators.required],
      city: ['Dhaka', Validators.required],
      zip: ['', Validators.required],
      nationalId: ['', Validators.required],
      occupation: ['',Validators.required],
      qualification: ['',Validators.required],
      recommender1Name: ['', Validators.required],
      recommender1Mobile: ['', Validators.required],
      recommender1Designation: ['', Validators.required],
      recommender2Name: ['', Validators.required],
      recommender2Mobile: ['', Validators.required],
      recommender2Designation: ['', Validators.required],
      images: [''],
      whatsAppNumber: [''],
      facebookId: [''],
      permanentAddress: [''],
      agree: [false, Validators.requiredTrue],
      agreeWithTermsAndConditions: [false, Validators.requiredTrue],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  // onFileChange(event: any): void {
  //   // const fileInput = event.target as HTMLInputElement;
  //   // if (fileInput.files && fileInput.files.length > 0) {
  //   //   const files = Array.from(fileInput.files);
  //   //   this.registrationForm.get('images')?.setValue(files);
  //   //   console.log('Files selected:', files.map(f => f.name));
  //   // }
  //   console.log("event", event)
  //   this.files = event;
  //   this.onUploadImages();
  // }

  onFileChange(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      this.files = Array.from(fileInput.files); // ✅ Convert FileList to File[]
      this.onUploadImages();
    } else {
      this.uiService.warn('Please select files');
    }
  }


  /**
   * ON IMAGE UPLOAD
   */
  onUploadImages() {
    if (this.files) {
      this.subGetData = this.fileUploadService.uploadMultiImageOriginal(this.files)
        .subscribe({
          next: res => {
            const downloadUrls = res.map((d) => d.url);
            this.registrationForm.get('images')?.setValue(downloadUrls);

          },
          error: err => {
            console.log(err);
          }
        });
    } else {
      this.uiService.warn('Please select your address');
    }
  }

  onSubmit(): void {
    this.submitted = true;
    // console.log('Submit button clicked');
    if (this.registrationForm.invalid) {
      // Detailed debug for each control
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control && control.invalid) {
          // console.log(`Control "${key}" is invalid. Errors:`, control.errors, 'Value:', control.value);
        }
      });
      return;
    }
    if (this.registrationForm.value.password !== this.registrationForm.value.confirmPassword) {
      this.uiService.warn('Password and confirm password is not matched');
      this.password?.markAsTouched({onlySelf: true});
      this.confirmPassword?.markAsTouched({onlySelf: true});
      return;
    }


    this.userRegistration();

  }


  private userRegistration() {
    const mData = {
      ...this.registrationForm.value,
      name: this.registrationForm.value.firstName + ' ' + this.registrationForm.value.lastName,
    }

    this.subDataOne = this.userService.userRegistration(mData)
      .subscribe({
        next: (res => {

          if (res.success) {
            if (res.data.link) {
              // 👉 SSLCommerz redirect for professional purchase
              this.document.location.href = res.data.link;
            }
          } else {
            this.uiService.warn(res.message);
          }
        }),
        error: (error => {

          //console.log(error);
        })
      });
  }


  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }


  downloadForm(): void {
    // Build HTML content based on sodosso-form design and registration form data
    const formData = this.registrationForm.value;
    let htmlContent : any;

    if(this.language === 'bn'){
      htmlContent = `
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; height: 1070px;">
    <img src="https://bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">

  <div style="display:flex; gap: 10px; align-items: center; margin-bottom: 0">
    <img style="width: 150px;" src="https://bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
    <div>
      <h1 style="font-size: 20px; text-align: center;">বিসমিল্লাহির রাহমানির রাহিম</h1>
      <h2 style="font-size: 30px; text-align: center;">বাংলাদেশ জাতীয়তাবাদী দল</h2>
    </div>
  </div>

  <div style="display:flex; justify-content: center; align-items: center; flex-direction: column; margin-top: -20px">
    <h3 style="line-height: 20px; font-size: 20px; margin-bottom: 0">কেন্দ্রীয় অফিস</h3>
    <h3 style="line-height: 20px; font-size: 20px; margin-bottom: 0; color: #ff5292;">সদস্যপদ রসিদ (নতুন/নবায়ন)</h3>
  </div>

  <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
    <span style="text-wrap: nowrap;">নাম:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.firstName} ${formData?.lastName} </span>
  </div>

  <div style="display: grid; grid-template-columns: 100%">
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">শিক্ষাগত যোগ্যতা:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 50% 50%">
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">পেশা:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.occupation}</span>
    </div>
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">পদবী:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.designation}</span>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 50% 50%">
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">দেশ:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.country}</span>
    </div>
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">জেলা / মহানগর:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.city}</span>
    </div>
  </div>

  <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
    <span style="text-wrap: nowrap;">জাতীয় পরিচয়পত্র নম্বর:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.nationalId}</span>
  </div>

  <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
    <span style="text-wrap: nowrap;">ফোন / মোবাইল:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.phoneNo}</span>
  </div>

  <div style="display: grid; grid-template-columns: 50% 50%">
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">ইমেইল:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.email}</span>
    </div>
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">হোয়াটসঅ্যাপ নম্বর:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.whatsAppNumber}</span>
    </div>
  </div>

  <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
    <span style="text-wrap: nowrap;">ফেসবুক প্রোফাইল লিংক:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.facebookId}</span>
  </div>

  <div><h3 style="line-height: 20px; margin-bottom: 0;">সুপারিশকৃত ব্যক্তি ১</h3></div>
  <div style="display: grid; grid-template-columns: 50% 50%">
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">নাম:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.recommender1Name}</span>
    </div>
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">মোবাইল নম্বর:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.recommender1Mobile}</span>
    </div>
  </div>

  <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
    <span style="text-wrap: nowrap;">পদবী:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.recommender1Designation}</span>
  </div>

  <div><h3 style="line-height: 20px; margin-bottom: 0;">সুপারিশকৃত ব্যক্তি ২</h3></div>
  <div style="display: grid; grid-template-columns: 50% 50%">
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">নাম:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.recommender2Name}</span>
    </div>
    <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
      <span style="text-wrap: nowrap;">মোবাইল নম্বর:</span>
      <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.recommender2Mobile}</span>
    </div>
  </div>

  <div style="display:flex; margin-top: 15px; font-size: 20px; align-content: center;">
    <span style="text-wrap: nowrap;">পদবী:</span>
    <span style="padding-left: 8px; border-bottom: 1px solid #000; width: 100%;"> ${formData?.recommender2Designation}</span>
  </div>

  <div style="display:flex; margin-top: 10px; font-size: 19px;">
    <p style="line-height: 30px">আমি সশ্রদ্ধচিত্তে ঘোষণা করছি যে, আমি বাংলাদেশ জাতীয়তাবাদী দলের গঠনতন্ত্র, ঘোষণাপত্র ও আদর্শ-উদ্দেশ্যের প্রতি গভীরভাবে শ্রদ্ধাশীল। আমি আরো ঘোষণা করছি যে, বাংলাদেশি জাতীয়তাবাদ, উৎপাদনের রাজনীতি, জনগণের গণতন্ত্র, জাতীয় ঐক্য এবং ১৯৭৭ সালের জনসমর্থিত ১৯ দফা কর্মসূচি বাস্তবায়নের মাধ্যমে শান্তি ও সমৃদ্ধি অর্জনে দৃঢ় প্রত্যয়ী। আমি কখনো দুর্নীতিকে প্রশ্রয় দেবো না। আমাকে বাংলাদেশ জাতীয়তাবাদী দলের সদস্য হিসেবে গ্রহণ করার জন্য আবেদন জানাচ্ছি।</p>
  </div>

  <div style="display: flex; justify-content: space-between;">
    <div style="display:flex; margin-top: 10px; font-size: 20px; border-top: 1px solid #000;">চেয়ারপারসন</div>
    <div style="display:flex; margin-top: 10px; font-size: 20px; border-top: 1px solid #000;">সদস্যের স্বাক্ষর</div>
    <div style="display:flex; margin-top: 10px; font-size: 20px; border-top: 1px solid #000;">সংগ্রাহকের স্বাক্ষর</div>
  </div>

  <div style="display: grid; grid-template-columns: 33.33% 33.33% 33.33%; margin-top: 20px;">
    <div></div>
    <div style="display:flex; margin-top: 15px; font-size: 20px; margin-right: 25px;">
      <span>তারিখ</span>
      <p style="border-top: 1px solid #000; width: 100%;"></p>
    </div>
    <div style="display:flex; margin-top: 15px; font-size: 20px;">
      <span>তারিখ</span>
      <p style="border-top: 1px solid #000; width: 100%;"></p>
    </div>
  </div>

</div>
</div>
`;

    }else{
      htmlContent = `
   <!--<div class="preview-container">-->
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">
<!--  <div style="display:flex;justify-content: center;margin-bottom: 10px">-->
<!--    <h1 style="font-size: 16px">Bismillahir Rahmanir Rahim</h1>-->
<!--  </div>-->

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 150px;" src="https://bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px; text-align: center;">Bismillahir Rahmanir Rahim</h1>
    <h2 style="font-size: 30px;text-align: center;">Bangladesh Nationalist Party</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -20px">
    <h3 style="line-height: 20px;font-size: 20px;margin-bottom: 0">Central office</h3>
    <h3 style="line-height: 20px;font-size: 20px;margin-bottom: 0;color: #ff5292;">Membership Receipt New/Renewal</h3>
<!--    <h3 style="line-height: 30px;font-size: 20px;margin-bottom: 0">Member's Part</h3>-->
  </div>

  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span>Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.firstName + '' + formData?.lastName} </span>
  </div>

  <div style="display: grid;grid-template-columns: 100%">
    <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">Educational Qualification:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>
    <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display: grid;grid-template-columns: 100%">
  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">Occupation:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.occupation}</span>
    </div>
  </div>

  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Designation:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.designation}</span>
  </div>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">Country:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.country}</span>
    </div>
    <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
      <span style="text-wrap: nowrap;">District / Metropolis</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.city}</span>
    </div>
  </div>

  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">National Identity Card No:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.nationalId}</span>
  </div>
  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Phone / Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
 <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Email:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.phoneNo}</span>
  </div>

<div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">WhatsApp Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.phoneNo}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Facebook Profile Link:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.phoneNo}</span>
  </div>

  <div><h3  style="line-height: 20px;margin-bottom: 0;">Recommend Person 1</h3></div>
  <div style="display: grid;grid-template-columns: 50% 50%">
<div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Name}</span>
  </div>


<div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Mobile}</span>
  </div>
</div>

  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Designation:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Designation}</span>
  </div>


  <div><h3 style="line-height: 20px;margin-bottom: 0;">Recommend Person 2</h3></div>
    <div style="display: grid;grid-template-columns: 50% 50%">
<div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Name}</span>
  </div>

<div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Mobile}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 15px;font-size: 20px;align-content: center;">
    <span style="text-wrap: nowrap;">Designation:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Designation}</span>
  </div>

  <div style="display:flex;margin-top: 10px;font-size: 19px">
   <p style="line-height: 30px">I solemnly declare that I hold deep respect for the constitution, declaration, and ideals and objectives of the Bangladesh Nationalist Party. I further declare my firm commitment to uphold Bangladeshi nationalism, the politics of production, people’s democracy, national unity, and the achievement of peace and prosperity through the implementation of the 19-point program endorsed by the people in 1977. I pledge never to tolerate corruption. I hereby apply to be accepted as a member of the Bangladesh Nationalist Party.</p>
  </div>

  <div style="display: flex;justify-content: space-between;">
    <div style="display:flex;margin-top: 10px;font-size: 20px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Chairperson</span>
    </div>
    <div style="display:flex;margin-top: 10px;font-size: 20px;border-top: 1px solid #000000;">
<!--      <span style="text-wrap: nowrap;">Member's signature</span>-->
    </div>
    <div style="display:flex;margin-top: 10px;font-size: 20px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Collector's signature</span>
    </div>
  </div>


  <div style="display: grid;grid-template-columns: 33.33% 33.33% 33.33%;margin-top: 20px">
    <div style="display:flex;margin-top: 15px;font-size: 20px">
    </div>
    <div style="display:flex;margin-top: 15px;font-size: 20px;margin-right: 25px">
<!--      <span style="text-wrap: nowrap;">Date</span>-->
<!--      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>-->
    </div>
    <div style="display:flex;margin-top: 15px;font-size: 20px">
      <span style="text-wrap: nowrap;">Date</span>
      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>
    </div>
  </div>

</div>
</div>
    `;
    }


    this.contactService.generatePDF(htmlContent).subscribe((pdfBlob) => {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Membership_Registration_Form.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  get filteredCountryData() {
    return this.countryData
      .filter(data =>
        data.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        data.dial_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        data.dial_code1.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const query = this.searchQuery.toLowerCase();
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
    this.getSingleCountry = this.countryData.find(
      (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
    );
  }

  onCountryChange(event: any) {
    // Reset the city selection completely
    this.citySelected = null;
    this.cities = [];
    // Set countryOfResidence with the selected country name
    this.registrationForm.patchValue({
      countryOfResidence: event?.name || null,
    });

    // Find the selected country's cities and update the cities array
    const selectedCountry = this.countrys?.find(
      (item) => item?.name === event?.name
    );

    if (selectedCountry) {
      this.cities = [...selectedCountry.city]; // Populate the cities array
    }
  }

  onCityChange(event: any) {
    // Update the cityOfResidence form control
    this.registrationForm.patchValue({
      cityOfResidence: event || null
    });
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

  }
}
