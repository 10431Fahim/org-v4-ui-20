import {Component, Input, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {Showcase} from "../../../interfaces/common/showcase.interface";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ConferenceService} from "../../../services/common/conference.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ShowcaseService} from "../../../services/common/showcase.service";
import {ClientService} from "../../../services/common/client.service";
import {Client} from "../../../interfaces/common/client.interface";
import {YoutubeLoaderComponent} from '../../../shared/loader/youtube-loader/youtube-loader.component';
import {SafeUrlPipe} from '../../../shared/pipes/safe-url.pipe';
import {SwiperComponent} from '../../../shared/components/swiper/swiper.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-all-video',
  templateUrl: './all-video.component.html',
  imports: [
    RouterLink,
    YoutubeLoaderComponent,
    SafeUrlPipe,
    TranslatePipe,
    SwiperComponent,
  ],
  standalone: true,
  styleUrls: ['./all-video.component.scss']
})
export class AllVideoComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly matDialog = inject(MatDialog);
  private readonly conferenceService = inject(ConferenceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly clientService = inject(ClientService);
  private readonly showcaseService = inject(ShowcaseService);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly isChangeLanguage = signal<boolean>(false);
  readonly language = signal<string | null>(null);
  readonly client = signal<Client[]>([]);
  readonly clientCurrentPage = signal<number>(1);
  readonly clientPageSize = signal<number>(4);
  readonly isLoading1 = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly showcase = signal<Showcase[]>([]);

  // Video category tabs (mapped to video-gallery routes)
  readonly videoTabs: { label: string; type: 'speech' | 'election' | 'important' }[] = [
    { label: 'Speech by Tarique Rahman', type: 'speech' },
    { label: 'Election Campaign Videos', type: 'election' },
    { label: 'Important Videos', type: 'important' },
  ];
  readonly selectedTab = signal<'speech' | 'election' | 'important'>('speech');
  readonly filteredClient = computed(() => {
    // Currently showing same list; can be filtered by selectedTab() if needed later
    return this.client();
  });

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.translateService.currentLang);
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  // Swiper breakpoints configuration for videos
  readonly swiperBreakpoints = {
    '520': { visibleSlides: 1.1, gap: 15 },
    '768': { visibleSlides: 2, gap: 16 },
    '1000': { visibleSlides: 2, gap: 20 },
    '1200': { visibleSlides: 3, gap: 40 }
  };

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        this.language.set(qParam.get('language'));
      });

    this.getAllClient();
  }

  onTabChange(type: 'speech' | 'election' | 'important'): void {
    this.selectedTab.set(type);
  }

  // private getAllClient() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     title: 1,
  //     titleEn: 1,
  //     _id: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: {pageSize: this.clientPageSize, currentPage: this.clientCurrentPage - 1},
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //   this.isLoading1 = true
  //   this.subDataFive = this.clientService.getAllClients(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.client  = res.data;
  //           // console.log('data',this.client)
  //           // res.data.map((item) => {
  //           //   this.client.push({ ...item, ...{ safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(item.name) } })
  //           // })
  //           setTimeout(() => {
  //             this.isLoading1 = false;
  //           },2000)
  //         }
  //       },
  //       error: error => {
  //         console.log(error);
  //       }
  //     });
  // }

  private getAllClient(): void {
    this.isLoading1.set(true);
    this.clientService.getAllClient()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.client.set(res.data);
          this.isLoading.set(false);
          setTimeout(() => {
            this.isLoading1.set(false);
          }, 2000);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

}
