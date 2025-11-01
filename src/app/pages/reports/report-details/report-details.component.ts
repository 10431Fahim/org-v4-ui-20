import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import { Subscription } from "rxjs";
import { Review } from "../../../interfaces/common/review.interface";
import { Reports } from "../../../interfaces/common/reports.interface";
import {ActivatedRoute, Router} from "@angular/router";
import { ReviewService } from "../../../services/common/review.service";
import { ReportsService } from "../../../services/common/reports.service";
import { TranslateService } from "@ngx-translate/core";
import { Title, Meta } from '@angular/platform-browser';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {CanonicalService} from '../../../services/common/canonical.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  imports: [
    SafeHtmlCustomPipe
  ],
  standalone: true,
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly reviewService = inject(ReviewService);
  private readonly noticesService = inject(ReportsService);
  private readonly translateService = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly canonicalService = inject(CanonicalService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly id = signal<string | null>(null);
  readonly sub = signal<string | null>(null);
  readonly review = signal<Review | null>(null);
  readonly reports = signal<Reports | null>(null);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly language = signal<string | null>(null);

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.translateService.currentLang);
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        this.activatedRoute.queryParamMap
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(qParam => {
            this.sub.set(qParam.get('sub'));
            this.id.set(param.get('id'));
            const currentId = this.id();
            if (currentId) {
              this.getReportsById(currentId);
            }
          });
      });

    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        this.language.set(qParam.get('language'));
      });
  }


  // getReviewById(id) {
  //   // this.spinnerService.show();
  //   this.subDataOne = this.reviewService.getReviewById(id)
  //     .subscribe(res => {
  //       this.review = res.data;

  //       console.log('sep blog', this.review)
  //     }, error => {
  //       // this.spinnerService.hide();
  //       console.log(error);
  //     });
  // }



  getReportsById(id: string) {
    this.noticesService.getReportsById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.reports.set(res.data);
          const currentReports = this.reports();
          if (currentReports) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: error => {
          console.error(error);
        }
      });
  }


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
 * updateMetaDataBn()
 */


  private updateMetaData() {
    const currentReports = this.reports();
    if (!currentReports) return;

    const name = currentReports.name || 'BNPBD.ORG';
    const description = currentReports.description || 'BNPBD.ORG';
    const seoImage = currentReports.seoImage || '';

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
    const currentReports = this.reports();
    if (!currentReports) return;

    const name = currentReports.nameEn || 'BNPBD.ORG';
    const description = currentReports.descriptionEn || 'BNPBD.ORG';
    const seoImage = currentReports.seoImage || '';

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

}
