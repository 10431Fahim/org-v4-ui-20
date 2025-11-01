import {Component, computed, DestroyRef, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AdditionalPageService} from '../../services/core/additional-page.service';
import {Subscription} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';
import {CanonicalService} from '../../services/common/canonical.service';
import {FormsModule} from '@angular/forms';
import {SafeHtmlCustomPipe} from '../../shared/pipes/safe-html.pipe';
import {ReloadService} from '../../services/core/reload.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-extra-page-view',
  templateUrl: './additional-page-view.component.html',
  styleUrls: ['./additional-page-view.component.scss'],
  imports: [
    FormsModule,
    SafeHtmlCustomPipe,
    RouterLink,
    TranslatePipe
  ]
})
export class AdditionalPageViewComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  slug = signal<string>('');
  pageInfo = signal<any>(null);
  msg = signal<string>('');
  language = signal<string>('en');
  searchQuery = signal<string>('');
  isFound = signal<boolean | null>(null);
  highlightedContent = signal<string>('');
  highlightedContentBn = signal<string>('');
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');
  private isInitialized = signal<boolean>(false);

  // Computed signals for derived state
  hasPageInfo = computed(() => this.pageInfo() !== null);
  isLanguageBengali = computed(() => this.language() === 'bn');
  showContent = computed(() => this.hasPageInfo() && !this.showComingSoon());
  showComingSoon = computed(() => !this.hasPageInfo() || this.msg().includes('Coming Soon'));
  currentDescription = computed(() => {
    const pageInfo = this.pageInfo();
    if (!pageInfo) return '';
    return this.isLanguageBengali()
      ? pageInfo.descriptionEn || ''
      : pageInfo.description || '';
  });

  // Subscriptions
  private subRouteOne!: Subscription;
  private subDataOne!: Subscription;
  private subReloadLang!: Subscription;

  // Services injected using inject() function for Angular 20
  private activatedRoute = inject(ActivatedRoute);
  private additionalPageService = inject(AdditionalPageService);
  public translateService = inject(TranslateService);
  public reloadService = inject(ReloadService);
  public router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private canonicalService = inject(CanonicalService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Effect to handle language changes - only after initialization
    effect(() => {
      const lang = this.language();
      const initialized = this.isInitialized();
      if (lang && initialized) {
        this.translateService.use(lang);
        this.isChangeLanguage.set(lang === 'bn');
      }
    });
  }

  ngOnInit(): void {
    // Initialize language synchronously from query params or translateService
    const queryLang = this.activatedRoute.snapshot.queryParamMap.get('language');
    const currentLang = this.translateService.currentLang;
    this.language.set(queryLang || currentLang || 'en');
    // Mark as initialized so effect can run
    this.isInitialized.set(true);

    // Subscribe to translate service language changes
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(langChange => {
        // Only update if not coming from query params to avoid conflicts
        const queryParamLang = this.activatedRoute.snapshot.queryParamMap.get('language');
        if (!queryParamLang) {
          this.language.set(langChange.lang);
        }
      });
    // Subscribe to route parameters
    this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((param) => {
      this.slug.set(param.get('pageSlug') || '');
      this.pageInfo.set(null);
      this.msg.set(''); // Reset the message when navigating to a new page
      this.highlightedContent.set('');
      this.searchQuery.set(''); // Reset search query
      this.isFound.set(null); // Reset search results
      this.getPageInfo();
    });

    // Subscribe to query parameters
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qPram => {
      const lang = qPram.get('language') || this.translateService.currentLang || 'en';
      this.language.set(lang);
    });
  }

  searchText(): void {
    const query = this.searchQuery().trim();
    if (!query) {
      this.isFound.set(null);
      this.highlightedContent.set(this.currentDescription());
      return;
    }

    const regex = new RegExp(query, 'gi');
    const originalText = this.currentDescription();
    this.isFound.set(regex.test(originalText));

    // Highlight the searched text
    this.highlightedContent.set(
      originalText.replace(regex, (match: string) =>
        `<span style="background-color: yellow; font-weight: bold;">${match}</span>`
      )
    );
  }

  getDescription(): string {
    return this.currentDescription();
  }


  /**
   * HTTP REQ HANDLE
   * getPageInfo()
   */

  private getPageInfo(): void {
    this.additionalPageService
      .getAdditionalPageBySlug(this.slug())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.pageInfo.set(res.data);

          if (this.hasPageInfo()) {
            // Clear any previous "Coming Soon" message when data is available
            this.msg.set('');
            if (this.isLanguageBengali()) {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          } else {
            // Only set "Coming Soon" message when there's no data
            this.msg.set('<h2>Coming Soon!</h2>');
          }
        },
        error: (error) => {
          console.error('Error fetching page info:', error);
          this.msg.set('<h2>Coming Soon!</h2>');
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



  // onChangeLanguageEN() {

  //   console.log('hi ElllllN' );
  // }
  // onChangeLanguageBN() {
  //   console.log('hi BN' );
  // }




  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData(): void {
    const pageInfo = this.pageInfo();
    if (!pageInfo) return;

    // Title
    this.title.setTitle(pageInfo.name || '');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: pageInfo.description || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: pageInfo.name || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: pageInfo.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: pageInfo.description || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: pageInfo.name || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: pageInfo.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: pageInfo.description || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: pageInfo.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn(): void {
    const pageInfo = this.pageInfo();
    if (!pageInfo) return;

    // Title
    this.title.setTitle(pageInfo.nameEn || '');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: pageInfo.descriptionEn || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: pageInfo.nameEn || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: pageInfo.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: pageInfo.descriptionEn || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: pageInfo.nameEn || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: pageInfo.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: pageInfo.descriptionEn || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: pageInfo.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }
}
