import {Component, TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, input, afterNextRender, inject, DestroyRef, OnInit, OnDestroy} from '@angular/core';
import {Tag} from "../../../interfaces/common/tag.interface copy";
import {Showcase} from "../../../interfaces/common/showcase.interface";
import {Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConferenceService} from "../../../services/common/conference.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TagService} from "../../../services/common/tag.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ShowcaseService} from "../../../services/common/showcase.service";
import {VisionsResourcesService} from "../../../services/common/visions-resources.service";
import {VisionsResources} from "../../../interfaces/common/visions-resources.interface";
import {PhotoService} from "../../../services/common/photo.service";
import {Photo} from "../../../interfaces/common/photo.interface";
import {Popup} from "../../../interfaces/common/popup.interface";
import {PdfViewerComponent} from "../../../shared/dialog-view/pdf-viewer/pdf-viewer.component";
import {SlicePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-photo-gallary',
  templateUrl: './photo-gallary.component.html',
  imports: [
    RouterLink,
    SlicePipe,
    TranslatePipe
  ],
  styleUrls: ['./photo-gallary.component.scss'],

})
export class PhotoGallaryComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  @ViewChild('pdfViewer', {static: false}) pdfViewer!: TemplateRef<any>;

  // Signal-based state
  isChangeLanguage = signal<boolean>(false);
  language = signal<string>('');
  photo = signal<Photo[]>([]);
  popup = signal<Popup | null>(null);
  isLoading = signal<boolean>(true);
  bookData = signal<any>(null);
  visionsResources = signal<VisionsResources[]>([]);
  tag = signal<Tag[]>([]);
  isChangeLanguageToggle = signal<string>('en');
  showcase = signal<Showcase[]>([]);
  currentLang = signal<string>('en'); // Local signal for reactive language tracking

  // Computed signals for derived state
  currentLanguage = computed(() => this.currentLang());
  isEnglish = computed(() => this.currentLang() === 'en');
  isBengali = computed(() => this.currentLang() === 'bn');

  // Computed signals for UI state
  hasPhotos = computed(() => this.photo().length > 0);
  hasVisionsResources = computed(() => this.visionsResources().length > 0);
  hasShowcase = computed(() => this.showcase().length > 0);
  isLoadingComplete = computed(() => !this.isLoading());

  // Input signals for better reactivity
  languageParam = input<string>('');

  // Angular 20 dependency injection
  private destroyRef = inject(DestroyRef);
  private matDialog = inject(MatDialog);
  private conferenceService = inject(ConferenceService);
  private activatedRoute = inject(ActivatedRoute);
  private tagService = inject(TagService);
  private translateService = inject(TranslateService);
  private photoService = inject(PhotoService);
  private visionsResourcesService = inject(VisionsResourcesService);
  private showcaseService = inject(ShowcaseService);
  constructor() {
    // Angular 20 lifecycle hooks
    afterNextRender(() => {
    });
  }

  ngOnInit(): void {
    // Initialize language from translateService
    this.currentLang.set(this.translateService.currentLang || 'en');

    // Angular 20 reactive approach with takeUntilDestroyed
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        const lang = qParam.get('language') || '';
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

    this.getAllTag();
    this.getAllVisionsResourcess();
    this.getAllPhotos();
    this.getAllShowcase();
  }

  // private getAllTag() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     _id: 1,
  //     queti: 1,
  //     pointQuenty: 1,
  //     pointDescription: 1,
  //     pointQuenty2: 1,
  //     pointDescription2: 1,
  //     quetiEn: 1,
  //     pointQuentyEn: 1,
  //     pointDescriptionEn: 1,
  //     pointQuenty2En: 1,
  //     pointDescription2En: 1,
  //     pointLink2: 1,
  //     pointLink: 1,
  //     image: 1,
  //     pointQuenty3: 1,
  //     pointDescription3: 1,
  //     pointQuenty3En: 1,
  //     pointDescription3En: 1,
  //     pointLink3: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //
  //   this.subDataSix = this.tagService.getAllTags(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         // console.log('res', res.data)
  //         if (res.success) {
  //           this.tag = res.data;
  //         }
  //       },
  //       error: error => {
  //         console.log(error);
  //       }
  //     });
  // }

  private getAllTag(): void {
    this.tagService.getAllTag()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.tag.set(res.data);
        },
        error: err => {
          this.handleError(err, 'getAllTag');
        }
      });
  }

  openPdfViewerDialog(data: any) {
    const dialogConfig = new MatDialogConfig();
    this.bookData.set(data);
    dialogConfig.width = '100%';
    dialogConfig.panelClass = ['dialog-no-padding', 'full-screen-modal'];
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.matDialog.open(this.pdfViewer, dialogConfig);
  }

  //View pdf
  viewPdf(url: any) {
    this.matDialog.open(PdfViewerComponent, {
      data: url,
      maxWidth: "1000px",
      width: "100%",
      // maxHeight: "710px",
      // panelClass: ['dialog', 'social-dialog']
    });
  }

  // private getAllVisionsResourcess(loadMore?: boolean) {
  //
  //   const pagination: Pagination = {
  //     pageSize: 2,
  //     currentPage: 0
  //   };
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     imageEn: 1,
  //     description: 1,
  //     descriptionEn: 1,
  //     informations: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: pagination,
  //     filter: {pages: "books"},
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.subDataOne = this.visionsResourcesService.getAllVisionsResourcess(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.visionsResources = res.data;
  //         }
  //       },
  //       error: error => {
  //         // this.isLoading = false;
  //         console.log(error);
  //       }
  //     });
  // }

  private getAllVisionsResourcess(): void {
    this.visionsResourcesService.getAllVisions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.visionsResources.set(res.data);
          this.isLoading.set(false);
        },
        error: err => {
          this.handleError(err, 'getAllVisionsResourcess');
        }
      });
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

  private getAllShowcase(): void {
    this.showcaseService.getAllCarousel()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.showcase.set(res.data);
          this.isLoading.set(false);
        },
        error: err => {
          this.handleError(err, 'getAllShowcase');
        }
      });
  }

  // private getAllPhotos() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     images: 1,
  //     _id: 1,
  //     slug: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //
  //   this.subDataThree = this.photoService.getAllPhotos(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.photo = res.data;
  //         }
  //       },
  //       error: error => {
  //         console.log(error);
  //       }
  //     });
  // }


  private getAllPhotos(): void {
    this.photoService.getAllPhoto()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.photo.set(res.data);
          // this.isLoading.set(false);
        },
        error: err => {
          this.handleError(err, 'getAllPhotos');
        }
      });
  }


  onCancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.matDialog.closeAll();
  }

  // Angular 20 utility methods
  getImageUrl(item: any, isEnglish: boolean): string {
    return isEnglish ? item?.image : item?.imageEn;
  }

  getDescription(item: any, isEnglish: boolean): string {
    return isEnglish ? item?.description : item?.descriptionEn;
  }

  // Error handling with signals
  private handleError(error: any, context: string): void {
    this.isLoading.set(false);
    // You could also set an error signal here for UI feedback
  }

  // Refresh data method
  refreshData(): void {
    this.isLoading.set(true);
    this.getAllTag();
    this.getAllVisionsResourcess();
    this.getAllPhotos();
    this.getAllShowcase();
  }
  /**
   * ON Destroy - Angular 20 with takeUntilDestroyed handles cleanup automatically
   */
  ngOnDestroy() {
    // No need for manual subscription cleanup with takeUntilDestroyed

  }
}
