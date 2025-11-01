import {Component, ElementRef, ViewChild, OnInit, OnDestroy, inject, signal, computed, DestroyRef} from '@angular/core';
import {Showcase} from "../../../interfaces/common/showcase.interface";
import {MatDialog} from "@angular/material/dialog";
import {ConferenceService} from "../../../services/common/conference.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ShowcaseService} from "../../../services/common/showcase.service";
import {Subscription} from "rxjs";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-banner',
  templateUrl: './main-banner.component.html',
  imports: [
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./main-banner.component.scss']
})
export class MainBannerComponent implements OnInit, OnDestroy {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly matDialog = inject(MatDialog);
  private readonly conferenceService = inject(ConferenceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly showcaseService = inject(ShowcaseService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly isChangeLanguage = signal<boolean>(false);
  readonly language = signal<string | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly showcase = signal<Showcase[]>([]);
  readonly currentLang = signal<string>('en'); // Local signal for reactive language tracking

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.currentLang());
  readonly isEnglish = computed(() => this.currentLang() === 'en');
  readonly isBengali = computed(() => this.currentLang() === 'bn');

  // ViewChild for scroll functionality
  @ViewChild('section2') section2!: ElementRef;

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
    
    this.getAllCarousel();
  }

  onScroll(){
    this.section2.nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
  }

  // private getAllShowcase() {
  //   // Select
  //   const mSelect = {
  //     image: 1,
  //     image2: 1,
  //     title: 1,
  //     description: 1,
  //     titleEn: 1,
  //     descriptionEn: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //
  //   this.subDataOne = this.showcaseService.getAllShowcases(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.showcase = res.data;
  //           // console.log('ff',this.showcase)
  //         }
  //       },
  //       error: error => {
  //         console.log(error);
  //       }
  //     });
  // }


  private getAllCarousel(): void {
    this.showcaseService.getAllCarousel()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.showcase.set(res.data);
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }


  /**
   * ON Destroy
   */
  ngOnDestroy(): void {
    // Angular 20: takeUntilDestroyed handles subscription cleanup automatically
    // No manual cleanup needed
  }
}
