import {Component, computed, effect, inject, signal, DestroyRef, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule, NgForm} from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, EMPTY, pluck, switchMap } from 'rxjs';
import {SlicePipe} from '@angular/common';
import {Executive} from '../../interfaces/common/executive.interface';
import {SeoPage} from '../../interfaces/common/seo-page.interface';
import {ExecutiveService} from '../../services/common/executive.service';
import {CanonicalService} from '../../services/common/canonical.service';
import {SeoPageService} from '../../services/common/seo-page.service';
import {FilterData} from '../../interfaces/core/filter-data';

@Component({
  selector: 'app-executive-committe',
  templateUrl: './executive-committe.component.html',
  imports: [
    TranslatePipe,
    FormsModule,
    SlicePipe
  ],
  styleUrls: ['./executive-committe.component.scss']})
export class ExecutiveCommitteComponent {


  // Angular 20 Signals for reactive state management
  seoPage = signal<SeoPage | null>(null);
  language = signal<string>('en');
  isLoading = signal<boolean>(true);
  executive = signal<Executive[]>([]);
  executiveLast = signal<Executive[]>([]);
  searchExecutive = signal<Executive[]>([]);
  holdPrevData = signal<Executive[]>([]);
  searchQuery = signal<string | null>(null);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasExecutives = computed(() => this.executive().length > 0);
  hasSearchResults = computed(() => this.searchExecutive().length > 0);
  isSearching = computed(() => this.searchQuery() !== null && this.searchQuery() !== '');
  isBengaliLanguage = computed(() => this.language() === 'bn');

  // Search Area
  @ViewChild('searchForm') searchForm!: NgForm;
  filter: any = null;
  defaultImage = '/assets/images/logo/User-Profile-PNG-Image.png';

  // Inject services using Angular 20 inject function
  private executiveService = inject(ExecutiveService);
  public translateService = inject(TranslateService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);
  private canonicalService = inject(CanonicalService);
  private seoPageService = inject(SeoPageService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Effect to automatically update meta data when seo page data changes
    effect(() => {
      const seoData = this.seoPage();
      const lang = this.language();

      if (seoData) {
        // Use setTimeout to prevent immediate re-rendering
        setTimeout(() => {
          if (lang === 'bn') {
            this.updateMetaDataBn();
          } else {
            this.updateMetaData();
          }
        }, 0);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    // Handle route parameters with debouncing to prevent multiple updates
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qParam => {
      const newLanguage = qParam.get('language') || 'en';
      // Only update if language actually changed
      if (this.language() !== newLanguage) {
        this.language.set(newLanguage);
      }
    });

    // Load SEO page and executive data
    this.getSeoPageByPageWithCache();
    this.getAllStanding();
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'bn');
    this.language.set(language);
    this.translateService.use(language);
    
    // Update URL with language parameter
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { language: language },
      queryParamsHandling: 'merge'
    });
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
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllStanding()
   */
  ngAfterViewInit(): void {
    const formValue: any = this.searchForm.valueChanges;

    formValue
      .pipe(
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data: string) => {
          this.searchQuery.set(data);
          if (this.searchQuery() === '' || this.searchQuery() === null) {
            this.searchExecutive.set([]);
            this.executive.set(this.holdPrevData());
            this.searchQuery.set(null);
            return EMPTY;
          }

          // Select
          const mSelect = {
            name: 1,
            nameBn: 1,
            image: 1,
            designation: 1,
            designationBn: 1,
            seoDescription: 1,
            pageName: 1,
            createdAt: 1,
            executiveType: 1,
            url: 1
          };

          const filterData: FilterData = {
            pagination: null,
            filter: this.filter,
            select: mSelect,
            sort: {createdAt: -1}
          };

          return this.executiveService.getAllExecutives(filterData, this.searchQuery());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: any) => {
          this.searchExecutive.set(res.data);
          this.executive.set(this.searchExecutive());
        },
        error: (error: any) => {
          console.error(error);
        }
      });
  }

  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName';
    this.seoPageService.getSeoPageByPageWithCache('jatio-sthai-committee', select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.seoPage.set(res);
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }



  private getAllStanding() {
    // Select
    const mSelect = {
      image: 1,
      serial: 1,
      serialEn: 1,
      name: 1,
      description: 1,
      nameBn: 1,
      designation: 1,
      designationBn: 1
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { createdAt: 1 }
    };

    this.executiveService.getAllExecutives(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.success) {
            this.executive.set(res.data);
            const mData = [...res.data];
            mData.splice(0, 2);
            this.executiveLast.set(mData);
            this.holdPrevData.set(res.data);
          }
        },
        error: error => {
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
    const seoData = this.seoPage();
    if (!seoData) return;

    // Title
    this.title.setTitle(seoData.name || 'Executive Committee');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoData.seoDescription || 'Executive Committee of BNP'});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || 'BNP, Executive Committee'});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoData.name || 'Executive Committee'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoData.image || 'https://bnpbd.org/images/logo/bnp-logo-social.jpg'});
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
    this.meta.updateTag({property: 'og:description', content: seoData.seoDescription || 'Executive Committee of BNP'});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoData.name || 'Executive Committee'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoData.seoDescription || 'Executive Committee of BNP'});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoData.image || 'https://bnpbd.org/images/logo/bnp-logo-social.jpg'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const seoData = this.seoPage();
    if (!seoData) return;

    // Title
    this.title.setTitle(seoData.nameEn || 'জাতীয় স্থায়ী কমিটি');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: seoData.seoDescription || 'বিএনপির জাতীয় স্থায়ী কমিটি'});
    this.meta.updateTag({name: 'keywords', content: seoData.keyWord || 'বিএনপি, জাতীয় স্থায়ী কমিটি'});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: seoData.nameEn || 'জাতীয় স্থায়ী কমিটি'});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: seoData.image || 'https://bnpbd.org/images/logo/bnp-logo-social.jpg'});
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
    this.meta.updateTag({property: 'og:description', content: seoData.seoDescription || 'বিএনপির জাতীয় স্থায়ী কমিটি'});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: seoData.nameEn || 'জাতীয় স্থায়ী কমিটি'});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: seoData.seoDescription || 'বিএনপির জাতীয় স্থায়ী কমিটি'});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: seoData.image || 'https://bnpbd.org/images/logo/bnp-logo-social.jpg'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }



  // Angular 20 with takeUntilDestroyed automatically handles cleanup
  // No need for OnDestroy implementation

}
