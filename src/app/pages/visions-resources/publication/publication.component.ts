import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, signal, computed, inject, DestroyRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {OurService} from "../../../interfaces/common/our-service.interface";
import {VisionsResources} from "../../../interfaces/common/visions-resources.interface";
import {VisionsResourcesService} from "../../../services/common/visions-resources.service";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SocialShareComponent} from "../../../shared/components/ui/social-share/social-share.component";
import {PdfViewerComponent} from "../../../shared/dialog-view/pdf-viewer/pdf-viewer.component";
import {NgForOf, NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  styleUrls: ['./publication.component.scss'],

})
export class PublicationComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  isLoadMore = signal<boolean>(false);
  pdfUrl = signal<any>(null);
  bookData = signal<any>(null);
  isLoading = signal<boolean>(true);
  contactsPerPage = signal<number>(3);
  totalContactsStore = signal<number>(0);
  currentPage = signal<number>(1);
  totalProducts = signal<number>(0);
  totalContacts = signal<number>(0);
  productsPerPage = signal<number>(6);
  totalProductsStore = signal<number>(0);
  ourServicess = signal<OurService[]>([]);
  id = signal<any>(null);
  sub = signal<any>(null);
  ourService = signal<OurService | null>(null);
  visionsResources = signal<VisionsResources[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasVisionsResources = computed(() => this.visionsResources().length > 0);
  visionsResourcesToShow = computed(() => this.visionsResources());
  canLoadMore = computed(() => this.totalProducts() > this.visionsResources().length);
  showLoadMore = computed(() => this.canLoadMore() && !this.isLoadMore());

  // PDF DIALOG
  @ViewChild('pdfViewer', {static: false}) pdfViewer!: TemplateRef<any>;

  // Subscriptions
  private subDataOne!: Subscription;
  private subRouteOne!: Subscription;
  private subDataThree!: Subscription;

  // Services injected using inject() function for Angular 20
  public dialog = inject(MatDialog);
  private matDialog = inject(MatDialog);
  private visionsResourcesService = inject(VisionsResourcesService);
  public translateService = inject(TranslateService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getAllVisionsResourcess();

    // GET PAGE FROM QUERY PARAM
    this.activatedRoute.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qParam => {
      if (qParam && qParam['page']) {
        this.currentPage.set(qParam['page']);
      } else {
        this.currentPage.set(1);
      }
      this.getAllVisionsResourcess();
    });
  }

  openPdfViewerDialog(data: any): void {
    const dialogConfig = new MatDialogConfig();
    this.bookData.set(data);
    dialogConfig.width = '100%';
    dialogConfig.panelClass = ['dialog-no-padding', 'full-screen-modal'];
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.matDialog.open(this.pdfViewer, dialogConfig);
  }

  onCancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.matDialog.closeAll();
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any): void {
    this.currentPage.set(event);
    this.router.navigate([], {queryParams: {page: event}});
  }

  // private getAllVisionsResourcess(loadMore?: boolean) {
  //
  //   const pagination: Pagination = {
  //     pageSize: Number(this.productsPerPage),
  //     currentPage: Number(this.currentPage) - 1
  //   };
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     url: 1,
  //     urlEn: 1,
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
  //         // this.isLoading = false;
  //         // this.isLoadMore = false;
  //         if (res.success) {
  //           this.visionsResources = res.data;
  //
  //           this.totalContacts = res.count;
  //         }
  //         //
  //         // if (loadMore) {
  //         //   this.visionsResources = [...this.visionsResources, ...res.data[0].informations];
  //         //   console.log('conference+++++++++', this.visionsResources)
  //         // } else {
  //         //   this.visionsResources = res.data[0].informations;
  //         //   console.log('conference+++++++++-*-----', this.visionsResources)
  //         // }
  //         // this.totalProducts = res.count;
  //         // console.log('conference+++++++++', this.totalProducts)
  //       },
  //       error: error => {
  //         // this.isLoading = false;
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
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Error fetching visions resources:', err);
          this.isLoading.set(false);
        }
      });
  }

  /**
   * LOAD MORE
   */
  onLoadMore(): void {
    if (this.canLoadMore()) {
      this.isLoadMore.set(true);
      this.currentPage.update(page => page + 1);
      // Note: Load more functionality would need to be implemented
      // based on the pagination logic that was commented out
      console.log('Load more functionality needs to be implemented');
    }
  }

  //View pdf
  viewPdf(url: any): void {
    console.log('Viewing PDF:', url);
    this.matDialog.open(PdfViewerComponent, {
      data: url,
      maxWidth: "1000px",
      width: "100%",
    });
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
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

  openDialog(): void {
    this.dialog.open(SocialShareComponent, {
      data: this.visionsResources(),
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    });
  }

}
