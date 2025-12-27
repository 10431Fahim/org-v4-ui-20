import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {Subscription} from "rxjs";
import {Review} from "../../interfaces/common/review.interface";
import {Reports} from "../../interfaces/common/reports.interface";
import {ReviewService} from "../../services/common/review.service";
import {ReportsService} from "../../services/common/reports.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {FilterData} from "../../interfaces/gallery/filter-data";
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../services/common/canonical.service";
import {SeoPageService} from "../../services/common/seo-page.service";
import {RecentlyAllNewsComponent} from '../../shared/lazy/recently-all-news/recently-all-news.component';
import {DatePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  imports: [
    TranslatePipe,
    RouterLink,
    RecentlyAllNewsComponent,
    DatePipe
  ],
  standalone:true,
  styleUrls: ['./reports.component.scss']})
export class ReportsComponent implements OnInit, OnDestroy {


  // Angular 20 Signals for reactive state management
  seoPage = signal<SeoPage | null>(null);
  language = signal<string>('en');
  review = signal<Review[]>([]);
  reports = signal<Reports[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasReports = computed(() => this.reports().length > 0);
  hasSeoPage = computed(() => this.seoPage() !== null);
  isLanguageBengali = computed(() => this.language() === 'bn');
  showContent = computed(() => this.hasReports());

  // Subscriptions
  private subDataFour!: Subscription;
  private subDataOne!: Subscription;

  // Services injected using inject() function for Angular 20
  private reviewService = inject(ReviewService);
  private reportsService = inject(ReportsService);
  public translateService = inject(TranslateService);
  private activatedRoute = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private canonicalService = inject(CanonicalService);
  private seoPageService = inject(SeoPageService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Subscribe to query parameters
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qPram => {
      this.language.set(qPram.get('language') || 'en');
    });

    // Seo
    this.getSeoPageByPageWithCache();
    this.getAllReports();
  }


  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllOurReviews()
   */

  private getSeoPageByPageWithCache(): void {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('reports', select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.seoPage.set(res);

          if (this.hasSeoPage()) {
            if (this.isLanguageBengali()) {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: err => {
          console.error('Error fetching SEO page data:', err);
        }
      });
  }


  private getAllOurReviews(): void {
    // Select
    const mSelect = {
      image: 1,
      name: 1,
      nameEn: 1,
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
          console.error('Error fetching reviews:', error);
        }
      });
  }


  //
  // private getAllReportss() {
  //
  //   // this.spinnerService.show();
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: {
  //       name: 1,
  //       description:1,
  //       nameEn: 1,
  //       descriptionEn:1,
  //       shortDescription:1,
  //       shortDescriptionEn:1,
  //       image:1,
  //       createdAt:1
  //     },
  //     sort: {
  //       createdAt: -1
  //     }
  //   }
  //
  //   this.subDataOne = this.noticesService.getAllReportss(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         // this.isLoading = false;
  //         // this.spinnerService.hide();
  //         this.reports = res.data;
  //       }
  //         ,
  //       error: (err) => {
  //         // this.isLoading = false;
  //         // this.spinnerService.hide();
  //         // console.log(err)
  //       }
  //     })
  // }

  private getAllReports(): void {
    this.reportsService.getAllReports()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.reports.set(res.data);
        },
        error: err => {
          console.error('Error fetching reports data:', err);
        }
      });
  }


  onChangeLanguage(language: string): void {
    this.isChangeLanguage.set(language === 'en');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string): void {
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

  private updateMetaData(): void {
    const seoPage = this.seoPage();
    if (!seoPage) return;

    // Title
    this.title.setTitle(seoPage.name || '');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoPage.seoDescription || ''});
    this.meta.updateTag({name: 'keywords', content: seoPage.keyWord || ''});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoPage.name || ''});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoPage.image || ''});
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
    this.meta.updateTag({property: 'og:description', content: seoPage.seoDescription || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoPage.name || ''});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoPage.seoDescription || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoPage.image || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn(): void {
    const seoPage = this.seoPage();
    if (!seoPage) return;

    // Title
    this.title.setTitle(seoPage.nameEn || '');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoPage.seoDescription || ''});
    this.meta.updateTag({name: 'keywords', content: seoPage.keyWord || ''});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoPage.nameEn || ''});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoPage.image || ''});
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
    this.meta.updateTag({property: 'og:description', content: seoPage.seoDescription || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoPage.nameEn || ''});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoPage.seoDescription || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoPage.image || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }
}
