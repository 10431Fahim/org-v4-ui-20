import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {DomSanitizer, Meta, SafeResourceUrl, Title} from '@angular/platform-browser';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CanonicalService} from "../../services/common/canonical.service";
import {SeoPageService} from "../../services/common/seo-page.service";
import {
  PressConferenceLoaderComponent
} from '../../shared/loader/press-conference-loader/press-conference-loader.component';
import {Conference} from '../../interfaces/common/conference.interface';
import {ConferenceService} from '../../services/common/conference.service';
import {Pagination} from '../../interfaces/core/pagination';
import {FilterData} from '../../interfaces/core/filter-data';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  imports: [
    PressConferenceLoaderComponent,
    RouterLink,
    TranslatePipe
  ],
  standalone: true,
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly conferenceService = inject(ConferenceService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly translateService = inject(TranslateService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly canonicalService = inject(CanonicalService);
  private readonly seoPageService = inject(SeoPageService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly isLoadMore = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly isLoading2 = signal<boolean>(true);
  readonly currentPage = signal<number>(1);
  readonly totalProducts = signal<number>(0);
  readonly productsPerPage = signal<number>(8);
  readonly totalProductsStore = signal<number>(0);
  readonly seoPage = signal<SeoPage | null>(null);
  readonly language = signal<string | null>(null);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly conference = signal<Conference[]>([]);

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.translateService.currentLang);
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        this.language.set(qParam.get('language'));
      });
    
    this.getAllConference();
    // Seo
    this.getSeoPageByPageWithCache();
  }
  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllConference()
   */
  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('conference', select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.seoPage.set(res);
          const currentSeoPage = this.seoPage();
          if (currentSeoPage) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  private getAllConference(loadMore?: boolean) {
    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage()),
      currentPage: Number(this.currentPage()) - 1
    };
    
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      title: 1,
      titleEn: 1,
      image: 1,
      _id: 1,
      createdAt: 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    };

    this.conferenceService.getAllConferences(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading2.set(false);
          this.isLoading.set(false);
          this.isLoadMore.set(false);
          
          if (loadMore) {
            this.conference.set([...this.conference(), ...res.data]);
          } else {
            this.conference.set(res.data);
          }
          this.totalProducts.set(res.count);
        },
        error: error => {
          this.isLoading2.set(false);
          this.isLoading.set(false);
          console.error(error);
        }
      });
  }


  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData() {
    const currentSeoPage = this.seoPage();
    if (!currentSeoPage) return;

    // Title
    this.title.setTitle(currentSeoPage.name || 'Default Title');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: currentSeoPage.seoDescription || 'Default Description'});
    this.meta.updateTag({name: 'keywords', content: currentSeoPage.keyWord || 'Default Keywords'});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: currentSeoPage.name || 'Default Title'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: currentSeoPage.image || 'Default Image'});
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({property: 'og:description', content: currentSeoPage.seoDescription || 'Default Description'});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'BNP Bangladesh'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: currentSeoPage.name || 'Default Title'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: currentSeoPage.seoDescription || 'Default Description'});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: currentSeoPage.image || 'Default Image'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const currentSeoPage = this.seoPage();
    if (!currentSeoPage) return;

    // Title
    this.title.setTitle(currentSeoPage.nameEn || 'Default Title');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: currentSeoPage.seoDescription || 'Default Description'});
    this.meta.updateTag({name: 'keywords', content: currentSeoPage.keyWord || 'Default Keywords'});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: currentSeoPage.nameEn || 'Default Title'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: currentSeoPage.image || 'Default Image'});
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({property: 'og:description', content: currentSeoPage.seoDescription || 'Default Description'});
    this.meta.updateTag({property: 'og:locale', content: 'bn_BD'});
    this.meta.updateTag({property: 'og:site_name', content: 'BNP Bangladesh'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: currentSeoPage.nameEn || 'Default Title'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: currentSeoPage.seoDescription || 'Default Description'});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: currentSeoPage.image || 'Default Image'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }


  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  /**
   * LOAD MORE
   */
  onLoadMore() {
    if (this.totalProducts() > this.conference().length) {
      this.isLoadMore.set(true);
      this.currentPage.set(this.currentPage() + 1);
      this.getAllConference(true);
    }
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(this.isChangeLanguageToggle());
    } else {
      this.isChangeLanguageToggle.set('en');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }

}
