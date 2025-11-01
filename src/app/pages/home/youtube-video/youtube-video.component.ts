import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ClientService} from "../../../services/common/client.service";
import {Subscription} from "rxjs";
import {Client} from "../../../interfaces/common/client.interface";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Pagination} from "../../../interfaces/core/pagination";
import {SeoPage} from "../../../interfaces/common/seo-page.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../../services/common/canonical.service";
import {SeoPageService} from "../../../services/common/seo-page.service";
import {SafeUrlPipe} from '../../../shared/pipes/safe-url.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  imports: [
    SafeUrlPipe,
    RouterLink,
    TranslatePipe
  ],
  standalone: true,
  styleUrls: ['./youtube-video.component.scss']
})
export class YoutubeVideoComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly clientService = inject(ClientService);
  private readonly translateService = inject(TranslateService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly canonicalService = inject(CanonicalService);
  private readonly seoPageService = inject(SeoPageService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly isLoading = signal<boolean>(true);
  readonly totalVideo = signal<number>(0);
  readonly clientCurrentPage = signal<number>(1);
  readonly clientPageSize = signal<number>(12);
  readonly isLoading1 = signal<boolean>(false);
  readonly isLoadMore = signal<boolean>(false);
  readonly seoPage = signal<SeoPage | null>(null);
  readonly language = signal<string | null>(null);
  readonly client = signal<Client[]>([]);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');

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

    this.getAllClient();
    this.getSeoPageByPageWithCache();
  }

  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllClient()
   */
  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('all-videos', select)
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

  private getAllClient(loadMore?: boolean) {
    const pagination: Pagination = {
      pageSize: Number(this.clientPageSize()),
      currentPage: Number(this.clientCurrentPage()) - 1
    };

    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      title: 1,
      titleEn: 1,
      _id: 1,
      createdAt: 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 }
    };

    this.isLoading1.set(true);
    this.clientService.getAllClients(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.isLoadMore.set(false);
          
          if (loadMore) {
            this.client.set([...this.client(), ...res.data]);
            setTimeout(() => {
              this.isLoading1.set(false);
            }, 2000);
          } else {
            this.client.set(res.data);
          }
          this.totalVideo.set(res.count);
        },
        error: error => {
          this.isLoading.set(false);
          console.error(error);
        }
      });
  }

  // private getAllClient(): void {
  //  this.clientService.getAllClient()
  //     .subscribe({
  //       next: res => {
  //         this.showcase = res.data;
  //         this.isLoading = false;
  //       },
  //       error: err => {
  //         console.error(err);
  //         this.isLoading = false;
  //       }
  //     });
  // }

  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData() {
    const currentSeoPage = this.seoPage();
    if (!currentSeoPage) return;

    const name = currentSeoPage.name || 'BNPBD.ORG';
    const description = currentSeoPage.seoDescription || 'BNPBD.ORG';
    const keywords = currentSeoPage.keyWord || 'BNP';
    const image = currentSeoPage.image || '';

    // Title
    this.title.setTitle(name);

    // Meta Tags
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#00a0db' });
    this.meta.updateTag({ name: 'copyright', content: 'BNP BD' });
    this.meta.updateTag({ name: 'author', content: 'BNP BD' });
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph Tags
    this.meta.updateTag({ property: 'og:title', content: name });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh' });

    // Twitter Tags
    this.meta.updateTag({ name: 'twitter:title', content: name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Microsoft Tile Image
    this.meta.updateTag({ name: 'msapplication-TileImage', content: image });

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const currentSeoPage = this.seoPage();
    if (!currentSeoPage) return;

    const name = currentSeoPage.nameEn || 'BNPBD.ORG';
    const description = currentSeoPage.seoDescription || 'BNPBD.ORG';
    const keywords = currentSeoPage.keyWord || 'BNP';
    const image = currentSeoPage.image || '';

    // Title
    this.title.setTitle(name);

    // Meta Tags
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#00a0db' });
    this.meta.updateTag({ name: 'copyright', content: 'BNP BD' });
    this.meta.updateTag({ name: 'author', content: 'BNP BD' });
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph Tags
    this.meta.updateTag({ property: 'og:title', content: name });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:locale', content: 'bn_BD' });
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh' });

    // Twitter Tags
    this.meta.updateTag({ name: 'twitter:title', content: name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Microsoft Tile Image
    this.meta.updateTag({ name: 'msapplication-TileImage', content: image });

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }


  onLoadMore() {
    if (this.totalVideo() > this.client().length) {
      this.isLoadMore.set(true);
      this.clientCurrentPage.set(this.clientCurrentPage() + 1);
      this.getAllClient(true);
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
