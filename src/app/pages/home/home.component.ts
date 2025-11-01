import {Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, inject, signal, computed, effect} from '@angular/core';
import {ChangeDetectionService} from '../../services/core/change-detection.service';
// import Swiper core and required modules
// @ts-ignore
import SwiperCore, {A11y, Autoplay, EffectFade, FreeMode, Navigation, Scrollbar} from 'swiper';
import {Meta, SafeResourceUrl, Title} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DATABASE_KEY} from "../../core/utils/global-variable";
import {PopupService} from "../../services/common/popup.service";
import {PopupComponent} from './popup/popup.component';
import {MatDialog} from "@angular/material/dialog";
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {SeoPageService} from "../../services/common/seo-page.service";
import {isPlatformBrowser, isPlatformServer} from "@angular/common";
import {MainBannerComponent} from './main-banner/main-banner.component';
import {LazyLoadComponentDirective} from '../../shared/directives/lazy-load-component/lazy-load-component.directive';
import {OurLeaderComponent} from './our-leader/our-leader.component';
import {PointsComponent} from './points/points.component';
import {ProgramPressComponent} from './program-press/program-press.component';
import {RecentlyAllNewsComponent} from '../../shared/lazy/recently-all-news/recently-all-news.component';
import {LatestNewsComponent} from './latest-news/latest-news.component';
import {PhotoGallaryComponent} from './photo-gallary/photo-gallary.component';
import {AllVideoComponent} from './all-video/all-video.component';
import {Review} from '../../interfaces/common/review.interface';
import {Showcase} from '../../interfaces/common/showcase.interface';
import {Portfolio} from '../../interfaces/common/portfolio.interface';
import {Tag} from '../../interfaces/common/tag.interface';
import {Photo} from '../../interfaces/common/photo.interface';
import {Popup} from '../../interfaces/common/popup.interface';
import {CanonicalService} from '../../services/common/canonical.service';
import {StorageService} from '../../services/core/storage.service';
// install Swiper modules
SwiperCore.use([Navigation, Scrollbar, A11y, EffectFade, Autoplay, FreeMode]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    MainBannerComponent,
    LazyLoadComponentDirective,
    OurLeaderComponent,
    PointsComponent,
    ProgramPressComponent,
    RecentlyAllNewsComponent,
    LatestNewsComponent,
    PhotoGallaryComponent,
    AllVideoComponent,
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('section2') section2!:ElementRef;
  // Angular 20 Signals for reactive state management
  showLazyComponent = signal<string[]>([]);
  seoPage = signal<SeoPage | null>(null);
  isLoadMore = signal(false);

  // Pagination signals
  currentPage = signal(1);
  totalProducts = signal(0);
  productsPerPage = signal(6);
  totalProductsStore = signal(0);


  // Store Data
  id?: string;
  sub: | any;
  review1?: Review;
  // Store Data
  safeURL: SafeResourceUrl | any;

// Check Browser
  isBrowser: boolean;
  isServer: boolean;

  // Subscriptions
  private subDataOne!: Subscription;
  private subDataTwo!: Subscription;
  private subDataTwelve!: Subscription;

  // Additional signals for reactive state
  isLoading = signal(true);
  language = signal<string | null>(null);
  isChangeLanguage = signal(false);
  isChangeLanguageToggle = signal('en');

  // Data signals
  showcase = signal<Showcase[]>([]);
  portfolio = signal<Portfolio[]>([]);
  review = signal<Review[]>([]);
  tag = signal<Tag[]>([]);
  photo = signal<Photo[]>([]);
  popup = signal<Popup | null>(null);

  // Computed signals
  totalPages = computed(() => Math.ceil(this.totalProducts() / this.productsPerPage()));
  hasMorePages = computed(() => this.currentPage() < this.totalPages());
  isLanguageBengali = computed(() => this.language() === 'bn');

  // Subscriptions
  private subscriptions: Subscription[] = [];
  private changeDetectionService = inject(ChangeDetectionService);

  // Effects for side effects
  constructor(
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private canonicalService: CanonicalService,
    public translateService: TranslateService,
    private popupService: PopupService,
    private dialog: MatDialog,
    private storageService: StorageService,
    private seoPageService: SeoPageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);

    // Effect to handle language changes
    effect(() => {
      const lang = this.language();
      if (lang) {
        this.translateService.use(lang);
        this.isChangeLanguage.set(lang === 'bn');
      }
    });

    // Effect to handle SEO page updates
    effect(() => {
      const seoData = this.seoPage();
      if (seoData && this.isBrowser) {
        if (this.isLanguageBengali()) {
          this.updateMetaDataBn();
        } else {
          this.updateMetaData();
        }
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language.set(qPram.get('language'));
    })

    this.isBrowser = isPlatformBrowser(this.platformId);

    // Load first component immediately for better UX
    if (this.isBrowser) {
      this.loadNextComponent('sec1');
    }

    // Seo
    if(this.isBrowser) {
      this.getSeoPageByPageWithCache();
    }

    // Popup Call Based on Session
    const popupData = this.storageService.getDataFromSessionStorage(DATABASE_KEY.popup);
    if (!popupData || !popupData.close) {
      if(this.isBrowser){
        this.getPopup();
      }
    }

  }

  // private getAllPopups() {
  //   const pagination: Pagination = {
  //     pageSize: Number(1),
  //     currentPage: 0
  //   };
  //
  //   // Select
  //   const mSelect = {
  //     image: 1,
  //     url: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: pagination,
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //
  //   this.subDataTwelve = this.popupService.getAllPopups(filterData, null)
  //     .subscribe({
  //       next: (res => {
  //         this.popup = res.data && res.data.length ? res.data[0] : null;
  //
  //         // console.log('videopop',this.popup)
  //         if (this.popup && this.isBrowser) {
  //           this.offerDialog();
  //         }
  //       }),
  //       error: (error => {
  //         console.log(error);
  //       })
  //     });
  // }

  private getPopup() {
    this.subDataTwelve = this.popupService.getPopup().subscribe({
      next: (res) => {
        if (res.success) {
          this.popup.set(res.data);
          if (this.popup()) {
            this.offerDialog();
          }
        }
      },
      error: (err) => {
        console.log(err);
      }});
  }


  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   */

  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName'
    this.subDataOne = this.seoPageService.getSeoPageByPageWithCache('home', select)
      .subscribe({
        next: res => {
          this.seoPage.set(res);
          // Meta data updates are now handled by the effect in constructor
        },
        error: err => {
          // console.log(err);
        }
      })
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string){
     if(this.isChangeLanguageToggle() !== language){
           this.isChangeLanguageToggle.set(language);
           this.isChangeLanguage.set(true);
           this.translateService.use(this.isChangeLanguageToggle());
     }
     else{
      this.isChangeLanguageToggle.set('en');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
     }
  }
  /**
   * ON DESTROY
   */
  offerDialog() {
    this.dialog.open(PopupComponent, {
      data: this.popup(),
      maxWidth: '1030px',
      width: '100%',
      maxHeight: '450px',
      height: '100%',
      panelClass: ['theme-dialog', 'offer-popup-dialog']})
  }

  onScroll(){
     this.section2.nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
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
    this.title.setTitle(seoData.name || 'BNP BD');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoData.seoDescription || ''});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || ''});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoData.name || 'BNP BD'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoData.image || ''});
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
    this.meta.updateTag({property: 'og:description', content: seoData.seoDescription || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoData.name || 'BNP BD'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoData.seoDescription || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoData.image || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const seoData = this.seoPage();
    if (!seoData) return;

    // Title
    this.title.setTitle(seoData.nameEn || 'BNP BD');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoData.seoDescription || ''});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || ''});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoData.nameEn || 'BNP BD'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoData.image || ''});
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
    this.meta.updateTag({property: 'og:description', content: seoData.seoDescription || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoData.nameEn || 'BNP BD'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoData.seoDescription || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoData.image || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  /**
   * ON Lazy Component Load
   */
  loadNextComponent(type: 'sec1' | 'sec2' | 'sec3' | 'sec4' | 'sec5' | 'sec6' | 'sec7') {
    const currentComponents = this.showLazyComponent();
    if (!currentComponents.includes(type)) {
      this.showLazyComponent.set([...currentComponents, type]);
    }
  }

  checkComponentLoad(type: 'sec1' | 'sec2' | 'sec3' | 'sec4' | 'sec5' | 'sec6' | 'sec7'): boolean {
    return this.showLazyComponent().includes(type);
  }



  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

  }

}
