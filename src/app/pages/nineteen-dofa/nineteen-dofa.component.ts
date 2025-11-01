import {Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdditionalPageService} from '../../services/core/additional-page.service';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';
import {NineteenPoints} from '../../interfaces/common/nineteen-points.interface';
import {NineteenPointsService} from '../../services/common/nineteen-points.service';
import {CanonicalService} from '../../services/common/canonical.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-nineteen-dofa',
  templateUrl: './nineteen-dofa.component.html',
  imports: [],
  styleUrls: ['./nineteen-dofa.component.scss']})
export class NineteenDofaComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  slug = signal<any>(null);
  pageInfo = signal<any>('');
  msg = signal<string>('');
  isLoading = signal<boolean>(true);
  language = signal<string>('en');
  nineteenPoints = signal<NineteenPoints[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('bn');

  // Computed signals for derived state
  hasNineteenPoints = computed(() => this.nineteenPoints().length > 0);
  firstNineteenPoint = computed(() => this.nineteenPoints()[0] || null);
  isLanguageBengali = computed(() => this.language() === 'bn');
  showContent = computed(() => !this.isLoading() && this.hasNineteenPoints());

  // Subscriptions
  private subRouteOne!: Subscription;
  private subDataThree!: Subscription;
  private subDataOne!: Subscription;

  // Services injected using inject() function for Angular 20
  private activatedRoute = inject(ActivatedRoute);
  private additionalPageService = inject(AdditionalPageService);
  private spinnerService = inject(NgxSpinnerService);
  public translateService = inject(TranslateService);
  private nineteenPointsService = inject(NineteenPointsService);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private canonicalService = inject(CanonicalService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Subscribe to query parameters
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qPram => {
      this.language.set(qPram.get('language') || 'en');
    });

    // Subscribe to route parameters
    this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(param => {
      this.slug.set(param.get('pageSlug'));
      this.getAllNineteenPointss();
    });
  }

  /**
   * HTTP REQ HANDLE
   * getPageInfo()
   */

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

  // getAllNineteenPointss() {
  //
  //   this.spinnerService.show();
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: {
  //       name: 1,
  //       description: 1,
  //       nameEn: 1,
  //       descriptionEn: 1,
  //       websiteUrl: 1,
  //       slug: 1,
  //       informations: 1,
  //       image: 1,
  //       seoImage: 1,
  //       createdAt: 1,
  //       nineteenPointsCategory: 1
  //     },
  //     sort: {
  //       createdAt: -1
  //     }
  //   }
  //
  //   this.subDataOne = this.nineteenPointsService.getAllNineteenPointss(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         this.nineteenPoints = res.data;
  //         if (this.nineteenPoints) {
  //           if (this.language === 'bn') {
  //             this.updateMetaDataBn();
  //           }
  //         else {
  //             this.updateMetaData();
  //           }
  //         }
  //
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         // console.log(err)
  //       }
  //     })
  // }

  private getAllNineteenPointss(): void {
    this.nineteenPointsService.getAllNineTeenPoints()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.nineteenPoints.set(res.data);
          this.isLoading.set(false);

          if (this.hasNineteenPoints()) {
            if (this.isLanguageBengali()) {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: err => {
          console.error('Error fetching nineteen points:', err);
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
    const firstPoint = this.firstNineteenPoint();
    if (!firstPoint) return;

    // Title
    this.title.setTitle(firstPoint.name || '');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: firstPoint.description || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstPoint.name || ''});
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstPoint.seoImage || ''});
    this.meta.updateTag({ property: 'og:description', content: firstPoint.description || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstPoint.name || ''});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstPoint.seoImage || ''});
    this.meta.updateTag({name: 'twitter:description', content: firstPoint.description || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstPoint.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn(): void {
    const firstPoint = this.firstNineteenPoint();
    if (!firstPoint) return;

    // Title
    this.title.setTitle(firstPoint.nameEn || '');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: firstPoint.descriptionEn || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstPoint.nameEn || ''});
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstPoint.seoImage || ''});
    this.meta.updateTag({ property: 'og:description', content: firstPoint.descriptionEn || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstPoint.nameEn || ''});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstPoint.seoImage || ''});
    this.meta.updateTag({name: 'twitter:description', content: firstPoint.descriptionEn || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstPoint.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }
  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }
}
