import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {UtilsService} from "../../services/core/utils.service";
import {ReloadService} from "../../services/core/reload.service";
import {UiService} from "../../services/core/ui.service";
import {PageFaqService} from "../../services/common/page-faq.service";
import {MatDialog} from '@angular/material/dialog';
import {PageFaq} from "../../interfaces/common/page-faq.interface";
import {Subscription} from "rxjs";
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {CanonicalService} from '../../services/common/canonical.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-premiership-brgum-khalada-zia1',
  templateUrl: './premiership-brgum-khalada-zia1.component.html',
  imports: [],
  host: {ngSkipHydration: 'true'},
  styleUrls: ['./premiership-brgum-khalada-zia1.component.scss']})
export class PremiershipBrgumKhaladaZia1Component implements OnInit, OnDestroy {



  // Angular 20 Signals for reactive state management
  whyJoin = signal<number>(0);
  isFaq = signal<number>(0);
  pageFaq = signal<PageFaq[]>([]);
  isLoading = signal<boolean>(true);
  pageData = signal<any>(null);
  filter = signal<any>(null);
  language = signal<string>('en');
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');
  isShowDivIf = signal<boolean>(false);

  // Computed signals for derived state
  hasPageFaq = computed(() => this.pageFaq().length > 0);
  firstPageFaq = computed(() => this.pageFaq()[0] || null);
  isLanguageBengali = computed(() => this.language() === 'bn');
  showContent = computed(() => !this.isLoading() && this.hasPageFaq());

  // Subscriptions
  private subDataOne!: Subscription;
  private subDataTwo!: Subscription;
  private subDataThree!: Subscription;
  private subDataFour!: Subscription;
  private subReloadOne!: Subscription;
  private subscriptions: Subscription[] = [];

  // Services injected using inject() function for Angular 20
  private dialog = inject(MatDialog);
  private pageFaqService = inject(PageFaqService);
  private uiService = inject(UiService);
  private reloadService = inject(ReloadService);
  private utilsService = inject(UtilsService);
  private spinnerService = inject(NgxSpinnerService);
  public translateService = inject(TranslateService);
  private activatedRoute = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private canonicalService = inject(CanonicalService);
  private destroyRef = inject(DestroyRef);


  onFaqToggle(index: number): void {
    if (index !== this.isFaq()) {
      this.isFaq.set(index);
    } else {
      this.isFaq.set(0);
    }
  }






  ngOnInit(): void {
    // Subscribe to query parameters
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qPram => {
      this.language.set(qPram.get('language') || 'en');
    });

    this.getAllPageFaqs();
  }

  // getAllPageFaqs() {
  //
  //   this.spinnerService.show();
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: {pages: "premiership-of-begum-khaleda-zia-(1991-1996)"},
  //     select: {
  //       name: 1,
  //       description: 1,
  //       nameEn: 1,
  //       descriptionEn: 1,
  //       websiteUrl: 1,
  //       slug: 1,
  //       informations: 1,
  //       pages: 1,
  //       image: 1,
  //       seoImage: 1,
  //       createdAt: 1,
  //       pageFaqCategory: 1,
  //       briefTimelineImg: 1,
  //       title: 1,
  //       subTitle: 1,
  //       shortDescription: 1,
  //       titleEn: 1,
  //       subTitleEn: 1,
  //       shortDescriptionEn: 1,
  //     },
  //     sort: {
  //       createdAt: -1
  //     }
  //   }
  //
  //   this.subDataOne = this.pageFaqService.getAllPageFaqs(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         this.pageFaq = res.data;
  //
  //
  //         if (this.pageFaq) {
  //           if (this.language === 'bn') {
  //             this.updateMetaDataBn();
  //           }
  //         else {
  //             this.updateMetaData();
  //           }
  //         }
  //
  //         //
  //         // this.pageFaq = this.pageData?.filter(m =>m?.pages==="presidency-of-ziaur-rahman-(1977-1981)")
  //
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         console.log(err)
  //       }
  //     })
  // }

  private getAllPageFaqs(): void {
    const subscription = this.pageFaqService
      .getAllPageFaqByUi({pages: "premiership-of-begum-khaleda-zia-(1991-1996)"}, 1, 20)
      .subscribe({
        next: (res) => {
          this.pageFaq.set(res.data);
          this.isLoading.set(false);

          if (this.hasPageFaq()) {
            if (this.isLanguageBengali()) {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: (err) => {
          console.error('Error fetching page FAQ data:', err);
          this.isLoading.set(false);
        }
      });
    this.subscriptions?.push(subscription);
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
    const firstPageFaq = this.firstPageFaq();
    if (!firstPageFaq) return;

    // Title
    this.title.setTitle(firstPageFaq.name || '');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: firstPageFaq.description || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstPageFaq.name || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstPageFaq.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: firstPageFaq.description || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstPageFaq.name || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstPageFaq.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: firstPageFaq.description || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstPageFaq.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn(): void {
    const firstPageFaq = this.firstPageFaq();
    if (!firstPageFaq) return;

    // Title
    this.title.setTitle(firstPageFaq.nameEn || '');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: firstPageFaq.descriptionEn || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstPageFaq.nameEn || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstPageFaq.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: firstPageFaq.descriptionEn || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstPageFaq.nameEn || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstPageFaq.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: firstPageFaq.descriptionEn || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstPageFaq.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(s => {
        if (s) {
          s.unsubscribe();
        }
      });
    }
  }
}
