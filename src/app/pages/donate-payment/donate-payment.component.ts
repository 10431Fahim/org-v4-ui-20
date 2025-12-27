import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';
import {DonateService} from '../../services/common/donate.service';
import {UiService} from '../../services/core/ui.service';
import {DOCUMENT} from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';
import {SeoPageService} from '../../services/common/seo-page.service';
import {CanonicalService} from '../../services/common/canonical.service';
import {SeoPage} from '../../interfaces/common/seo-page.interface';

@Component({
  selector: 'app-donate-payment',
  templateUrl: './donate-payment.component.html',
  styleUrls: ['./donate-payment.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  standalone: true
})
export class DonatePaymentComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly donateService = inject(DonateService);
  private readonly uiService = inject(UiService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly seoPageService = inject(SeoPageService);
  private readonly canonicalService = inject(CanonicalService);

  dataForm = signal<FormGroup | null>(null);
  isLoading = signal<boolean>(false);
  isFormReadOnly = signal<boolean>(true);
  seoPage = signal<SeoPage | null>(null);

  constructor() {
    // Effect to handle SEO page updates
    effect(() => {
      const seoData = this.seoPage();
      if (seoData && isPlatformBrowser(this.platformId)) {
        this.updateMetaData();
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadQueryParams();
    this.getSeoPageByPageWithCache();
  }

  private initializeForm(): void {
    const form = this.formBuilder.group({
      phoneNo: [{value: '', disabled: true}, [Validators.required]],
      whatsAppNumber: [{value: '', disabled: true}],
      amount: [{value: null, disabled: true}, [Validators.required, Validators.min(1)]],
      name: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      currency: [{value: 'BDT', disabled: true}],
      agreeWithTermsAndConditions: [false, Validators.requiredTrue]
    });

    this.dataForm.set(form);
  }

  private loadQueryParams(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const form = this.dataForm();
        if (form) {
          // Auto-fill form from query parameters
          form.patchValue({
            phoneNo: params['phone'] || '',
            email: params['email'] || '',
            whatsAppNumber: params['whatsAppNumber'] || params['whatsapp'] || '',
            amount: params['amount'] ? parseFloat(params['amount']) : null,
            currency: params['currency'] || 'BDT',
            name: params['name'] || ''
          });

          // Enable form for submission (fields remain disabled but form can be submitted)
          form.get('agreeWithTermsAndConditions')?.enable();
        }
      });
  }

  onSubmit(): void {
    const form = this.dataForm();
    if (!form || form.invalid) {
      this.uiService.warn('Please accept the terms and conditions');
      return;
    }

    if (!form.value.agreeWithTermsAndConditions) {
      this.uiService.warn('Please accept the terms and conditions');
      return;
    }

    this.isLoading.set(true);

    // Prepare donation data
    const formValue = form.getRawValue(); // getRawValue() to get disabled field values
    const donationData = {
      ...formValue,
      paymentMethod: 'SSl Commerz',
      countryCode: 'BD',
      countryName: 'Bangladesh',
      maxDonationAmount: 10000,
      maxDonationCurrency: formValue.currency || 'BDT',
      isBangladesh: true
    };

    this.donateService.addDonate(donationData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);

          if (res.success) {
            this.uiService.success(res.message);

            if (res.data?.link) {
              // Redirect to payment gateway
              this.document.location.href = res.data.link;
            } else {
              // Redirect to success page or home
              this.router.navigate(['/donate']);
            }
          } else {
            this.uiService.warn(res.message || 'Payment processing failed');
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.uiService.warn('Payment processing failed. Please try again.');
          console.log(error);
        }
      });
  }

  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   */
  private getSeoPageByPageWithCache(): void {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('donate' as any, select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.seoPage.set(res);
        },
        error: err => {
          // console.log(err);
        }
      });
  }

  /**
   * SEO DATA UPDATE
   * updateMetaData()
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
      absoluteImageUrl = 'https://bnpbd.org/images/logo/bnp-logo-social.jpg';
    }
    
    const currentUrl = `https://bnpbd.org${this.router.url}`;
    const title = seoData.name || 'Complete Your Donation Payment - BNP BD';
    const description = seoData.seoDescription || 'Complete your donation payment to Bangladesh Nationalist Party (BNP)';

    // Title
    this.titleService.setTitle(title);

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || ''});

    // Open Graph Meta Tags
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

    // Canonical
    this.canonicalService.setCanonicalURL();
  }
}

