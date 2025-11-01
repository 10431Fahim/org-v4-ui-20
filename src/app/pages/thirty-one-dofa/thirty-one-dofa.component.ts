import {Component, computed, DestroyRef, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdditionalPageService} from "../../services/core/additional-page.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {ThirtyOnePointsService} from "../../services/common/thirtyOne-points.service";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../services/common/canonical.service";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ThirtyOnePoints} from '../../interfaces/common/thirtyOne-points.interface';
import {SafeHtmlCustomPipe} from '../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-thirty-one-dofa',
  standalone: true,
  templateUrl: './thirty-one-dofa.component.html',
  imports: [SafeHtmlCustomPipe],
  styleUrls: ['./thirty-one-dofa.component.scss']
})
export class ThirtyOneDofaComponent implements OnInit, OnDestroy {

  // Angular 20: Modern Dependency Injection using inject()
  private activatedRoute = inject(ActivatedRoute);
  private additionalPageService = inject(AdditionalPageService);
  private spinnerService = inject(NgxSpinnerService);
  public translateService = inject(TranslateService);
  private thirtyOnePointsService = inject(ThirtyOnePointsService);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private canonicalService = inject(CanonicalService);
  private destroyRef = inject(DestroyRef);

  // Angular 20: Signals for reactive state management
  slug = signal<string | null>(null);
  language = signal<string>('en');
  isLoading = signal<boolean>(true);
  msg = signal<string>('');

  thirtyOnePoints = signal<ThirtyOnePoints[]>([]);

  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Angular 20: Computed signals for derived state
  currentLanguage = computed(() => this.language());
  currentPoints = computed(() => this.thirtyOnePoints());
  firstPoint = computed((): ThirtyOnePoints | undefined => this.thirtyOnePoints()[0]);
  currentTitle = computed(() => {
    const point = this.firstPoint();
    if (!point) return '';
    return this.language() === 'bn' ? point.nameEn : point.name;
  });
  currentDescription = computed(() => {
    const point = this.firstPoint();
    if (!point) return '';
    return this.language() === 'bn' ? point.descriptionEn : point.description;
  });

  constructor() {
    // Angular 20: Effect for side effects based on thirtyOnePoints signal
    effect(() => {
      const points = this.thirtyOnePoints();
      const lang = this.language();

      if (points && points.length > 0) {
        if (lang === 'bn') {
          this.updateMetaDataBn();
        } else {
          this.updateMetaData();
        }
      }
    });
  }

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qPram => {
        const lang = qPram.get('language');
        if (lang) {
          this.language.set(lang);
        }
      });

    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(param => {
        const slug = param.get('pageSlug');
        if (slug) {
          this.slug.set(slug);
        }
      });

    // Load data on component initialization
    this.getAllThirtyOnePointss();
  }

  /**
   * HTTP REQ HANDLE
   * getAllThirtyOnePointss()
   */
  private getAllThirtyOnePointss(): void {
    this.thirtyOnePointsService.getAllThirtyOn()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.thirtyOnePoints.set(res.data);
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
          this.msg.set('Failed to load thirty-one points data');
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
    }
    else {
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
    const firstPoint = this.firstPoint();
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
    this.meta.updateTag({ property: 'og:title', content: firstPoint.name || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstPoint.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: firstPoint.description || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstPoint.name || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstPoint.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: firstPoint.description || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstPoint.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const firstPoint = this.firstPoint();
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
    this.meta.updateTag({ property: 'og:title', content: firstPoint.nameEn || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstPoint.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: firstPoint.descriptionEn || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstPoint.nameEn || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstPoint.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: firstPoint.descriptionEn || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstPoint.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  /**
   * NG ON DESTROY
   * Angular 20: Automatic cleanup with takeUntilDestroyed
   * No manual unsubscribe needed!
   */
  ngOnDestroy() {
    // Angular 20: takeUntilDestroyed automatically handles cleanup
    // No manual subscription management required
  }
}
