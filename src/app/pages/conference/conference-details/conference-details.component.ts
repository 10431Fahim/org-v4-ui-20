import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {Subscription} from "rxjs";
import {DomSanitizer, Meta, SafeResourceUrl, Title} from "@angular/platform-browser";
import {Conference} from "../../../interfaces/common/conference.interface";
import {ConferenceService} from "../../../services/common/conference.service";
import {TranslateService} from "@ngx-translate/core";
import {Pagination} from "../../../interfaces/core/pagination";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {CanonicalService} from '../../../services/common/canonical.service';
import {SocialShareComponent} from '../../../shared/components/ui/social-share/social-share.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-conference-details',
  templateUrl: './conference-details.component.html',
  imports: [
    SafeHtmlCustomPipe,
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./conference-details.component.scss']
})
export class ConferenceDetailsComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly conferenceService = inject(ConferenceService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly translateService = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly canonicalService = inject(CanonicalService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly id = signal<string | null>(null);
  readonly sub = signal<string | null>(null);
  readonly language = signal<string | null>(null);
  readonly isLoadMore = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly currentPage = signal<number>(1);
  readonly totalProducts = signal<number>(0);
  readonly productsPerPage = signal<number>(6);
  readonly totalProductsStore = signal<number>(0);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly safeURL = signal<SafeResourceUrl | null>(null);
  readonly conference = signal<Conference[]>([]);
  readonly conferenceData = signal<Conference | null>(null);

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.translateService.currentLang);
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        this.activatedRoute.queryParamMap
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(qParam => {
            this.sub.set(qParam.get('sub'));
            this.language.set(qParam.get('language'));
            this.id.set(param.get('id'));
            const currentId = this.id();
            if (currentId) {
              this.getConferenceById(currentId);
            }
          });
      });
    this.getAllConference();
  }


  getConferenceById(id: string) {
    this.conferenceService.getConferenceById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.conferenceData.set(res.data);
          const currentConferenceData = this.conferenceData();
          if (currentConferenceData) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: error => {
          console.error(error);
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
      description: 1,
      descriptionEn: 1,
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
          this.isLoading.set(false);
          console.error(error);
        }
      });
  }

  getSafeUrl(url: any) {
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



/**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData() {
    const currentConferenceData = this.conferenceData();
    if (!currentConferenceData) return;

    const name = currentConferenceData.title || 'BNPBD.ORG';
    const description = currentConferenceData.title || 'BNPBD.ORG';
    const seoImage = currentConferenceData.seoImage || '';

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
    const currentConferenceData = this.conferenceData();
    if (!currentConferenceData) return;

    const name = currentConferenceData.titleEn || 'BNPBD.ORG';
    const description = currentConferenceData.titleEn || 'BNPBD.ORG';
    const seoImage = currentConferenceData.seoImage || '';

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

  // /**
  //  * SEO DATA UPDATE
  //  * updateMetaData()
  //  */
  // private updateMetaData() {
  //   // Title
  //   this.title.setTitle(this.conferenceData?.title);

  //   // Meta
  //   this.meta.updateTag({name: 'robots', content: 'index, follow'});
  //   this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
  //   this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
  //   this.meta.updateTag({name: 'author', content: 'BNP BD'});
  //   this.meta.updateTag({ name: 'keywords', content: 'news' });
  //   // this.meta.updateTag({name: 'description', content: this.conferenceData?.description});
  //   // Facebook
  //   this.meta.updateTag({ property: 'og:title', content: this.conferenceData?.title });
  //   this.meta.updateTag({ property: 'og:type', content: 'website' });
  //   this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
  //   this.meta.updateTag({ property: 'og:image:width', content: '300' });
  //   this.meta.updateTag({ property: 'og:image:height', content: '300' });
  //   this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
  //   this.meta.updateTag({ property: 'og:image', content: this.conferenceData?.seoImage });
  //   // this.meta.updateTag({ property: 'og:description', content: this.conferenceData?.description});
  //   this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
  //   this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
  //   // Twitter
  //   this.meta.updateTag({ name: 'twitter:title', content: this.conferenceData?.title });
  //   this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
  //   this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:image', content: this.conferenceData?.seoImage });
  //   // this.meta.updateTag({ name: 'twitter:description', content: this.conferenceData?.description});
  //   // Microsoft
  //   this.meta.updateTag({name: 'msapplication-TileImage', content: this.conferenceData?.seoImage});

  //   // Canonical
  //   this.canonicalService.setCanonicalURL();

  // }
  // private updateMetaDataBn() {
  //   // Title
  //   this.title.setTitle(this.conferenceData?.titleEn);

  //   // Meta
  //   this.meta.updateTag({name: 'robots', content: 'index, follow'});
  //   this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
  //   this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
  //   this.meta.updateTag({name: 'author', content: 'BNP BD'});
  //   this.meta.updateTag({ name: 'keywords', content: 'news' });
  //   // this.meta.updateTag({name: 'description', content: this.conferenceData?.descriptionEn});
  //   // Facebook
  //   this.meta.updateTag({ property: 'og:title', content: this.conferenceData?.titleEn });
  //   this.meta.updateTag({ property: 'og:type', content: 'website' });
  //   this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
  //   this.meta.updateTag({ property: 'og:image:width', content: '300' });
  //   this.meta.updateTag({ property: 'og:image:height', content: '300' });
  //   this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
  //   this.meta.updateTag({ property: 'og:image', content: this.conferenceData?.seoImage });
  //   // this.meta.updateTag({ property: 'og:description', content: this.conferenceData?.descriptionEn});
  //   this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
  //   this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
  //   // Twitter
  //   this.meta.updateTag({ name: 'twitter:title', content: this.conferenceData?.titleEn });
  //   this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
  //   this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
  //   this.meta.updateTag({ name: 'twitter:image', content: this.conferenceData?.seoImage });
  //   // this.meta.updateTag({ name: 'twitter:description', content: this.conferenceData?.descriptionEn});
  //   // Microsoft
  //   this.meta.updateTag({name: 'msapplication-TileImage', content: this.conferenceData?.seoImage});

  //   // Canonical
  //   this.canonicalService.setCanonicalURL();

  // }

  openDialog() {
    const currentConferenceData = this.conferenceData();
    if (currentConferenceData) {
      this.dialog.open(SocialShareComponent, {
        data: currentConferenceData,
        maxWidth: "480px",
        width: "100%",
        height: "auto",
        panelClass: ['social-share', 'social-dialog']
      });
    }
  }


}
