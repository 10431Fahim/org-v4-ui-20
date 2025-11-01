import {Component, computed, effect, inject, signal, DestroyRef} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AboutService} from '../../services/common/about.service';
import {About} from '../../interfaces/common/about.interface';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {SeoPageService} from "../../services/common/seo-page.service";
import {SocialShareComponent} from "../../shared/components/ui/social-share/social-share.component";
import {MatDialog} from "@angular/material/dialog";
import {SlicePipe} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../shared/pipes/safe-html.pipe';
import {CanonicalService} from '../../services/common/canonical.service';

@Component({
  selector: 'app-porichito',
  standalone: true,
  templateUrl: './porichito.component.html',
  imports: [
    SafeHtmlCustomPipe,
    RouterLink,
    SlicePipe,
    TranslatePipe
  ],
  styleUrls: ['./porichito.component.scss'],
  host: {
    'ngSkipHydration': 'true'
  }
})
export class PorichitoComponent {

  // Angular 20 Signals for reactive state management
  seoPage = signal<SeoPage | null>(null);
  language = signal<string>('en');
  isLoading = signal<boolean>(true);
  about = signal<About[]>([]);

  // Computed signals for derived state
  currentAbout = computed(() => this.about()[0] || null);
  isBengaliLanguage = computed(() => this.language() === 'bn');
  hasAbout = computed(() => this.about().length > 0);
  informations = computed(() => this.currentAbout()?.informations || []);

  // Inject services using Angular 20 inject function
  private aboutService = inject(AboutService);
  public translateService = inject(TranslateService);
  private title = inject(Title);
  private meta = inject(Meta);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private seoPageService = inject(SeoPageService);
  private canonicalService = inject(CanonicalService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Effect to automatically update meta data when about data changes
    effect(() => {
      const aboutData = this.currentAbout();
      const lang = this.language();

      if (aboutData && !this.isLoading()) {
        // Use setTimeout to prevent immediate re-rendering
        setTimeout(() => {
          if (lang === 'bn') {
            this.updateMetaDataBn();
          } else {
            this.updateMetaData();
          }
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    // Handle route parameters and query parameters in a single subscription
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qParam => {
      const newLanguage = qParam.get('language') || 'en';
      // Only update if language actually changed
      if (this.language() !== newLanguage) {
        this.language.set(newLanguage);
      }
    });
    
    // Load about data
    this.getAllAbouts();
  }

  // private getAllAbouts() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     description: 1,
  //     descriptionEn: 1,
  //     informations: 1,
  //     briefTimelineImg: 1,
  //     briefTimelineImgEn: 1,
  //     seoImage:1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.subDataOne = this.aboutService.getAllAbouts(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.about = res.data;
  //           if (this.about) {
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

  private getAllAbouts(): void {
    this.isLoading.set(true);
    
    this.aboutService.getAllAbout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          // Only update if data actually changed - use a more efficient comparison
          const currentData = this.about();
          const newData = res.data;
          
          if (!currentData || currentData.length !== newData.length || 
              !currentData.every((item, index) => item._id === newData[index]?._id)) {
            this.about.set(newData);
          }
        },
        error: err => {
          console.error('Error loading about data:', err);
          this.isLoading.set(false);
          // Set empty array on error to prevent undefined issues
          this.about.set([]);
        }
      });
  }

  /**
   * SEO DATA UPDATE
   * updateMetaData()
   */

  private updateMetaData() {
    const aboutData = this.currentAbout();
    if (!aboutData) return;

    // Title
    this.title.setTitle(aboutData.name);
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: aboutData.description || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook & Messenger (Open Graph)
    this.meta.updateTag({ property: 'og:title', content: aboutData.name || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: aboutData.seoImage || '' });
    this.meta.updateTag({ property: 'og:image:alt', content: aboutData.name || '' });
    this.meta.updateTag({ property: 'og:description', content: aboutData.description || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // LinkedIn specific meta tags
    this.meta.updateTag({ property: 'linkedin:owner', content: 'BNP BD' });

    // Telegram specific meta tags
    this.meta.updateTag({ name: 'telegram:channel', content: '@bdbnp78' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: aboutData.name || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: aboutData.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: aboutData.description || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: aboutData.seoImage || ''});

    // Additional meta tags for better image sharing
    this.meta.updateTag({ name: 'image', content: aboutData.seoImage || '' });
    this.meta.updateTag({ name: 'thumbnail', content: aboutData.seoImage || '' });
    this.meta.updateTag({ property: 'og:image:secure_url', content: aboutData.seoImage || '' });
    this.meta.updateTag({ name: 'twitter:image:alt', content: aboutData.name || '' });

    // Canonical
    this.canonicalService?.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const aboutData = this.currentAbout();
    if (!aboutData) return;

    // Title
    this.title.setTitle(aboutData.nameEn);
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: aboutData.descriptionEn || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook & Messenger (Open Graph)
    this.meta.updateTag({ property: 'og:title', content: aboutData.nameEn || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: aboutData.seoImage || '' });
    this.meta.updateTag({ property: 'og:image:alt', content: aboutData.nameEn || '' });
    this.meta.updateTag({ property: 'og:description', content: aboutData.descriptionEn || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // LinkedIn specific meta tags
    this.meta.updateTag({ property: 'linkedin:owner', content: 'BNP BD' });

    // Telegram specific meta tags
    this.meta.updateTag({ name: 'telegram:channel', content: '@bdbnp78' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: aboutData.nameEn || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: aboutData.seoImage || ''});
    this.meta.updateTag({name: 'twitter:description', content: aboutData.descriptionEn || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: aboutData.seoImage || ''});

    // Additional meta tags for better image sharing
    this.meta.updateTag({ name: 'image', content: aboutData.seoImage || '' });
    this.meta.updateTag({ name: 'thumbnail', content: aboutData.seoImage || '' });
    this.meta.updateTag({ property: 'og:image:secure_url', content: aboutData.seoImage || '' });
    this.meta.updateTag({ name: 'twitter:image:alt', content: aboutData.nameEn || '' });

    // Canonical
    this.canonicalService?.setCanonicalURL();
  }

  openDialog() {
    this.dialog.open(SocialShareComponent, {
      data: this.about(),
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    })
  }


  // Angular 20 with takeUntilDestroyed automatically handles cleanup
  // No need for OnDestroy implementation


}
