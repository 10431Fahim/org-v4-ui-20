import {Component, OnInit, signal, computed, effect, inject, DestroyRef} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {FoundingHistoricService} from "../../services/common/founding-historic.service";
import {MatDialog} from '@angular/material/dialog';
import {Select} from "../../interfaces/core/select";
import {MONTHS} from "../../core/utils/app-data";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {SocialShareComponent} from "../../shared/components/ui/social-share/social-share.component";
import {CanonicalService} from '../../services/common/canonical.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-founding-historic',
  templateUrl: './founding-historic.component.html',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  styleUrls: ['./founding-historic.component.scss']
})
export class FoundingHistoricComponent implements OnInit {
  // Angular 20 Signals for reactive state management
  foundingHistoric = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  language = signal<string>('en');
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  firstFoundingHistoric = computed(() => this.foundingHistoric()[0] || null);
  hasFoundingHistoric = computed(() => this.foundingHistoric().length > 0);
  informations = computed(() => this.firstFoundingHistoric()?.informations || []);
  isLanguageBengali = computed(() => this.language() === 'bn');

  // Static Data
  months: Select[] = MONTHS;

  // Filter & Sort
  filter: any = null;

  // Angular 20 uses takeUntilDestroyed instead of manual subscriptions

  // Inject services using Angular 20 inject function
  private dialog = inject(MatDialog);
  private foundingHistoricService = inject(FoundingHistoricService);
  private spinnerService = inject(NgxSpinnerService);
  public translateService = inject(TranslateService);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private canonicalService = inject(CanonicalService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Effect to handle language changes and update meta data
    effect(() => {
      const foundingHistoric = this.foundingHistoric();
      const language = this.language();

      if (foundingHistoric && foundingHistoric.length > 0) {
        // Use setTimeout to prevent immediate re-rendering
        setTimeout(() => {
          if (language === 'bn') {
            this.updateMetaDataBn();
          } else {
            this.updateMetaData();
          }
        }, 0);
      }
    }, { allowSignalWrites: true });
  }
  ngOnInit(): void {
    // Handle route parameters with debouncing to prevent multiple updates
    this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((param) => {
      this.activatedRoute.queryParamMap.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(qParam => {
        const newLanguage = qParam.get('language') || 'en';
        // Only update if language actually changed
        if (this.language() !== newLanguage) {
          this.language.set(newLanguage);
        }
      });
    });

    // Load founding historic data
    this.getAllFoundingHistorics();
  }

  // getAllFoundingHistorics() {
  //
  //   this.spinnerService.show();
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: {
  //       name: 1,
  //       description: 1,
  //       nameEn: 1,
  //       descriptionEn: 1,
  //       websiteUrl: 1,
  //       slug: 1,
  //       informations: 1,
  //       image: 1,
  //       createdAt: 1,
  //       foundingHistoricCategory: 1,
  //       briefTimelineImg: 1
  //     },
  //     sort: {
  //       createdAt: -1
  //     }
  //   }
  //
  //   this.subDataOne = this.foundingHistoricService.getAllFoundingHistorics(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         this.foundingHistoric = res.data;
  //
  //         if (this.foundingHistoric) {
  //           if (this.language === 'bn') {
  //             this.updateMetaDataBn();
  //           }
  //          else {
  //             this.updateMetaData();
  //           }
  //         }
  //
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         console.log(err)
  //       }
  //     })
  // }

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

  private getAllFoundingHistorics(): void {
    this.spinnerService.show();
    this.isLoading.set(true);

    this.foundingHistoricService.getAllFoundingHistoric()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.spinnerService.hide();
          // Only update if data actually changed
          if (JSON.stringify(this.foundingHistoric()) !== JSON.stringify(res.data)) {
            this.foundingHistoric.set(res.data);
          }
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
          this.spinnerService.hide();
        }
      });
  }

  /**
   * SEO DATA UPDATE
   * updateMetaData()
   */

  private updateMetaData() {
    const firstHistoric = this.firstFoundingHistoric();
    if (!firstHistoric) return;

    // Get absolute image URL for social media with fallback
    const imageUrl = firstHistoric.seoImage || firstHistoric.image || '';
    let absoluteImageUrl = '';

    if (imageUrl) {
      absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://bnpbd.org${imageUrl}`;
    } else {
      // Fallback to default BNP logo for social media
      absoluteImageUrl = 'https://bnpbd.org/images/logo/bnp-logo-social.jpg';
    }
    const currentUrl = `https://bnpbd.org${this.router.url}`;

    // Title
    this.title.setTitle(firstHistoric.name || 'BNP Founding Historic');

    // Basic Meta Tags
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'keywords', content: 'BNP, Bangladesh Nationalist Party, Founding Historic, Politics, Bangladesh'});
    this.meta.updateTag({name: 'description', content: firstHistoric.description || 'Learn about the founding historic of Bangladesh Nationalist Party'});

    // Open Graph Meta Tags (Facebook, LinkedIn, etc.)
    this.meta.updateTag({property: 'og:title', content: firstHistoric.name || 'BNP Founding Historic'});
    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.meta.updateTag({property: 'og:url', content: currentUrl});
    this.meta.updateTag({property: 'og:image', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:secure_url', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({property: 'og:image:width', content: '1200'});
    this.meta.updateTag({property: 'og:image:height', content: '630'});
    this.meta.updateTag({property: 'og:image:alt', content: firstHistoric.name || 'BNP Founding Historic'});
    this.meta.updateTag({property: 'og:description', content: firstHistoric.description || 'Learn about the founding historic of Bangladesh Nationalist Party'});
    this.meta.updateTag({property: 'og:site_name', content: 'BNP BD'});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});

    // Twitter Card Meta Tags
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:title', content: firstHistoric.name || 'BNP Founding Historic'});
    this.meta.updateTag({name: 'twitter:description', content: firstHistoric.description || 'Learn about the founding historic of Bangladesh Nationalist Party'});
    this.meta.updateTag({name: 'twitter:image', content: absoluteImageUrl});
    this.meta.updateTag({name: 'twitter:image:alt', content: firstHistoric.name || 'BNP Founding Historic'});

    // Additional Meta Tags for better SEO
    this.meta.updateTag({name: 'article:author', content: 'BNP BD'});
    this.meta.updateTag({name: 'article:section', content: 'Politics'});
    this.meta.updateTag({name: 'article:tag', content: 'BNP, Bangladesh Nationalist Party, Founding Historic'});
    this.meta.updateTag({name: 'article:published_time', content: new Date().toISOString()});

    // WhatsApp and Telegram specific tags
    this.meta.updateTag({name: 'whatsapp:title', content: firstHistoric.name || 'BNP Founding Historic'});
    this.meta.updateTag({name: 'whatsapp:description', content: firstHistoric.description || 'Learn about the founding historic of Bangladesh Nationalist Party'});
    this.meta.updateTag({name: 'whatsapp:image', content: absoluteImageUrl});

    // Microsoft/Bing Meta Tags
    this.meta.updateTag({name: 'msapplication-TileImage', content: absoluteImageUrl});
    this.meta.updateTag({name: 'msapplication-TileColor', content: '#00a0db'});

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }
  private updateMetaDataBn() {
    const firstHistoric = this.firstFoundingHistoric();
    if (!firstHistoric) return;

    // Get absolute image URL for social media with fallback
    const imageUrl = firstHistoric.seoImage || firstHistoric.image || '';
    let absoluteImageUrl = '';

    if (imageUrl) {
      absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://bnpbd.org${imageUrl}`;
    } else {
      // Fallback to default BNP logo for social media
      absoluteImageUrl = 'https://bnpbd.org/images/logo/bnp-logo-social.jpg';
    }
    const currentUrl = `https://bnpbd.org${this.router.url}`;

    // Title
    this.title.setTitle(firstHistoric.nameEn || 'বিএনপি প্রতিষ্ঠার ইতিহাস');

    // Basic Meta Tags
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'keywords', content: 'বিএনপি, বাংলাদেশ জাতীয়তাবাদী দল, প্রতিষ্ঠার ইতিহাস, রাজনীতি, বাংলাদেশ'});
    this.meta.updateTag({name: 'description', content: firstHistoric.descriptionEn || 'বাংলাদেশ জাতীয়তাবাদী দলের প্রতিষ্ঠার ইতিহাস সম্পর্কে জানুন'});

    // Open Graph Meta Tags (Facebook, LinkedIn, etc.)
    this.meta.updateTag({property: 'og:title', content: firstHistoric.nameEn || 'বিএনপি প্রতিষ্ঠার ইতিহাস'});
    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.meta.updateTag({property: 'og:url', content: currentUrl});
    this.meta.updateTag({property: 'og:image', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:secure_url', content: absoluteImageUrl});
    this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({property: 'og:image:width', content: '1200'});
    this.meta.updateTag({property: 'og:image:height', content: '630'});
    this.meta.updateTag({property: 'og:image:alt', content: firstHistoric.nameEn || 'বিএনপি প্রতিষ্ঠার ইতিহাস'});
    this.meta.updateTag({property: 'og:description', content: firstHistoric.descriptionEn || 'বাংলাদেশ জাতীয়তাবাদী দলের প্রতিষ্ঠার ইতিহাস সম্পর্কে জানুন'});
    this.meta.updateTag({property: 'og:site_name', content: 'BNP BD'});
    this.meta.updateTag({property: 'og:locale', content: 'bn_BD'});

    // Twitter Card Meta Tags
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:title', content: firstHistoric.nameEn || 'বিএনপি প্রতিষ্ঠার ইতিহাস'});
    this.meta.updateTag({name: 'twitter:description', content: firstHistoric.descriptionEn || 'বাংলাদেশ জাতীয়তাবাদী দলের প্রতিষ্ঠার ইতিহাস সম্পর্কে জানুন'});
    this.meta.updateTag({name: 'twitter:image', content: absoluteImageUrl});
    this.meta.updateTag({name: 'twitter:image:alt', content: firstHistoric.nameEn || 'বিএনপি প্রতিষ্ঠার ইতিহাস'});

    // Additional Meta Tags for better SEO
    this.meta.updateTag({name: 'article:author', content: 'BNP BD'});
    this.meta.updateTag({name: 'article:section', content: 'রাজনীতি'});
    this.meta.updateTag({name: 'article:tag', content: 'বিএনপি, বাংলাদেশ জাতীয়তাবাদী দল, প্রতিষ্ঠার ইতিহাস'});

    // Microsoft/Bing Meta Tags
    this.meta.updateTag({name: 'msapplication-TileImage', content: absoluteImageUrl});

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }
  openDialog() {
    this.dialog.open(SocialShareComponent, {
      data: this.foundingHistoric(),
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    });
  }

  // Angular 20 with takeUntilDestroyed automatically handles cleanup
  // No need for OnDestroy implementation
}
