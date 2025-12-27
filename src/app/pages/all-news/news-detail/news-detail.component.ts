import {Component, OnInit, inject, signal, computed, DestroyRef, effect} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';
import {CanonicalService} from '../../../services/common/canonical.service';
import {MatDialog} from '@angular/material/dialog';
import {NewsDetailsLoaderComponent} from '../../../shared/loader/news-details-loader/news-details-loader.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {NewsCardOneLoaderComponent} from '../../../shared/loader/news-card-one-loader/news-card-one-loader.component';
import {ReviewService} from '../../../services/common/review.service';
import {Review} from '../../../interfaces/common/review.interface';
import {SocialShareComponent} from '../../../shared/components/ui/social-share/social-share.component';
import {SwiperComponent} from '../../../shared/components/swiper/swiper.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  imports: [
    NewsDetailsLoaderComponent,
    SafeHtmlCustomPipe,
    RouterLink,
    NewsCardOneLoaderComponent,
    TranslatePipe,
    DatePipe,
    SwiperComponent,
  ],
  standalone: true,
  host: {ngSkipHydration: 'true'},
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly reviewService = inject(ReviewService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly canonicalService = inject(CanonicalService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly reviewData = signal<Review[]>([]);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly id = signal<string | null>(null);
  readonly language = signal<string | null>(null);
  readonly review = signal<Review | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingRelated = signal<boolean>(true);

  // Angular 20: Signal to track current language for reactive updates
  readonly currentLang = signal<string>(this.translateService.currentLang || 'en');
  
  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.currentLang());
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  // Swiper breakpoints configuration for related news
  readonly swiperBreakpoints = {
    '520': { visibleSlides: 2, gap: 15 },
    '768': { visibleSlides: 2.3, gap: 15 },
    '1000': { visibleSlides: 2.5, gap: 20 },
    '1150': { visibleSlides: 2.5, gap: 20 },
    '1180': { visibleSlides: 3, gap: 20 },
    '1200': { visibleSlides: 3, gap: 20 }
  };

  constructor() {
    // Effect to reactively update metadata when language or review data changes
    effect(() => {
      const lang = this.currentLanguage();
      const review = this.review();
      
      // Only update metadata if review data is loaded
      if (review && lang) {
        if (lang === 'bn') {
          this.updateMetaDataBn();
        } else {
          this.updateMetaData();
        }
      }
    });
  }

  ngOnInit(): void {
    // Initialize language signal
    this.currentLang.set(this.translateService.currentLang || 'en');
    
    // Subscribe to translate service language changes
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(langChange => {
        this.currentLang.set(langChange.lang);
      });
    
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        this.activatedRoute.queryParamMap
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(qParam => {
            this.language.set(qParam.get('language'));
            this.id.set(param.get('id'));
            const currentId = this.id();
            if (currentId) {
              this.getReviewById(currentId);
            }
          });
      });

    // Debug: Log current breakpoints
  }

  getReviewById(id: string) {
    this.reviewService.getReviewById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.review.set(res.data);

          const currentReview = this.review();
          if (currentReview) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
          this.getAllOurReviews();
        },
        error: error => {
          this.isLoading.set(false);
          console.error(error);
        }
      });
  }

  private getAllOurReviews(): void {
    this.isLoadingRelated.set(true);
    this.reviewService.getAllNews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoadingRelated.set(false);
          if (res.success) {
            const currentId = this.id();
            if (currentId) {
              this.reviewData.set(res.data.filter(f => f._id !== currentId));
            }
          }
        },
        error: err => {
          this.isLoadingRelated.set(false);
          console.error(err);
        }
      });
  }
  // private getAllOurReviews() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     seoImage: 1,
  //
  //     // shortDescription: 1,
  //     description: 1,
  //     descriptionEn: 1,
  //     createdBy: 1,
  //     _id: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: {pageSize: 6, currentPage: 0},
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.subDataFour = this.reviewService.getAllReviews(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoadingRelated = false;
  //         if (res.success) {
  //           this.reviewData = res.data.filter(f => f._id !== this.id);;
  //         }
  //       },
  //       error: error => {
  //         this.isLoadingRelated = false;
  //         // console.log(error);
  //       }
  //     });
  // }

  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'bn');
    this.currentLang.set(language);
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.currentLang.set(language);
      this.translateService.use(this.isChangeLanguageToggle());
    } else {
      this.isChangeLanguageToggle.set('en');
      this.isChangeLanguage.set(false);
      this.currentLang.set('en');
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }



  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData() {
    const currentReview = this.review();
    if (!currentReview) return;

    const name = currentReview.name || 'BNPBD.ORG';
    const description = currentReview.shortDescription || 'BNPBD.ORG';
    const seoImage = currentReview.seoImage || '';

    // Title
    this.title.setTitle(name);

    // Meta Tags
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#00a0db' });
    this.meta.updateTag({ name: 'copyright', content: 'BNP BD' });
    this.meta.updateTag({ name: 'author', content: 'BNP BD' });
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'news' });

    // Open Graph Tags
    this.meta.updateTag({ property: 'og:title', content: name });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: seoImage });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh' });

    // Twitter Tags
    this.meta.updateTag({ name: 'twitter:title', content: name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:image', content: seoImage });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Microsoft Tile Image
    this.meta.updateTag({ name: 'msapplication-TileImage', content: seoImage });

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const currentReview = this.review();
    if (!currentReview) return;

    const name = currentReview.nameEn || 'BNPBD.ORG';
    const description = currentReview.shortDescriptionEn || 'BNPBD.ORG';
    const seoImage = currentReview.seoImage || '';

    this.title.setTitle(name);

    // Meta Tags
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#00a0db' });
    this.meta.updateTag({ name: 'copyright', content: 'BNP BD' });
    this.meta.updateTag({ name: 'author', content: 'BNP BD' });
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'news' });

    // Open Graph Tags
    this.meta.updateTag({ property: 'og:title', content: name });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: seoImage });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:locale', content: 'bn_BD' });
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh' });

    // Twitter Tags
    this.meta.updateTag({ name: 'twitter:title', content: name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:image', content: seoImage });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Microsoft Tile Image
    this.meta.updateTag({ name: 'msapplication-TileImage', content: seoImage });

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }

  // private updateMetaData() {
  //   // Title
  //   this.title.setTitle(this.review?.name);

  //   // Meta
  //   this.meta.updateTag({name: 'robots', content: 'index, follow'});
  //   this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
  //   this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
  //   this.meta.updateTag({name: 'author', content: 'BNP BD'});
  //   this.meta.updateTag({ name: 'keywords', content: 'news' });
  //   // this.meta.updateTag({name: 'description', content: this.review?.description});
  //   // Facebook
  //   this.meta.updateTag({ property: 'og:title', content: this.review?.name });
  //   this.meta.updateTag({ property: 'og:type', content: 'website' });
  //   this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
  //   this.meta.updateTag({ property: 'og:image:width', content: '300' });
  //   this.meta.updateTag({ property: 'og:image:height', content: '300' });
  //   this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
  //   this.meta.updateTag({ property: 'og:image', content: this.review?.seoImage });
  //   // this.meta.updateTag({ property: 'og:description', content: this.review?.description});
  //   this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
  //   this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
  //   // Twitter
  //   this.meta.updateTag({ name: 'twitter:title', content: this.review?.name });
  //   this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
  //   this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:image', content: this.review?.seoImage });
  //   // this.meta.updateTag({ name: 'twitter:description', content: this.review?.description});
  //   // Microsoft
  //   this.meta.updateTag({name: 'msapplication-TileImage', content: this.review?.seoImage});

  //   // Canonical
  //   this.canonicalService.setCanonicalURL();

  // }
  // private updateMetaDataBn() {
  //   // Title
  //   this.title.setTitle(this.review?.nameEn);

  //   // Meta
  //   this.meta.updateTag({name: 'robots', content: 'index, follow'});
  //   this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
  //   this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
  //   this.meta.updateTag({name: 'author', content: 'BNP BD'});
  //   this.meta.updateTag({ name: 'keywords', content: 'news' });
  //   // this.meta.updateTag({name: 'description', content: this.review?.descriptionEn});
  //   // Facebook
  //   this.meta.updateTag({ property: 'og:title', content: this.review?.nameEn });
  //   this.meta.updateTag({ property: 'og:type', content: 'website' });
  //   this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
  //   this.meta.updateTag({ property: 'og:image:width', content: '300' });
  //   this.meta.updateTag({ property: 'og:image:height', content: '300' });
  //   this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
  //   this.meta.updateTag({ property: 'og:image', content: this.review?.seoImage });
  //   // this.meta.updateTag({ property: 'og:description', content: this.review?.descriptionEn});
  //   this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
  //   this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
  //   // Twitter
  //   this.meta.updateTag({ name: 'twitter:title', content: this.review?.nameEn });
  //   this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
  //   this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:image', content: this.review?.seoImage });
  //   // this.meta.updateTag({ name: 'twitter:description', content: this.review?.descriptionEn});
  //   // Microsoft
  //   this.meta.updateTag({name: 'msapplication-TileImage', content: this.review?.seoImage});

  //   // Canonical
  //   this.canonicalService.setCanonicalURL();

  // }

  openDialog() {
    const currentReview = this.review();
    if (currentReview) {
      this.dialog.open(SocialShareComponent, {
        data: currentReview,
        maxWidth: "480px",
        width: "100%",
        height: "auto",
        panelClass: ['social-share', 'social-dialog']
      });
    }
  }



}
