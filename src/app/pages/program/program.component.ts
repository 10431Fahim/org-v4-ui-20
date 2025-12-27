import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../services/common/canonical.service";
import {SeoPageService} from "../../services/common/seo-page.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NewsCardOneLoaderComponent} from '../../shared/loader/news-card-one-loader/news-card-one-loader.component';
import {DatePipe} from '@angular/common';
import {OurService} from '../../interfaces/common/our-service.interface';
import {OurServiceService} from '../../services/common/our-service.service';
import {FilterData} from '../../interfaces/core/filter-data';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NewsCardOneLoaderModule} from '../../shared/loader/news-card-one-loader/news-card-one-loader.module';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  imports: [
    NewsCardOneLoaderComponent,
    TranslatePipe,
    RouterLink,
    DatePipe,
    NewsCardOneLoaderModule
  ],
  standalone: true,
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly ourServiceService = inject(OurServiceService);
  private readonly translateService = inject(TranslateService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly canonicalService = inject(CanonicalService);
  private readonly seoPageService = inject(SeoPageService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly seoPage = signal<SeoPage | null>(null);
  readonly language = signal<string | null>(null);
  readonly ourService = signal<OurService[]>([]);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingMore = signal<boolean>(false);
  readonly isLoadMore = signal<boolean>(false);
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(12);
  readonly totalItems = signal<number>(0);

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

    this.getAllOurService();
    this.getSeoPageByPageWithCache();
  }

  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllOurService()
   */
  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('all-program', select)
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

  private getAllOurService(loadMore?: boolean) {
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      image: 1,
      imageEn: 1,
      shortDescription: 1,
      shortDescriptionEn: 1,
      publishedDate: 1,
      authorName: 1,
      authorNameBn: 1,
      createdBy: 1,
      _id: 1,
      slug: 1,
      createdAt: 1
    };

    const pagination = {
      pageSize: this.pageSize(),
      currentPage: this.currentPage() - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    };

    this.isLoadingMore.set(true);
    this.ourServiceService.getAllOurServices(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.isLoadMore.set(false);
          this.isLoadingMore.set(false);

          if (res.success) {
            if (loadMore) {
              this.ourService.set([...this.ourService(), ...res.data]);
            } else {
              this.ourService.set(res.data);
            }
            this.totalItems.set(res.count);
          }
        },
        error: error => {
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
          console.error(error);
        }
      });
  }

  // private getAllOurService(): void {
  //   this.ourServiceService.getAllVision()
  //     .subscribe({
  //       next: res => {
  //         this.ourService = res.data;
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

  onLoadMore() {
    if (this.totalItems() > this.ourService().length) {
      this.isLoadMore.set(true);
      this.currentPage.set(this.currentPage() + 1);
      this.getAllOurService(true);
    }
  }

}
