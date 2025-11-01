import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../../services/common/canonical.service";
import {MatDialog} from '@angular/material/dialog';
import {NewsDetailsLoaderComponent} from '../../../shared/loader/news-details-loader/news-details-loader.component';
import {DatePipe} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {NewsCardOneLoaderComponent} from '../../../shared/loader/news-card-one-loader/news-card-one-loader.component';
import {OurService} from '../../../interfaces/common/our-service.interface';
import {OurServiceService} from '../../../services/common/our-service.service';
import {SocialShareComponent} from '../../../shared/components/ui/social-share/social-share.component';
import {SwiperComponent} from '../../../shared/components/swiper/swiper.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  imports: [
    NewsDetailsLoaderComponent,
    SafeHtmlCustomPipe,
    RouterLink,
    TranslatePipe,
    NewsCardOneLoaderComponent,
    DatePipe,
    SwiperComponent
  ],
  standalone: true,
  host: {ngSkipHydration: 'true'},
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly ourServiceService = inject(OurServiceService);
  private readonly translateService = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly canonicalService = inject(CanonicalService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly ourServicess = signal<OurService[]>([]);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly language = signal<string | null>(null);
  readonly id = signal<string | null>(null);
  readonly sub = signal<string | null>(null);
  readonly ourService = signal<OurService | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingRelated = signal<boolean>(true);

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.translateService.currentLang);
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  // Swiper breakpoints configuration for related programs
  readonly swiperBreakpoints = {
    '520': { visibleSlides: 2, gap: 15 },
    '768': { visibleSlides: 2.3, gap: 15 },
    '1000': { visibleSlides: 2.5, gap: 20 },
    '1150': { visibleSlides: 2.5, gap: 20 },
    '1180': { visibleSlides: 3, gap: 20 },
    '1200': { visibleSlides: 3, gap: 20 }
  };

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        this.activatedRoute.queryParamMap
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(qParam => {
            this.language.set(qParam.get('language'));
            this.id.set(param.get('id'));
            const currentId = this.id();
            if (currentId) {
              this.getPressById(currentId);
            }
          });
      });
  }


  getPressById(id: string) {
    this.ourServiceService.getOurServiceById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.ourService.set(res.data);
          const currentOurService = this.ourService();
          if (currentOurService) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
          this.getAllOurService();
        },
        error: error => {
          this.isLoading.set(false);
          console.error(error);
        }
      });
  }


  // getStoryById(id) {
  //   // this.spinnerService.show();
  //   this.subDataOne = this.storyService.getStoryById(id)
  //     .subscribe(res => {
  //       this.ourService = res.data;

  //       console.log('blog', this.ourService)
  //     }, error => {
  //       // this.spinnerService.hide();
  //       console.log(error);
  //     });
  // }
  private getAllOurService(): void {
    this.isLoadingRelated.set(true);
    this.ourServiceService.getAllServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoadingRelated.set(false);
          if (res.success) {
            const currentId = this.id();
            this.ourServicess.set(res.data.filter(f => f._id !== currentId));
          }
        },
        error: err => {
          console.error(err);
          this.isLoadingRelated.set(false);
        }
      });
  }

  // private getAllOurService() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     imageEn: 1,
  //     shortDescription: 1,
  //     shortDescriptionEn: 1,
  //     seoImage:1,
  //     publishedDate:1,
  //     authorName: 1,
  //     authorNameBn: 1,
  //     // description:1,
  //     // descriptionEn:1,
  //     descriptionShortEn: 1,
  //     descriptionShort: 1,
  //     createdBy: 1,
  //     _id: 1,
  //     slug: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: {pageSize: 6, currentPage: 0},
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.subDataThree = this.ourServiceService.getAllOurServices(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoadingRelated = false;
  //         if (res.success) {
  //           this.ourServicess = res.data.filter(f => f._id !== this.id);
  //         }
  //       },
  //       error: error => {
  //         this.isLoadingRelated = false;
  //         // console.log(error);
  //       }
  //     });
  // }

  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
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
   * SEO DATA UPDATE
   * updateMetaData()
   */
  private updateMetaData() {
    const currentOurService = this.ourService();
    if (!currentOurService) return;

    const name = currentOurService.name || 'BNPBD.ORG';
    const description = currentOurService.description || 'BNPBD.ORG';
    const seoImage = currentOurService.seoImage || '';

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
    this.meta.updateTag({ property: 'og:type', content: 'article' });
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

  private updateMetaDataBn() {
    const currentOurService = this.ourService();
    if (!currentOurService) return;

    const name = currentOurService.nameEn || 'BNPBD.ORG';
    const description = currentOurService.descriptionEn || 'BNPBD.ORG';
    const seoImage = currentOurService.seoImage || '';

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
    this.meta.updateTag({ property: 'og:type', content: 'article' });
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

  openDialog() {
    const currentOurService = this.ourService();
    if (currentOurService) {
      this.dialog.open(SocialShareComponent, {
        data: currentOurService,
        maxWidth: "480px",
        width: "100%",
        height: "auto",
        panelClass: ['social-share', 'social-dialog']
      });
    }
  }

}
