import {AsyncPipe, DOCUMENT, isPlatformBrowser, NgForOf, NgIf} from "@angular/common";
import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AllCommittee, COUNTRY_DB, RESIDENT, RESIDENTBN} from "../../../core/utils/app-data";
import COUNTRY_DATA from "../../../core/utils/country";
import {ContactService} from '../../../services/common/contact.service';
import {MembershipFeeService} from "../../../services/common/membership-fee.service";
import {PaymentService} from "../../../services/common/payment.service";
import {UserService} from "../../../services/common/user.service";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {GeoService} from "../../../services/core/geo.service";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatMenu, MatMenuItem} from '@angular/material/menu';
import {SafeUrlPipe} from '../../../shared/pipes/safe-url.pipe';
import {PipesModule} from '../../../shared/pipes/pipes.module';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    NgIf,
    MatFormField,
    MatAutocompleteTrigger,
    MatInput,
    MatAutocomplete,
    MatOption,
    RouterLink,
    MatMenu,
    FormsModule,
    MatMenuItem,
    NgForOf,
    SafeUrlPipe,
    AsyncPipe,
    PipesModule
  ],
  styleUrls: ['./registration.component.scss']})
export class RegistrationComponent implements OnInit, OnDestroy {

  @ViewChild('formElement') formElement!: NgForm;

  navigateFrom: any;
  showMemberIdField = false;
  currency = 'BDT';
  countrys = COUNTRY_DB;
  resident = RESIDENT;
  residentBN = RESIDENTBN;
  countryData: any[] = COUNTRY_DATA;
  searchQuery: string = '';
  getSingleCountry?: any;
  registrationForm!: FormGroup;
  submitted = false;
  isLoadings = false;
  countrySelected = null;
  allCommittee = AllCommittee;
  citySelected = null;
  language: any;
  memberType: any;
  isLoading = false;
  // ✅ মূল পরিবর্তন - আলাদা cities
  citiesPresent: any[] = [];
  citiesPermanent: any[] = [];

  filteredCities: any[] = [];
  filteredPermanentCities: any[] = [];

  files!: File[];
  filteredPresentCountry$ = new BehaviorSubject<any[]>([]);
  filteredPermanentCountry$ = new BehaviorSubject<any[]>([]);
  availableDesignations: any[] = [];
  private subDataOne!: Subscription;
  private subGetData!: Subscription;

  constructor(
    private paymentService: PaymentService,
    private membershipFeeService: MembershipFeeService,
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
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
    this.initDataForm();
    this.activatedRoute.paramMap.subscribe(params => {
      this.memberType = params.get('type');
      this.registrationForm.patchValue({membershipType: this.memberType});
      const memberTypeValue = this.memberType;

      // ✅ Email validation based on memberType
      const emailControl = this.registrationForm.get('email');
      if (memberTypeValue === 'primary-member-fee') {
        // Email required for primary member
        emailControl?.setValidators([Validators.required, Validators.email]);
        this.registrationForm.get('agree')?.setValidators(Validators.required);
        this.registrationForm.get('agreeWithTermsAndConditions')?.setValidators(Validators.required);
      } else {
        // Email optional for other types
        emailControl?.setValidators([Validators.required, Validators.email]);
        this.registrationForm.get('agree')?.clearValidators();
        this.registrationForm.get('agreeWithTermsAndConditions')?.clearValidators();
      }

      // ✅ Committee and Designation validation based on memberType
      const committeeControl = this.registrationForm.get('committee');
      const designationControl = this.registrationForm.get('designation');
      if (memberTypeValue === 'member-fee') {
        // Committee and Designation required for member-fee
        committeeControl?.setValidators(Validators.required);
        designationControl?.setValidators(Validators.required);
      } else {
        // Optional for other types
        committeeControl?.clearValidators();
        designationControl?.clearValidators();
      }

      emailControl?.updateValueAndValidity();
      this.registrationForm.get('agree')?.updateValueAndValidity();
      this.registrationForm.get('agreeWithTermsAndConditions')?.updateValueAndValidity();
      committeeControl?.updateValueAndValidity();
      designationControl?.updateValueAndValidity();

      // Update country filter based on memberType
      this.filteredPresentCountry$.next(this.getFilteredCountries(this.countrys));
    });
    this.filteredPresentCountry$.next(this.getFilteredCountries(this.countrys));
    this.filteredPermanentCountry$.next(this.countrys);

    // Present Country Autocomplete
    this.registrationForm.get('country')?.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        const filtered = this.getFilteredCountries(this.countrys).filter(country =>
          country.name.toLowerCase().includes(value.toLowerCase())
        );
        this.filteredPresentCountry$.next(filtered);
      }
    });

    // Permanent Country Autocomplete
    this.registrationForm.get('countryPermanent')?.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        const filtered = this.countrys.filter(country =>
          country.name.toLowerCase().includes(value.toLowerCase())
        );
        this.filteredPermanentCountry$.next(filtered);
      }
    });

    this.activatedRoute.queryParamMap.subscribe(param => {
      if (param.get('navigateFrom')) {
        this.navigateFrom = param.get('navigateFrom');
      }
    });


    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    });

    // Set language from translate service if not provided in query params
    if (!this.language) {
      this.language = this.translateService.currentLang || 'en';
    }

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

    // this.onGetSingleCountry(this.countryData[0]);
    // this.useMyLocation()
    // ✅ Present Country Initial Setup
    this.setupPresentCountryAndCities();

    // ✅ Permanent Country Initial Setup
    this.setupPermanentCountryAndCities();
    this.setCurrencyValue();
  }

  async ngAfterViewInit() {
    // await this.useMyLocation();
  }


  private initDataForm() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      spouse: [''],
      // lastName: ['', Validators.required],
      memberId: [''],
      memberType: ['New Member'],
      memberShipType: [''],
      unitCommittee: [''],
      committee: [''],
      amount: [],
      email: [''],
      phoneNo: ['', [Validators.required]],
      designation: [''],
      // address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      zip: [''],
      nationalId: [''],
      occupation: [''],
      qualification: [''],
      recommender1Name: [''],
      recommender1Mobile: [''],
      recommender1Designation: [''],
      recommender2Name: [''],
      recommender2Mobile: [''],
      recommender2Designation: [''],
      images: [''],
      whatsAppNumber: ['', Validators.required],
      mothersName: [''],
      resident: [null],
      membershipType: [''],
      facebookId: [''],
      zipPermanent: [''],
      cityPermanent: ['', Validators.required],
      countryPermanent: ['', Validators.required],
      permanentAddress: [''],
      agree: [null],
      agreeWithTermsAndConditions: [null],
      countryCode: [null],
      countryName: [null],
      currency: [null]}, {
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

    // console.log("onSubmit")
    // Mark all form controls as touched to trigger validation display
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });

    // Validate country is selected from dropdown
    const countryValue = this.registrationForm.get('country')?.value;
    if (countryValue) {
      const validCountries = this.getFilteredCountries(this.countrys);
      const isValidCountry = validCountries.some(country => country.name === countryValue);
      if (!isValidCountry) {
        const countryControl = this.registrationForm.get('country');
        const currentErrors = countryControl?.errors || {};
        countryControl?.setErrors({ ...currentErrors, invalidCountry: true });
        this.uiService.warn('Please select a valid country from the dropdown');
        return;
      }
    }

    // Validate permanent country is selected from dropdown
    const countryPermanentValue = this.registrationForm.get('countryPermanent')?.value;
    if (countryPermanentValue) {
      const isValidPermanentCountry = this.countrys.some(country => country.name === countryPermanentValue);
      if (!isValidPermanentCountry) {
        const countryPermanentControl = this.registrationForm.get('countryPermanent');
        const currentErrors = countryPermanentControl?.errors || {};
        countryPermanentControl?.setErrors({ ...currentErrors, invalidCountry: true });
        this.uiService.warn('Please select a valid permanent country from the dropdown');
        return;
      }
    }

    // NOTE: Present city can be typed freely or selected from dropdown.
    // We no longer force it to match the predefined city list here.

    // Validate permanent city is selected from dropdown
    const cityPermanentValue = this.registrationForm.get('cityPermanent')?.value;
    if (cityPermanentValue && this.citiesPermanent.length > 0) {
      const isValidPermanentCity = this.citiesPermanent.some(city => city === cityPermanentValue);
      if (!isValidPermanentCity) {
        const cityPermanentControl = this.registrationForm.get('cityPermanent');
        const currentErrors = cityPermanentControl?.errors || {};
        cityPermanentControl?.setErrors({ ...currentErrors, invalidCity: true });
        this.uiService.warn('Please select a valid permanent city from the dropdown');
        return;
      }
    }

    if (this.registrationForm.invalid) {
      // Detailed debug for each control
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control && control.invalid) {
          // console.log(`Control "${key}" is invalid. Errors:`, control.errors, 'Value:', control.value);
          this.uiService.warn(`Control "${key}" is invalid. Errors: ${control.errors}, Value: ${control.value}`);
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
    if (!this.registrationForm.value.agreeWithTermsAndConditions ) {
      this.uiService.warn('Please select Terms & Conditions checkbox');

      return;
    }


    this.userRegistration();
  }


  private userRegistration() {

    // console.log('userRegistration');
    this.isLoadings = true;
    const mData = {
      ...this.registrationForm.value,
      memberShipType: this.memberType}

    this.subDataOne = this.userService.userRegistration(mData)
      .subscribe({
        next: (res => {

          if (res.success) {
            if (res.data.link) {
              // 👉 SSLCommerz redirect for professional purchase
              this.document.location.href = res.data.link;
            }
            this.isLoadings = false;
          } else {
            this.uiService.warn(res.message);
            this.isLoadings = false;
          }
        }),
        error: (error => {
          this.isLoadings = false;
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

  // ✅ Setup Present Country and Cities
  private setupPresentCountryAndCities() {
    const defaultCountry = this.registrationForm.get('country')?.value;
    const selectedCountry = this.countrys.find(item => item?.name === defaultCountry);
    this.citiesPresent = selectedCountry ? [...selectedCountry.city] : [];
    this.filteredCities = selectedCountry ? [...selectedCountry.city] : [];
    // Don't auto-select first city, let user choose

    this.registrationForm.get('country')?.valueChanges.subscribe((countryName) => {
      if (typeof countryName === 'string' && countryName.trim() !== '') {
        const validCountries = this.getFilteredCountries(this.countrys);
        const countryObj = validCountries.find(item => item?.name === countryName);
        if (countryObj) {
          this.citiesPresent = [...countryObj.city];
          this.filteredCities = [...countryObj.city];
          // Don't auto-select first city, let user choose
          // Clear any invalid state
          const countryControl = this.registrationForm.get('country');
          if (countryControl?.hasError('invalidCountry')) {
            const currentErrors = { ...countryControl.errors };
            delete currentErrors['invalidCountry'];
            countryControl.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
            countryControl.updateValueAndValidity();
          }
        } else {
          // Invalid country - user typed something not in the list
          this.citiesPresent = [];
          this.filteredCities = [];
          this.registrationForm.get('city')?.setValue('');
          // Set error to prevent form submission, but preserve required error if exists
          const countryControl = this.registrationForm.get('country');
          if (countryControl) {
            const currentErrors = countryControl.errors || {};
            countryControl.setErrors({ ...currentErrors, invalidCountry: true });
            countryControl.markAsTouched();
          }
        }
      }
    });

    this.registrationForm.get('city')?.valueChanges.subscribe((value) => {
      if (typeof value === 'string' && this.citiesPresent) {
        this.filteredCities = this.citiesPresent.filter(city =>
          city.toLowerCase().includes(value.toLowerCase())
        );
        // No strict validation: user may choose from dropdown or type a custom city name
      }
    });
  }

  onDesignationChange(event: any) {
    const selectedId = event.target.value;
    if (selectedId) {
      const selected = this.availableDesignations.find(d => d.name == selectedId);
      // if (selected) {
      //   this.registrationForm.patchValue({
      //     amount: selected.amount
      //   });
      //   // console.log('selected.amount',selected.amount);
      //
      // }
    }
  }

  // onDesignationChange(event: any) {
  //   const selectedId = event.target.value;
  //   if (selectedId) {
  //     const selected = this.availableDesignations.find(d => d.id == selectedId);
  //     if (selected) {
  //       this.registrationForm.patchValue({
  //         designation: this.currentLanguage === 'bn' ? selected.nameBn : selected.name
  //       });
  //     }
  //   } else {
  //     this.registrationForm.patchValue({ designation: '' });
  //   }
  // }


  // ✅ Setup Permanent Country and Cities
  private setupPermanentCountryAndCities() {
    const defaultPermanentCountry = this.registrationForm.get('countryPermanent')?.value;
    const selectedPermanentCountry = this.countrys.find(item => item?.name === defaultPermanentCountry);
    this.citiesPermanent = selectedPermanentCountry ? [...selectedPermanentCountry.city] : [];
    this.filteredPermanentCities = selectedPermanentCountry ? [...selectedPermanentCountry.city] : [];
    // Don't auto-select first city, let user choose

    this.registrationForm.get('countryPermanent')?.valueChanges.subscribe((countryName) => {
      if (typeof countryName === 'string' && countryName.trim() !== '') {
        const countryObj1 = this.countrys.find(item => item?.name === countryName);
        if (countryObj1) {
          this.citiesPermanent = [...countryObj1.city];
          this.filteredPermanentCities = [...countryObj1.city];
          // Don't auto-select first city, let user choose
          // Clear any invalid state
          const countryPermanentControl = this.registrationForm.get('countryPermanent');
          if (countryPermanentControl?.hasError('invalidCountry')) {
            const currentErrors = { ...countryPermanentControl.errors };
            delete currentErrors['invalidCountry'];
            countryPermanentControl.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
            countryPermanentControl.updateValueAndValidity();
          }
        } else {
          // Invalid country - user typed something not in the list
          this.citiesPermanent = [];
          this.filteredPermanentCities = [];
          this.registrationForm.get('cityPermanent')?.setValue('');
          // Set error to prevent form submission, but preserve required error if exists
          const countryPermanentControl = this.registrationForm.get('countryPermanent');
          if (countryPermanentControl) {
            const currentErrors = countryPermanentControl.errors || {};
            countryPermanentControl.setErrors({ ...currentErrors, invalidCountry: true });
            countryPermanentControl.markAsTouched();
          }
        }
      }
    });

    this.registrationForm.get('cityPermanent')?.valueChanges.subscribe((value) => {
      if (typeof value === 'string' && this.citiesPermanent) {
        this.filteredPermanentCities = this.citiesPermanent.filter(city =>
          city.toLowerCase().includes(value.toLowerCase())
        );

        // Validate city is from the dropdown list
        if (value.trim() !== '') {
          const isValidCity = this.citiesPermanent.some(city => city === value);
          const cityPermanentControl = this.registrationForm.get('cityPermanent');
          if (cityPermanentControl) {
            if (isValidCity) {
              // Clear invalid city error if exists
              if (cityPermanentControl.hasError('invalidCity')) {
                const currentErrors = { ...cityPermanentControl.errors };
                delete currentErrors['invalidCity'];
                cityPermanentControl.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
                cityPermanentControl.updateValueAndValidity();
              }
            } else {
              // Invalid city - user typed something not in the list
              const currentErrors = cityPermanentControl.errors || {};
              cityPermanentControl.setErrors({ ...currentErrors, invalidCity: true });
              cityPermanentControl.markAsTouched();
            }
          }
        }
      }
    });
  }

  // ✅ Event handlers for autocomplete selections
  onPresentCountrySelected(event: any) {
    const selectedCountry = event.option.value;
    const countryObj = this.countrys.find(item => item?.name === selectedCountry);
    if (countryObj) {
      this.citiesPresent = [...countryObj.city];
      this.filteredCities = [...countryObj.city];
      // Clear city when country changes
      this.registrationForm.get('city')?.setValue('');

      this.onGetSingleCountry(countryObj);
    }
  }

  onPresentCitySelected(event: any) {
    // City is already set by the autocomplete, no additional action needed
    // Clear any invalid city error when valid city is selected
    const cityControl = this.registrationForm.get('city');
    if (cityControl?.hasError('invalidCity')) {
      const currentErrors = { ...cityControl.errors };
      delete currentErrors['invalidCity'];
      cityControl.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
      cityControl.updateValueAndValidity();
    }
  }

  onPermanentCountrySelected(event: any) {
    const selectedCountry = event.option.value;
    const countryObj = this.countrys.find(item => item?.name === selectedCountry);
    if (countryObj) {
      this.citiesPermanent = [...countryObj.city];
      this.filteredPermanentCities = [...countryObj.city];
      // Clear city when country changes
      this.registrationForm.get('cityPermanent')?.setValue('');
    }
  }

  onPermanentCitySelected(event: any) {
    // City is already set by the autocomplete, no additional action needed
    // Clear any invalid city error when valid city is selected
    const cityPermanentControl = this.registrationForm.get('cityPermanent');
    if (cityPermanentControl?.hasError('invalidCity')) {
      const currentErrors = { ...cityPermanentControl.errors };
      delete currentErrors['invalidCity'];
      cityPermanentControl.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
      cityPermanentControl.updateValueAndValidity();
    }
  }

  // ✅ Focus event handlers to show full list when clicking on input
  onPresentCountryFocus() {
    // Show all countries when input is focused (excluding Bangladesh if primary-member-fee)
    this.filteredPresentCountry$.next(this.getFilteredCountries(this.countrys));
  }

  onPresentCityFocus() {
    // Show all cities for the selected country when input is focused
    const currentCountry = this.registrationForm.get('country')?.value;
    if (currentCountry) {
      const countryObj = this.countrys.find(item => item?.name === currentCountry);
      if (countryObj) {
        this.filteredCities = [...countryObj.city];
      }
    }
  }

  onPermanentCountryFocus() {
    // Show all countries when input is focused
    this.filteredPermanentCountry$.next(this.countrys);
  }

  onPermanentCityFocus() {
    // Show all cities for the selected country when input is focused
    const currentCountry = this.registrationForm.get('countryPermanent')?.value;
    if (currentCountry) {
      const countryObj = this.countrys.find(item => item?.name === currentCountry);
      if (countryObj) {
        this.filteredPermanentCities = [...countryObj.city];
      }
    }
  }

  onUnitCommitteeChange(event: any) {
    const selectedCommitteeId = event.target.value;
    if (selectedCommitteeId) {
      const selectedCommittee = this.allCommittee.find(committee => committee.name == selectedCommitteeId);
      if (selectedCommittee) {
        // console.log('selectedCommittee',selectedCommittee);

        this.availableDesignations = selectedCommittee.designation;

        // Clear the designation when committee changes
        this.registrationForm.get('designation')?.setValue('');
      }
    } else {
      this.availableDesignations = [];
      this.registrationForm.get('designation')?.setValue('');
    }
  }

  getSelectedDesignationAmount(): number {
    const selectedDesignationId = this.registrationForm.get('designation')?.value;
    if (selectedDesignationId && this.availableDesignations.length > 0) {
      const selectedDesignation = this.availableDesignations.find(desig => desig.name == selectedDesignationId);
      return selectedDesignation ? selectedDesignation.amount : 0;
    }
    return 0;
  }

  getSelectedAmount(): any {
    const selectedCountry = this.registrationForm.get('country')?.value;
    // console.log('selectedCountry',selectedCountry);

    if (this.currentLanguage === 'bn') {
      if (selectedCountry === 'Bangladesh') {
        return '২০ টাকা';
      } else if (selectedCountry === 'Saudi Arabia') {
        return '৫ ডলার';
      } else {
        return '১০ ডলার';
      }
    } else {
      if (selectedCountry === 'Bangladesh') {
        return '20TK'; // 20 Taka
      } else if (selectedCountry === 'Saudi Arabia') {
        return '$5'; // 5 Dollar
      } else {
        return '$10'; // Others 10 Dollar
      }
    }
  }


  get currentLanguage(): string {
    return this.translateService.currentLang || this.language || 'en';
  }

  // Helper method to filter countries based on memberType
  private getFilteredCountries(countries: any[]): any[] {
    // if (this.memberType === 'primary-member-fee') {
      return countries.filter(country => country.name !== 'Bangladesh');
    // }
    return countries;
  }

  onFileChange(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      this.files = Array.from(fileInput.files); // ✅ Convert FileList to File[]
      this.onUploadImages();
    } else {
      this.uiService.warn('Please select files');
    }
  }


  downloadForm(): void {
    // Build HTML content based on sodosso-form design and registration form data
    const formData = this.registrationForm.value;
    let htmlContent: any;
    this.isLoading = true;
    if (this.language === 'bn') {
      htmlContent = `
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 140px;" src="https://bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px;  line-height: 18px; text-align: center;margin-bottom: 0!important;">বিসমিল্লাহির রহমানির রহিম</h1>
    <h2 style="font-size: 30px;text-align: center; line-height: 20px">বাংলাদেশ জাতীয়তাবাদী দল</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -30px">
    <h3 style="line-height: 16px;font-size: 20px;margin-bottom: 0">কেন্দ্রীয় কার্যালয়</h3>
    <h3 style="line-height: 18px;font-size: 18px;margin-bottom: 2px;color: #ff5292;">(নতুন প্রাথমিক সদস্য / প্রাথমিক সদস্য নবায়ন ফরম)</h3>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span>নাম:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.name} </span>
  </div>

  <div style="display: grid;grid-template-columns: 100%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">শিক্ষাগত যোগ্যতা:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">পেশা:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.occupation}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">বয়স:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.age}</span>
    </div>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">বাসিন্দার অবস্থান:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.resident}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">ফোন/মোবাইল নাম্বার:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryCode}${formData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">ইমেইল:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.email}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">হোয়াটসঅ্যাপ নাম্বার:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.whatsAppNumber}</span>
    </div>
  </div>

<!--  <div style="display: grid;grid-template-columns: 50% 50%">-->
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">বর্তমান বসবাসের দেশ:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.country}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">শহর:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.city}</span>
    </div>
<!--  </div>-->

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">জিপ/পোস্টাল কোড:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zip}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">স্থায়ী ঠিকানা (দেশ):</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">শহর:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.cityPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">জিপ/পোস্টাল কোড:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zipPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">ফেসবুক প্রোফাইল লিংক:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.facebookId ?? 'N/A'}</span>
  </div>

  <div><h3 style="line-height: 20px;margin-bottom: 0;">প্রস্তাবক ১</h3></div>
  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">নাম:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Name}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">মোবাইল:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Mobile}</span>
    </div>
  </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">পদবী:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Designation}</span>
  </div>

  <div><h3 style="line-height: 20px;margin-bottom: 0;">প্রস্তাবক ২</h3></div>
  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">নাম:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Name}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">মোবাইল:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Mobile}</span>
    </div>
  </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">পদবী:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Designation}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 19px">
    <p style="line-height: 24px">আমি সশ্রদ্ধচিত্তে ঘোষণা করছি যে, আমি বাংলাদেশ জাতীয়তাবাদী দলের গঠনতন্ত্র, ঘোষণাপত্র ও আদর্শ-উদ্দেশ্যের প্রতি গভীরভাবে শ্রদ্ধাশীল। আমি আরো ঘোষণা করছি যে, বাংলাদেশি জাতীয়তাবাদ, উৎপাদনের রাজনীতি, জনগণের গণতন্ত্র, জাতীয় ঐক্য এবং ১৯৭৭ সালের জনসমর্থিত ১৯ দফা কর্মসূচি বাস্তবায়নের মাধ্যমে শান্তি ও সমৃদ্ধি অর্জনে দৃঢ় প্রত্যয়ী। আমি কখনো দুর্নীতিকে প্রশ্রয় দেবো না। আমাকে বাংলাদেশ জাতীয়তাবাদী দলের সদস্য হিসেবে গ্রহণ করার জন্য আবেদন জানাচ্ছি।</p>
  </div>

  <div style="display: flex;justify-content: space-between;">
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">চেয়ারপারসন</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">সদস্যের স্বাক্ষর</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">সংগ্রাহকের স্বাক্ষর</span>
    </div>
  </div>

  <div style="display: grid;grid-template-columns: 33.33% 33.33% 33.33%;margin-top: 8px">
    <div></div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;margin-right: 25px">
<!--      <span style="text-wrap: nowrap;">তারিখ</span>-->
<!--      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>-->
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;">
      <span style="text-wrap: nowrap;">তারিখ</span>
      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>
    </div>
  </div>

</div>

`;

    } else {
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
    <img style="width: 140px;" src="https://bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px;  line-height: 18px; text-align: center;margin-bottom: 0!important;">Bismillahir Rahmanir Rahim</h1>
    <h2 style="font-size: 30px;text-align: center; line-height: 20px">Bangladesh Nationalist Party</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -30px">
    <h3 style="line-height: 16px;font-size: 20px;margin-bottom: 0">Central office</h3>
    <h3 style="line-height: 20px;font-size: 20px;margin-bottom: 5px;color: #ff5292;">(New Primary Member/Primary Member Renewal Form)</h3>
<!--    <h3 style="line-height: 30px;font-size: 20px;margin-bottom: 0">Member's Part</h3>-->
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span>Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.name} </span>
  </div>

  <div style="display: grid;grid-template-columns: 100%">
    <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Educational Qualification:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>
    <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display: grid;grid-template-columns: 100%">
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Occupation:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.occupation}</span>
    </div>
  </div>


  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Age:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.age}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Resident Status:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.resident}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Phone / Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryCode}${formData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Email:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.email}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">WhatsApp Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.whatsAppNumber}</span>
  </div>
  </div>

<!--  <div style="display: grid;grid-template-columns: 50% 50%">-->
    <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Present Resident Country:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.country}</span>
    </div>
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">City:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.city}</span>
    </div>
<!--  </div>-->

<!--<div style="display: grid;grid-template-columns: 50% 50%">-->
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zip}</span>
    </div>

    <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Permanent Resident Country:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;"> City:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.cityPermanent}</span>
  </div>
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zipPermanent}</span>
    </div>
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Facebook Profile Link:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.facebookId ?? 'N/A'}</span>
  </div>
<!--  </div>-->

  <div><h3  style="line-height: 20px;margin-bottom: 0;">Recommend Person 1</h3></div>
  <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Name}</span>
  </div>


  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Mobile}</span>
  </div>
</div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Designation:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Designation}</span>
  </div>


  <div><h3 style="line-height: 20px;margin-bottom: 0;">Recommend Person 2</h3></div>
    <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Name}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Mobile}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Designation:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Designation}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 19px">
   <p style="line-height: 24px">I solemnly declare that I hold deep respect for the constitution, declaration, and ideals and objectives of the Bangladesh Nationalist Party. I further declare my firm commitment to uphold Bangladeshi nationalism, the politics of production, people’s democracy, national unity, and the achievement of peace and prosperity through the implementation of the 19-point program endorsed by the people in 1977. I pledge never to tolerate corruption. I hereby apply to be accepted as a member of the Bangladesh Nationalist Party.</p>
  </div>

  <div style="display: flex;justify-content: space-between;">
    <div style="display:flex;margin-top: 5px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Chairman</span>
    </div>
    <div style="display:flex;margin-top: 5px;font-size: 18px;border-top: 1px solid #000000;">
<!--      <span style="text-wrap: nowrap;">Member's signature</span>-->
    </div>
    <div style="display:flex;margin-top: 5px;font-size: 18px;border-top: 1px solid #000000;">
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

    this.contactService.generatePDF(htmlContent).subscribe((pdfBlob) => {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Membership_Registration_Form.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
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

  // “Use my location” বাটনের হ্যান্ডলার
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

    if (this.getSingleCountry && this.registrationForm) {
      this.registrationForm.patchValue({
        countryCode: this.getSingleCountry.dial_code || this.getSingleCountry.dial_code1,
        countryName: this.getSingleCountry.name,
        // currency: this.getSingleCountry.currency
      });
    }
  }

  setCurrencyValue() {
    // country change হলে currency auto set হবে
    this.registrationForm.get('country')?.valueChanges.subscribe((selectedCountry) => {
      if (selectedCountry === 'Bangladesh') {
        this.registrationForm.patchValue({currency: 'BDT'});
      } else {
        this.registrationForm.patchValue({currency: 'USD'});
      }
    });
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subGetData) {
      this.subGetData.unsubscribe();
    }
  }
}
