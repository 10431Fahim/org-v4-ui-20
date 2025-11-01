import { Component, OnInit, signal, computed, effect, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VisionsResources } from "../../interfaces/common/visions-resources.interface";
import { FilterData } from "../../interfaces/gallery/filter-data";
import { VisionsResourcesService } from "../../services/common/visions-resources.service";
import { FaqSubCategory } from '../../interfaces/common/faq-sub-category.interface';
import { FaqSubCategoryService } from '../../services/common/faq-sub-category.service';

@Component({
  selector: 'app-sub-pathagar',
  standalone: true,
  templateUrl: './sub-pathagar.component.html',
  imports: [RouterLink],
  styleUrls: ['./sub-pathagar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubPathagarComponent implements OnInit {
  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);
  private visionsResourcesService = inject(VisionsResourcesService);
  private activatedRoute = inject(ActivatedRoute);
  private faqSubCategoryService = inject(FaqSubCategoryService);
  translateService = inject(TranslateService);

  // Signals for reactive state
  id = signal<string | null>(null);
  visionsResources = signal<VisionsResources[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('bn');
  faqSubCategories = signal<FaqSubCategory[]>([]);

  // Computed signals for derived state
  currentLanguage = computed(() => this.translateService.currentLang);
  isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  isBangla = computed(() => this.currentLanguage() === 'bn');
  
  // Computed signal for safe data access
  firstVisionResource = computed(() => this.visionsResources()[0]);
  hasVisionResource = computed(() => this.visionsResources().length > 0);

  ngOnInit(): void {
    // Modern subscription handling with takeUntilDestroyed
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(param => {
        const idValue = param.get('id');
        this.id.set(idValue);
        if (idValue) {
          this.getSubCategoriesByCategoryId();
        }
      });

    this.getAllVisionsResourcess();
  }

  private getSubCategoriesByCategoryId() {
    const select = 'name category id nameEn image';
    this.faqSubCategoryService.getSubCategoriesByCategoryId(this.id()!, select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.faqSubCategories.set(res.data);
        },
        error: error => {
          // console.log(error);
        }
      });
  }

  // private getAllVisionsResourcess() {
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     description: 1,
  //     descriptionEn: 1,
  //     informations: 1
  //   };
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   };
  //
  //   this.visionsResourcesService.getAllVisionsResourcess(filterData, null)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.visionsResources.set(res.data);
  //           console.log('res.data',res.data)
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
    } else {
      this.isChangeLanguageToggle.set('bn');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }
}
