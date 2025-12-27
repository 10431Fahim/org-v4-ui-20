import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../services/common/canonical.service";
import {SeoPageService} from "../../services/common/seo-page.service";
import {DatePipe} from '@angular/common';
import {RecentlyAllNewsComponent} from '../../shared/lazy/recently-all-news/recently-all-news.component';
import {Notices} from '../../interfaces/common/notices.interface';
import {Review} from '../../interfaces/common/review.interface';
import {ReviewService} from '../../services/common/review.service';
import {NoticesService} from '../../services/common/notices.service';
import {FilterData} from '../../interfaces/core/filter-data';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RecentlyAllNewsModule} from '../../shared/lazy/recently-all-news/recently-all-news.module';

@Component({
  selector: 'app-all-notice',
  templateUrl: './all-notice.component.html',
  imports: [
    RouterLink,
    RecentlyAllNewsComponent,
    DatePipe,
    TranslatePipe,
    RecentlyAllNewsModule
  ],
  standalone: true,
  styleUrls: ['./all-notice.component.scss'],
  host: {
    'ngSkipHydration': 'true'
  }
})
export class AllNoticeComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly reviewService = inject(ReviewService);
  private readonly noticesService = inject(NoticesService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly canonicalService = inject(CanonicalService);
  private readonly seoPageService = inject(SeoPageService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly seoPage = signal<SeoPage | null>(null);
  readonly language = signal<string | null>(null);
  readonly review = signal<Review[]>([]);
  readonly notices = signal<Notices[]>([]);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly currentLang = signal<string>('en'); // Local signal for reactive language tracking

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.currentLang());
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  ngOnInit(): void {
    // Initialize language from translateService
    this.currentLang.set(this.translateService.currentLang || 'en');

    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        const lang = qParam.get('language');
        this.language.set(lang);
        if (lang === 'bn') {
          this.currentLang.set('bn');
        } else if (lang === 'en') {
          this.currentLang.set('en');
        }
      });

    // Subscribe to translate service for language changes
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(langChange => {
        this.currentLang.set(langChange.lang);
      });

    // Seo
    this.getSeoPageByPageWithCache();

    // this.getAllOurReviews();
    this.getAllNotices();
  }

  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllOurReviews()
   */

  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('notice', select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.seoPage.set(res);
          if (this.seoPage()) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: err => {
          // console.log(err);
        }
      });
  }

  private getAllOurReviews() {
    // Select
    const mSelect = {
      image: 1,
      name: 1,
      nameEn: 1,
      // shortDescription: 1,
      description: 1,
      descriptionEn: 1,
      _id: 1,
      createdAt: 1
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 }
    };

    this.reviewService.getAllReviews(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.success) {
            this.review.set(res.data);
          }
        },
        error: error => {
          // console.log(error);
        }
      });
  }



  // private getAllNoticess() {
  //
  //   // this.spinnerService.show();
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: {
  //       name: 1,
  //       // description:1,
  //       nameEn: 1,
  //       // descriptionEn:1,
  //       // shortDescription:1,
  //       // shortDescriptionEn:1,
  //       // image:1,
  //       createdAt:1
  //     },
  //     sort: {
  //       createdAt: -1
  //     }
  //   }
  //
  //   this.subDataOne = this.noticesService.getAllNoticess(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         // this.isLoading = false;
  //         // this.spinnerService.hide();
  //         this.notices = res.data;
  //       },
  //       error: (err) => {
  //         // this.isLoading = false;
  //         // this.spinnerService.hide();
  //         // console.log(err)
  //       }
  //     })
  // }

  private getAllNotices(): void {
    this.noticesService.getAllNotices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.notices.set(res.data);
        },
        error: err => {
          console.error(err);
        }
      });
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'en');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(this.isChangeLanguageToggle());
    } else {
      this.isChangeLanguageToggle.set('bn');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }



  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData() {
    const seoData = this.seoPage();
    if (!seoData) return;

    // Title
    this.title.setTitle(seoData.name || 'Default Title');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoData.seoDescription || 'Default Description'});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || 'Default Keywords'});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoData.name || 'Default Title'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoData.image || 'Default Image'});
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({property: 'og:description', content: seoData.seoDescription || 'Default Description'});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoData.name || 'Default Title'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoData.seoDescription || 'Default Description'});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoData.image || 'Default Image'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const seoData = this.seoPage();
    if (!seoData) return;

    // Title
    this.title.setTitle(seoData.nameEn || 'Default Title');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoData.seoDescription || 'Default Description'});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || 'Default Keywords'});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoData.nameEn || 'Default Title'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoData.image || 'Default Image'});
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({property: 'og:description', content: seoData.seoDescription || 'Default Description'});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoData.nameEn || 'Default Title'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoData.seoDescription || 'Default Description'});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoData.image || 'Default Image'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

}
