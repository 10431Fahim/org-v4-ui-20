import { Component, OnInit, signal, computed, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { CanonicalService } from '../../services/common/canonical.service';
import { SafeHtmlCustomPipe } from '../../shared/pipes/safe-html.pipe';
import { FaqService } from '../../services/common/faq.service';
import { Faq } from '../../interfaces/common/faq.interface';
import { FaqSubCategoryService } from '../../services/common/faq-sub-category.service';
import { FilterData } from '../../interfaces/core/filter-data';

@Component({
  selector: 'app-pathagar-detail',
  standalone: true,
  templateUrl: './pathagar-detail.component.html',
  imports: [SafeHtmlCustomPipe],
  styleUrls: ['./pathagar-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathagarDetailComponent implements OnInit {
  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private faqService = inject(FaqService);
  private faqSubCategoryService = inject(FaqSubCategoryService);
  translateService = inject(TranslateService);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private canonicalService = inject(CanonicalService);

  // Signals for reactive state
  id = signal<string | null>(null);
  sub = signal<string | null>(null);
  faq = signal<Faq | null>(null);
  language = signal<string | null>(null);

  // Computed signals for derived state
  currentLanguage = computed(() => this.translateService.currentLang);
  isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  isBangla = computed(() => this.currentLanguage() === 'bn');
  hasFaq = computed(() => this.faq() !== null);

  ngOnInit(): void {
    // Modern subscription handling with takeUntilDestroyed
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(param => {
        const idValue = param.get('id');
        this.id.set(idValue);
      });

    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        this.language.set(qParam.get('language'));
        this.sub.set(qParam.get('sub'));
        
        if (this.id()) {
          this.getFaqById(this.id()!);
        }
      });
  }


  private getFaqById(id: any): void {
    const mSelect = {
      name: 1,
      nameEn: 1,
      image: 1,
      seoImage: 1,
      images: 1,
      description: 1,
      descriptionEn: 1,
      _id: 1,
      slug: 1,
      createdAt: 1
    };

    const filterData: FilterData = {
      pagination: null,
      filter: { subCategory: id },
      select: mSelect,
      sort: { createdAt: -1 }
    };

    this.faqService.getAllFaqs(filterData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          const faqData = res.data[0];
          this.faq.set(faqData);

          if (faqData) {
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




  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData(): void {
    const faq = this.faq();
    if (!faq || !faq.name || !faq.seoImage) return;

    // Title
    this.title.setTitle(faq.name);
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    // this.meta.updateTag({name: 'description', content: this.faq?.description});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: faq.name });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: faq.seoImage });
    // this.meta.updateTag({ property: 'og:description', content: this.faq?.description});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: faq.name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:image', content: faq.seoImage });
    // this.meta.updateTag({name: 'twitter:description', content: this.faq?.description});

    // Microsoft
    this.meta.updateTag({ name: 'msapplication-TileImage', content: faq.seoImage });

    // Canonical
    this.canonicalService.setCanonicalURL();

  }

  private updateMetaDataBn(): void {
    const faq = this.faq();
    if (!faq || !faq.nameEn || !faq.seoImage) return;

    // Title
    this.title.setTitle(faq.nameEn);
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    // this.meta.updateTag({name: 'description', content: this.faq?.descriptionEn});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: faq.nameEn });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: faq.seoImage });
    // this.meta.updateTag({ property: 'og:description', content: this.faq?.descriptionEn});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: faq.nameEn });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:image', content: faq.seoImage });
    // this.meta.updateTag({name: 'twitter:description', content: this.faq?.descriptionEn});

    // Microsoft
    this.meta.updateTag({ name: 'msapplication-TileImage', content: faq.seoImage });

    // Canonical
    this.canonicalService.setCanonicalURL();
  }


}
