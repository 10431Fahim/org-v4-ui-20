import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {Notices} from '../../../interfaces/common/notices.interface';
import {Review} from '../../../interfaces/common/review.interface';
import {ReviewService} from '../../../services/common/review.service';
import {NoticesService} from '../../../services/common/notices.service';
import {CanonicalService} from '../../../services/common/canonical.service';
import {SocialShareComponent} from '../../../shared/components/ui/social-share/social-share.component';

@Component({
  selector: 'app-notice-details',
  templateUrl: './notice-details.component.html',
  imports: [
    SafeHtmlCustomPipe
  ],
  standalone: true,
  styleUrls: ['./notice-details.component.scss']
})
export class NoticeDetailsComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly reviewService = inject(ReviewService);
  private readonly noticesService = inject(NoticesService);
  private readonly translateService = inject(TranslateService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly canonicalService = inject(CanonicalService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly id = signal<string | null>(null);
  readonly sub = signal<string | null>(null);
  readonly review = signal<Review | null>(null);
  readonly notices = signal<Notices | null>(null);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly language = signal<string | null>(null);

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.translateService.currentLang);
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        this.language.set(qParam.get('language'));
      });

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
              this.getNoticesById(currentId);
            }
          });
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



  getNoticesById(id: string) {
    this.noticesService.getNoticesById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.notices.set(res.data);
          const currentNotices = this.notices();
          if (currentNotices) {
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

  openDialog() {
    const currentNotices = this.notices();
    if (currentNotices) {
      this.dialog.open(SocialShareComponent, {
        data: currentNotices,
        maxWidth: "480px",
        width: "100%",
        height: "auto",
        panelClass: ['social-share', 'social-dialog']
      });
    }
  }

  /**
 * SEO DATA UPDATE
 * updateMetaData()
 * updateMetaDataBn()
 */

  private updateMetaData() {
    const currentNotices = this.notices();
    if (!currentNotices) return;

    // Title
    this.title.setTitle(currentNotices.name || 'Default Title');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: currentNotices.name || 'Default Title' });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: currentNotices.seoImage || 'Default Image' });
    this.meta.updateTag({ property: 'og:description', content: currentNotices.description || 'BNP Notice' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh'});
    
    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: currentNotices.name || 'Default Title' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: currentNotices.seoImage || 'Default Image' });
    this.meta.updateTag({ name: 'twitter:description', content: currentNotices.description || 'BNP Notice' });
    
    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: currentNotices.seoImage || 'Default Image'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }
  private updateMetaDataBn() {
    const currentNotices = this.notices();
    if (!currentNotices) return;

    // Title
    this.title.setTitle(currentNotices.nameEn || 'Default Title');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: currentNotices.nameEn || 'Default Title' });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: currentNotices.seoImage || 'Default Image' });
    this.meta.updateTag({ property: 'og:description', content: currentNotices.descriptionEn || 'BNP Notice' });
    this.meta.updateTag({ property: 'og:locale', content: 'bn_BD'});
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh'});
    
    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: currentNotices.nameEn || 'Default Title' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: currentNotices.seoImage || 'Default Image' });
    this.meta.updateTag({ name: 'twitter:description', content: currentNotices.descriptionEn || 'BNP Notice' });
    
    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: currentNotices.seoImage || 'Default Image'});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }





}
