import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, computed, inject, DestroyRef} from '@angular/core';
import {filter, pairwise, Subscription} from 'rxjs';
import {VisionsResourcesService} from '../../services/common/visions-resources.service';
import {VisionsResources} from '../../interfaces/common/visions-resources.interface';
import {OurService} from '../../interfaces/common/our-service.interface';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Event, Router, RouterLink, Scroll} from "@angular/router";
import {isPlatformServer, ViewportScroller} from '@angular/common';
import {Meta, Title} from '@angular/platform-browser';
import {CanonicalService} from '../../services/common/canonical.service';
import {PoliciesComponent} from './policies/policies.component';
import {PathagarComponent} from '../pathagar/pathagar.component';
import {StoriesComponent} from './stories/stories.component';
import {PublicationComponent} from './publication/publication.component';
import {DeclarationComponent} from './declaration/declaration.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-visions-resources',
  templateUrl: './visions-resources.component.html',
  imports: [
    RouterLink,
    TranslatePipe,
    PoliciesComponent,
    PathagarComponent,
    StoriesComponent,
    PublicationComponent,
    DeclarationComponent
  ],
  styleUrls: ['./visions-resources.component.scss']})
export class VisionsResourcesComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  activeTab = signal<string>('Publications');
  ourServicess = signal<OurService[]>([]);
  id = signal<string>('');
  sub = signal<string>('');
  ourService = signal<OurService | null>(null);
  visionsResources = signal<VisionsResources[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');
  language = signal<string>('en');

  // Computed signals for derived state
  hasVisionsResources = computed(() => this.visionsResources().length > 0);
  firstVisionsResource = computed(() => this.visionsResources()[0] || null);
  isLanguageBengali = computed(() => this.language() === 'bn');
  showContent = computed(() => this.hasVisionsResources());

  // Subscriptions are now handled automatically with takeUntilDestroyed

  // Services injected using inject() function for Angular 20
  private visionsResourcesService = inject(VisionsResourcesService);
  public translateService = inject(TranslateService);
  public activatedRoute = inject(ActivatedRoute);
  public router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private title = inject(Title);
  private meta = inject(Meta);
  private canonicalService = inject(CanonicalService);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Disable automatic scroll restoration to avoid race conditions
    this.viewportScroller.setHistoryScrollRestoration('manual');
    if (isPlatformServer(this.platformId)) {
      this.handleScrollOnNavigation();
    }
  }

  ngOnInit(): void {
    this.getAllVisionsResourcess();

    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qPram => {
      this.language.set(qPram.get('language') || 'en');
    })
    
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qParam => {
      if (qParam.get('tab')) {
        this.activeTab.set(qParam.get('tab') || 'Publications');
      }
    });
  }

  onTabClick(tab: string) {
    this.activeTab.set(tab);
    this.router.navigate([], { queryParams: { tab: this.activeTab() }, queryParamsHandling: "merge" })
  }

  // private getAllVisionsResourcess() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     seoImage: 1,
  //     description: 1,
  //     descriptionEn: 1,
  //     informations: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //
  //   this.subDataOne = this.visionsResourcesService.getAllVisionsResourcess(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.visionsResources = res.data;
  //           if (this.visionsResources) {
  //             if (this.language === 'bn') {
  //               this.updateMetaDataBn();
  //             } else {
  //               this.updateMetaData();
  //             }
  //           }
  //         }
  //       },
  //       error: error => {
  //         // console.log(error);
  //       }
  //     });
  // }


  private getAllVisionsResourcess(): void {
    this.visionsResourcesService.getAllVisionsData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.visionsResources.set(res.data);
          if (this.visionsResources().length > 0) {
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

  private handleScrollOnNavigation(): void {
    this.router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll),
      pairwise(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((e: Scroll[]) => {
      const previous = e[0];
      const current = e[1];
      if (current.position) {
        // Backward navigation
        this.viewportScroller.scrollToPosition(current.position);
      } else if (current.anchor) {
        // Anchor navigation
        // this.viewportScroller.scrollToAnchor(current.anchor);
      } else {
        // Check if routes match, or if it is only a query param change
        // if (this.getBaseRoute(previous.routerEvent.urlAfterRedirects) !== this.getBaseRoute(current.routerEvent.urlAfterRedirects)) {
        //   // Routes don't match, this is actual forward navigation
        //   // Default behavior: scroll to top
        //   // this.viewportScroller.scrollToPosition([0, 0]);
        // }
      }
    });
  }

  private getBaseRoute(url: string): string {
    // return url without query params
    return url.split('?')[0];
  }


  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData() {
    const visionsData = this.visionsResources();
    const firstResource = visionsData[0];
    
    // Title
    this.title.setTitle(firstResource?.name || 'Visions & Resources');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: firstResource?.description || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstResource?.name || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstResource?.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: firstResource?.description || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstResource?.name || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstResource?.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: firstResource?.description || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstResource?.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();

  }

  private updateMetaDataBn() {
    const visionsData = this.visionsResources();
    const firstResource = visionsData[0];
    
    // Title
    this.title.setTitle(firstResource?.nameEn || 'Visions & Resources');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: firstResource?.descriptionEn || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstResource?.nameEn || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstResource?.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: firstResource?.descriptionEn || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstResource?.nameEn || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstResource?.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: firstResource?.descriptionEn || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstResource?.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  ngOnDestroy() {
    // No manual subscription cleanup needed - takeUntilDestroyed handles it automatically
  }


}
