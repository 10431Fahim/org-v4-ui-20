import {Component, OnInit, ViewChild, signal, computed, effect, PLATFORM_ID, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {UserService} from "../../../services/common/user.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {Meta, Title} from '@angular/platform-browser';
import {isPlatformBrowser} from '@angular/common';
import {SeoPageService} from '../../../services/common/seo-page.service';
import {CanonicalService} from '../../../services/common/canonical.service';
import {SeoPage} from '../../../interfaces/common/seo-page.interface';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DestroyRef} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    TranslatePipe,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatInput,
    MatIcon,
    RouterLink
  ],
  standalone:true,
  styleUrls: ['./login.component.scss']})
export class LoginComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement!: NgForm;
  dataForm!: FormGroup;

  // Angular 20 Signals
  navigateFrom = signal<string | null>(null);
  memberType = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  formErrors = signal<{[key: string]: string}>({});
  seoPage = signal<SeoPage | null>(null);

  // Computed properties
  isFormValid = computed(() => this.dataForm?.valid ?? false);
  hasFormErrors = computed(() => Object.keys(this.formErrors()).length > 0);
  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private seoPageService: SeoPageService,
    private canonicalService: CanonicalService,
    private titleService: Title,
    private meta: Meta,
    private destroyRef: DestroyRef,
    @Inject(PLATFORM_ID) private platformId: any) {

    // Effect to watch form changes and update errors
    effect(() => {
      if (this.dataForm) {
        this.updateFormErrors();
      }
    });

    // Effect to handle SEO page updates
    effect(() => {
      const seoData = this.seoPage();
      if (seoData && isPlatformBrowser(this.platformId)) {
        // Check language - you may need to add language detection logic here
        // For now, using default (English)
        this.updateMetaData();
      }
    });
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    // Subscribe to route parameters using signals
    this.activatedRoute.queryParamMap.subscribe(param => {
      const navigateFrom = param.get('navigateFrom');
      this.navigateFrom.set(navigateFrom);
    });

    this.activatedRoute.paramMap.subscribe(params => {
      const memberType = params.get('type');
      this.memberType.set(memberType);
    });

    // SEO
     if (isPlatformBrowser(this.platformId)) {
      this.getSeoPageByPageWithCache();
     }
  }

  /**
   * FORM FUNCTIONS
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      username: new FormControl(
        {value: '', disabled: false},
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3)
        ]
      ),
      password: new FormControl(
        {value: '', disabled: false},
        [
          Validators.minLength(6),
          Validators.required
        ]
      )
    });

    // Watch form changes
    this.dataForm.valueChanges.subscribe(() => {
      this.updateFormErrors();
    });
  }

  private updateFormErrors() {
    const errors: {[key: string]: string} = {};

    if (this.username?.errors) {
      if (this.username.errors['required']) {
        errors['username'] = 'Email is required';
      } else if (this.username.errors['email']) {
        errors['username'] = 'Please enter a valid email address';
      } else if (this.username.errors['minlength']) {
        errors['username'] = 'Email must be at least 3 characters';
      }
    }

    if (this.password?.errors) {
      if (this.password.errors['required']) {
        errors['password'] = 'Password is required';
      } else if (this.password.errors['minlength']) {
        errors['password'] = 'Password must be at least 6 characters';
      }
    }

    this.formErrors.set(errors);
  }


  async onSubmit() {
    if (this.dataForm.invalid) {
      this.username?.markAsTouched({onlySelf: true});
      this.password?.markAsTouched({onlySelf: true});
      this.uiService.warn('Please fill all the required fields');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.userService.userLogin(this.dataForm.value, this.navigateFrom() || undefined);
    } catch (error) {
      console.error('Login error:', error);
      this.uiService.warn('Login failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Form Validations
   */
  get username() {
    return this.dataForm.get('username');
  }

  get password() {
    return this.dataForm.get('password');
  }

  /**
   * NAVIGATION
   */
  onRegistrationNavigate() {
    const navigateFrom = this.navigateFrom();
    if (navigateFrom) {
      this.router.navigate(['/registration'], {queryParams: {navigateFrom}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate(['/registration']);
    }
  }

  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   */
  private getSeoPageByPageWithCache(): void {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('login' as any, select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.seoPage.set(res);
          // Meta data updates are now handled by the effect in constructor
        },
        error: err => {
          // console.log(err);
        }
      });
  }

  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */
  private updateMetaData(): void {
    const seoData = this.seoPage();
    if (!seoData) return;

    // Get absolute image URL for social media with fallback
    const imageUrl = seoData.image || '';
    let absoluteImageUrl = '';

    if (imageUrl) {
      absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://bnpbd.org${imageUrl}`;
    } else {
      // Fallback to default BNP logo for social media
      absoluteImageUrl = 'https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png';
    }

    const currentUrl = `https://bnpbd.org${this.router.url}`;
    const title = seoData.name || 'BNP BD';
    const description = seoData.seoDescription || '';

    // Title
    this.titleService.setTitle(title);

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || ''});

    // Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp, etc.)
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: currentUrl});
    this.meta.updateTag({property: 'og:image', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:secure_url', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({property: 'og:image:width', content: '1200'});
    this.meta.updateTag({property: 'og:image:height', content: '630'});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'BNP Bangladesh'});

    // Twitter Card Meta Tags
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:title', content: title});
    this.meta.updateTag({name: 'twitter:description', content: description});
    this.meta.updateTag({name: 'twitter:image', content: absoluteImageUrl});
    this.meta.updateTag({name: 'twitter:image:alt', content: title});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});

    // Additional meta tags for better compatibility
    this.meta.updateTag({name: 'image', content: absoluteImageUrl});
    this.meta.updateTag({name: 'thumbnail', content: absoluteImageUrl});

    // Microsoft/Bing
    this.meta.updateTag({name: 'msapplication-TileImage', content: absoluteImageUrl});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn(): void {
    const seoData = this.seoPage();
    if (!seoData) return;

    // Get absolute image URL for social media with fallback
    const imageUrl = seoData.image || '';
    let absoluteImageUrl = '';

    if (imageUrl) {
      absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://bnpbd.org${imageUrl}`;
    } else {
      // Fallback to default BNP logo for social media
      absoluteImageUrl = 'https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png';
    }

    const currentUrl = `https://bnpbd.org${this.router.url}`;
    const title = seoData.nameEn || 'BNP BD';
    const description = seoData.seoDescription || '';

    // Title
    this.titleService.setTitle(title);

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || ''});

    // Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp, etc.)
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: currentUrl});
    this.meta.updateTag({property: 'og:image', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:secure_url', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({property: 'og:image:width', content: '1200'});
    this.meta.updateTag({property: 'og:image:height', content: '630'});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({property: 'og:locale', content: 'bn_BD'});
    this.meta.updateTag({property: 'og:site_name', content: 'BNP Bangladesh'});

    // Twitter Card Meta Tags
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:title', content: title});
    this.meta.updateTag({name: 'twitter:description', content: description});
    this.meta.updateTag({name: 'twitter:image', content: absoluteImageUrl});
    this.meta.updateTag({name: 'twitter:image:alt', content: title});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});

    // Additional meta tags for better compatibility
    this.meta.updateTag({name: 'image', content: absoluteImageUrl});
    this.meta.updateTag({name: 'thumbnail', content: absoluteImageUrl});

    // Microsoft/Bing
    this.meta.updateTag({name: 'msapplication-TileImage', content: absoluteImageUrl});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }
}
