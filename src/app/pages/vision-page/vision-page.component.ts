import {Component, OnDestroy, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {OurVisionService} from '../../services/common/our-vision.service';
import {OurVision} from '../../interfaces/common/our-vision.interface';
import {TranslateService} from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {SocialShareComponent} from "../../shared/components/ui/social-share/social-share.component";
import {MatDialog} from "@angular/material/dialog";
import {SafeHtmlCustomPipe} from '../../shared/pipes/safe-html.pipe';
import {CanonicalService} from '../../services/common/canonical.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-vision-page',
  templateUrl: './vision-page.component.html',
  imports: [
    SafeHtmlCustomPipe,
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./vision-page.component.scss']
})
export class VisionPageComponent implements OnInit, OnDestroy {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly ourVisionService = inject(OurVisionService);
  private readonly translateService = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly canonicalService = inject(CanonicalService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly ourVision = signal<OurVision[]>([]);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly language = signal<string | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly currentLang = signal<string>('en'); // Local signal for reactive language tracking

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.currentLang());
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');
  readonly firstVision = computed(() => this.ourVision()[0] || null);

  ngOnInit(): void {
    // Initialize language from translateService
    this.currentLang.set(this.translateService.currentLang || 'en');

    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        const lang = qParam.get('language');
        this.language.set(lang);
        if (lang === 'bn') {
          this.currentLang.set('bn');
        } else if (lang === 'en') {
          this.currentLang.set('en');
        }
      });

    // Subscribe to translate service for language changes
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(langChange => {
        this.currentLang.set(langChange.lang);
      });
    
    this.getAllOurVisions();
  }

  // private getAllOurVisions() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     seoImage:1,
  //     description: 1,
  //     descriptionEn: 1,
  //     informations: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.subDataOne = this.ourVisionService.getAllOurVisions(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.ourVision = res.data;
  //           if (this.ourVision) {
  //             if (this.language === 'bn') {
  //               this.updateMetaDataBn();
  //             } else {
  //               this.updateMetaData();
  //             }
  //           }
  //
  //         }
  //       },
  //       error: error => {
  //         // console.log(error);
  //       }
  //     });
  // }

  private getAllOurVisions(): void {
    this.ourVisionService.getAllOurVision()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.ourVision.set(res.data);
          this.isLoading.set(false);
          const currentVision = this.firstVision();
          if (currentVision) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
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

  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData(): void {
    const currentVision = this.firstVision();
    if (!currentVision) return;

    const name = currentVision.name || 'BNPBD.ORG';
    const description = currentVision.description || 'BNPBD.ORG';
    const seoImage = currentVision.seoImage || '';

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
    this.meta.updateTag({ property: 'og:type', content: 'website' });
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

  private updateMetaDataBn(): void {
    const currentVision = this.firstVision();
    if (!currentVision) return;

    const name = currentVision.nameEn || 'BNPBD.ORG';
    const description = currentVision.descriptionEn || 'BNPBD.ORG';
    const seoImage = currentVision.seoImage || '';

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
    this.meta.updateTag({ property: 'og:type', content: 'website' });
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


  openDialog(): void {
    this.dialog.open(SocialShareComponent, {
      data: this.router.url,
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    });
  }

  ngOnDestroy(): void {
    // Angular 20: takeUntilDestroyed handles subscription cleanup automatically
    // No manual subscription management needed
  }


}
