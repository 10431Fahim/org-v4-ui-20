import { Component, OnInit, signal, computed, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from "@angular/router";
import { BannerComponent } from '../../shared/lazy/banner/banner.component';
import { FaqSubCategory } from '../../interfaces/common/faq-sub-category.interface';
import { Faq } from '../../interfaces/common/faq.interface';
import { FaqCategory } from '../../interfaces/common/faqCategory.interface';
import { FaqCategoryService } from '../../services/common/faq-category.service';
import { FaqSubCategoryService } from '../../services/common/faq-sub-category.service';
import { FaqService } from '../../services/common/faq.service';

@Component({
  selector: 'app-pathagar',
  standalone: true,
  templateUrl: './pathagar.component.html',
  imports: [
    TranslatePipe,
    RouterLink,
    BannerComponent
  ],
  styleUrls: ['./pathagar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathagarComponent implements OnInit {
  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);
  private faqCategoryService = inject(FaqCategoryService);
  private faqSubCategoryService = inject(FaqSubCategoryService);
  private faqservice = inject(FaqService);
  private router = inject(Router);
  translateService = inject(TranslateService);

  // Signals for reactive state
  faqs = signal<Faq[]>([]);
  holdPrevData = signal<Faq[]>([]);
  faqCategories = signal<FaqCategory[]>([]);
  faqSubCategories = signal<FaqSubCategory[]>([]);
  allFaqSubCategories = signal<FaqSubCategory[]>([]);
  categoryId = signal<string | null>(null);
  searchQuery = signal<string | null>(null);

  // Pagination signals
  currentPage = signal<number>(1);
  totalFaqs = signal<number>(0);
  faqsPerPage = signal<number>(12);
  totalFaqsStore = signal<number>(0);

  // FilterData signals
  filter = signal<any>(null);
  selectedfaqCategory = signal<any>(null);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  currentLanguage = computed(() => this.translateService.currentLang);
  isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  isBangla = computed(() => this.currentLanguage() === 'bn');

  ngOnInit(): void {
    this.getAllFaqCategories();
    this.getAllSubCategories();
  }


  // private getAllFaqCategories() {
  //
  //   const pagination: Pagination = null;
  //
  //   // this.spinnerService.show();
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: pagination,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: 1 }
  //   }
  //   this.subDataFour = this.faqCategoryService.getAllFaqCategories(filterData, this.searchQuery)
  //     .subscribe(res => {
  //       // this.spinnerService.hide();
  //       this.faqCategories = res.data;
  //       this.totalFaqs = res.count;
  //       if (!this.searchQuery) {
  //         this.holdPrevData = res.data;
  //         this.totalFaqsStore = res.count;
  //       }
  //     }, error => {
  //       // this.spinnerService.hide();
  //       // console.log(error);
  //     });
  // }
  //
  // private getAllSubCategories() {
  //
  //
  //   // this.spinnerService.show();
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //   this.subDataFour = this.faqSubCategoryService.getAllFaqSubCategories(filterData, null)
  //     .subscribe(res => {
  //       // this.spinnerService.hide();
  //       this.allFaqSubCategories = res.data;
  //     }, error => {
  //       // this.spinnerService.hide();
  //       // console.log(error);
  //     });
  // }


  private getAllFaqCategories(): void {
    this.faqCategoryService.getAllAbout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.faqCategories.set(res.data);
          // this.totalFaqs.set(res.count);
          // if (!this.searchQuery()) {
          //   this.holdPrevData.set(res.data);
          //   this.totalFaqsStore.set(res.count);
          // }
        },
        error: err => {
          console.error(err);
        }
      });
  }

  private getAllSubCategories(): void {
    this.faqSubCategoryService.getAllFaqSubCategory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.allFaqSubCategories.set(res.data);
        },
        error: err => {
          console.error(err);
        }
      });
  }
    /**
   * ON CLICK EVENT
   * onClickCategory()
   */


  private getSubCategoriesByCategoryId(categoryId: string): void {
    const select = 'name category slug';
    this.faqSubCategoryService.getSubCategoriesByCategoryId(categoryId, select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.faqSubCategories.set(res.data);
        },
        error: error => {
          console.error(error);
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

}


