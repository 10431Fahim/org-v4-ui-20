import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {OurServiceService} from "../../../services/common/our-service.service";
import {OurService} from "../../../interfaces/common/our-service.interface";
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NewsCardOneLoaderComponent} from '../../../shared/loader/news-card-one-loader/news-card-one-loader.component';
import {SwiperComponent} from '../../../shared/components/swiper/swiper.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-program-press',
  templateUrl: './program-press.component.html',
  imports: [
    RouterLink,
    NgIf,
    DatePipe,
    NewsCardOneLoaderComponent,
    TranslatePipe,
    SwiperComponent,
  ],
  styleUrls: ['./program-press.component.scss'],

})
export class ProgramPressComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  isChangeLanguage = signal<boolean>(false);
  language = signal<string>('en');
  isLoading = signal<boolean>(true);
  isLoading1 = signal<boolean>(true);
  isChangeLanguageToggle = signal<string>('en');
  ourService = signal<OurService[]>([]);

  // Computed signals for derived state
  hasOurService = computed(() => this.ourService().length > 0);
  ourServiceItems = computed(() => this.ourService());
  showContent = computed(() => !this.isLoading() && !this.isLoading1() && this.hasOurService());
  showLoader = computed(() => this.isLoading() || this.isLoading1());

  // Swiper breakpoints configuration
  swiperBreakpoints = {
    '520': { visibleSlides: 1.2, gap: 15 },
    '678': { visibleSlides: 2.3, gap: 15 },
    '768': { visibleSlides: 2.6, gap: 15 },
    '816': { visibleSlides: 2.8, gap: 15 },
    '850': { visibleSlides: 2.8, gap: 15 },
    '930': { visibleSlides: 3, gap: 15 },
    '1000': { visibleSlides: 3.5, gap: 20 },
    '1150': { visibleSlides: 4, gap: 20 },
    '1180': { visibleSlides: 4.5, gap: 20 },
    '1200': { visibleSlides: 4.5, gap: 20 }
  };

  // Subscriptions
  private subDataThree!: Subscription;

  // Services injected using inject() function for Angular 20
  private activatedRoute = inject(ActivatedRoute);
  public translateService = inject(TranslateService);
  private ourServiceService = inject(OurServiceService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Use takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qPram => {
      this.language.set(qPram.get('language') || 'en');
    });

    this.getAllOurService();
  }
  // private getAllOurService() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     imageEn: 1,
  //     publishedDate: 1,
  //     _id: 1,
  //     slug: 1,
  //     createdAt: 1,
  //     createdBy: 1,
  //
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: {pageSize: 9, currentPage: 0},
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //   this.isLoading = true;
  //   this.subDataThree = this.ourServiceService.getAllOurServices(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         if (res.success) {
  //           this.ourService = res.data;
  //         }  this.cdr.markForCheck();
  //       },
  //       error: error => {
  //         this.isLoading = false;
  //         console.log(error);
  //       }
  //     });
  // }

  private getAllOurService(): void {
    this.ourServiceService.getAllServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.ourService.set(res.data);
          this.isLoading.set(false);
          this.isLoading1.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
          this.isLoading1.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }

}
