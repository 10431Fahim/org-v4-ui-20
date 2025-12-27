import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {Subscription} from "rxjs";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Standing} from "../../interfaces/common/standing.interface";
import {StandingService} from "../../services/common/standing.service";
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../services/common/canonical.service";
import {SeoPageService} from "../../services/common/seo-page.service";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-jatio-sthai-comitte',
  templateUrl: './jatio-sthai-comitte.component.html',
  imports: [
    TranslatePipe
  ],
  standalone:true,
  styleUrls: ['./jatio-sthai-comitte.component.scss']})
export class JatioSthaiComitteComponent implements OnInit, OnDestroy {


  // Angular 20 Signals for reactive state management
  seoPage = signal<SeoPage | null>(null);
  language = signal<string>('en');
  isLoading = signal<boolean>(true);
  standing = signal<Standing[]>([]);
  standingLast = signal<Standing[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasStanding = computed(() => this.standing().length > 0);
  firstTwoStanding = computed(() => this.standing().slice(0, 2));
  remainingStanding = computed(() => this.standing().slice(2));
  isLanguageBengali = computed(() => this.language() === 'bn');
  showContent = computed(() => !this.isLoading() && this.hasStanding());

  // Constants
  defaultImage = '/assets/images/logo/User-Profile-PNG-Image.png';

  // Subscriptions
  private subDataOne!: Subscription;

  // Services injected using inject() function for Angular 20
  private standingService = inject(StandingService);
  public translateService = inject(TranslateService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
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
    this.getAllStanding();
  }

  onChangeLanguage(language: string): void {
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string): void {
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
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllStanding()
   */


  private getSeoPageByPageWithCache(): void {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('jatio-sthai-committee', select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.seoPage.set(res);

          if (this.seoPage()) {
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



  // private getAllStanding() {
  //   // Select
  //   const mSelect = {
  //     image: 1,
  //     serial: 1,
  //     serialEn: 1,
  //     title: 1,
  //     description: 1,
  //     titleEn: 1,
  //     descriptionEn: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: 1 }
  //   }
  //
  //   this.subDataOne = this.standingService.getAllStandings(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.standing = res.data;
  //           const mData =  [...this.standing];
  //           mData.splice(0, 2);
  //           this.standingLast =  mData;
  //
  //         }
  //       },
  //       error: error => {
  //         // console.log(error);
  //       }
  //     });
  // }

  private getAllStanding(): void {
    this.standingService.getAllStanding()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.standing.set(res.data);
          this.isLoading.set(false);

          // Update remaining standing data
          const mData = [...this.standing()];
          mData.splice(0, 2);
          this.standingLast.set(mData);
        },
        error: err => {
          console.error('Error fetching standing data:', err);
          this.isLoading.set(false);
        }
      });
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
