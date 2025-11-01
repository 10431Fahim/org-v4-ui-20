import {Component, Input, OnInit, inject, signal, computed, DestroyRef, ViewChild} from '@angular/core';
import {Showcase} from "../../../interfaces/common/showcase.interface";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ConferenceService} from "../../../services/common/conference.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ShowcaseService} from "../../../services/common/showcase.service";
import {Conference} from "../../../interfaces/common/conference.interface";
import {
  PressConferenceLoaderComponent
} from '../../../shared/loader/press-conference-loader/press-conference-loader.component';
import {SwiperComponent} from '../../../shared/components/swiper/swiper.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  imports: [
    RouterLink,
    PressConferenceLoaderComponent,
    TranslatePipe,
    SwiperComponent,
  ],
  standalone: true,
  styleUrls: ['./latest-news.component.scss']
})
export class LatestNewsComponent implements OnInit {
  @ViewChild(SwiperComponent) swiperComponent!: SwiperComponent;
  
  // Angular 20: Using inject() function instead of constructor injection
  private readonly matDialog = inject(MatDialog);
  private readonly conferenceService = inject(ConferenceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly showcaseService = inject(ShowcaseService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly isChangeLanguage = signal<boolean>(false);
  readonly conference = signal<Conference[] | null>(null);
  readonly language = signal<string | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly isLoadingConference = signal<boolean>(true);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly showcase = signal<Showcase[]>([]);
  readonly currentLang = signal<string>('en'); // Local signal for reactive language tracking

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.currentLang());
  readonly isEnglish = computed(() => this.currentLang() === 'en');
  readonly isBengali = computed(() => this.currentLang() === 'bn');

  // Swiper breakpoints configuration for latest news
  readonly swiperBreakpoints = {
    '499': { visibleSlides: 1.3, gap: 10 },
    '500': { visibleSlides: 1.6, gap: 15 },
    '520': { visibleSlides: 1.7, gap: 15 },
    '576': { visibleSlides: 1.8, gap: 15 },
    '580': { visibleSlides: 2, gap: 15 },
    '640': { visibleSlides: 2.1, gap: 15 },
    '678': { visibleSlides: 2.3, gap: 15 },
    '768': { visibleSlides: 2.6, gap: 15 },
    '816': { visibleSlides: 2.8, gap: 15 },
    '850': { visibleSlides: 2.8, gap: 15 },
    '930': { visibleSlides: 3, gap: 15 },
    '1000': { visibleSlides: 3.5, gap: 70 },
    '1150': { visibleSlides: 4, gap: 70 },
    '1180': { visibleSlides: 4.3, gap: 70 },
    '1200': { visibleSlides: 4.3, gap: 70 }
  };

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
    
    this.getAllConference();
  }

  // private getAllConference() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     title: 1,
  //     titleEn: 1,
  //     image:1,
  //     _id: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: {pageSize: 9, currentPage: 0},
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.subDataFive = this.conferenceService.getAllConferences(filterData, null)
  //     .subscribe({
  //       next: res => {
  //
  //         this.isLoadingConference = false;
  //         if (res.success) {
  //           this.conference = res.data;
  //         }
  //       }, error: error => {
  //         this.isLoadingConference = false;
  //         console.log(error);
  //       }
  //     });
  // }

  private getAllConference(): void {
    this.conferenceService.getAllConference()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.conference.set(res.data);
          this.isLoading.set(false);
          this.isLoadingConference.set(false);
          // Refresh swiper after data is loaded
          setTimeout(() => {
            if (this.swiperComponent) {
              this.swiperComponent.refresh();
            }
          }, 100);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
          this.isLoadingConference.set(false);
        }
      });
  }

}
