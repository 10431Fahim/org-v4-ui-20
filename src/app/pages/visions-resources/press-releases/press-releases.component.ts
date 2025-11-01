import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { OurService } from '../../../interfaces/common/our-service.interface';
import { FilterData } from '../../../interfaces/gallery/filter-data';
import { OurServiceService } from '../../../services/common/our-service.service';
import { Pagination } from "../../../interfaces/core/pagination";
import { SocialShareComponent } from "../../../shared/components/ui/social-share/social-share.component";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-press-releases',
  templateUrl: './press-releases.component.html',
  imports: [
    RouterLink,
    DatePipe,
    TranslatePipe
  ],
  styleUrls: ['./press-releases.component.scss'],
  standalone: true,
})
export class PressReleasesComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  isLoadMore = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(1);
  totalProducts = signal<number>(0);
  productsPerPage = signal<number>(6);
  totalProductsStore = signal<number>(0);
  ourService = signal<OurService[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasOurService = computed(() => this.ourService().length > 0);
  ourServiceItems = computed(() => this.ourService());
  canLoadMore = computed(() => this.totalProducts() > this.ourService().length);
  showLoadMore = computed(() => this.canLoadMore() && !this.isLoadMore());
  isLanguageBengali = computed(() => this.translateService.currentLang === 'bn');

  // Subscriptions
  private subDataThree!: Subscription;

  // Services injected using inject() function for Angular 20
  private ourServiceService = inject(OurServiceService);
  public translateService = inject(TranslateService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getAllOurService();
  }


  private getAllOurService(loadMore?: boolean): void {
    // Select fields for the query
    const mSelect = {
      name: 1,
      nameEn: 1,
      image: 1,
      shortDescription: 1,
      shortDescriptionEn: 1,
      descriptionShortEn: 1,
      descriptionShort: 1,
      createdBy: 1,
      _id: 1,
      slug: 1,
      createdAt: 1
    };

    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage()),
      currentPage: Number(this.currentPage()) - 1
    };

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 }
    };

    this.ourServiceService.getAllOurServices(filterData, undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false);
          this.isLoadMore.set(false);
          
          if (loadMore) {
            this.ourService.update(current => [...current, ...res.data]);
          } else {
            this.ourService.set(res.data);
          }
          this.totalProducts.set(res.count);
        },
        error: (error: any) => {
          console.error('Error fetching press releases:', error);
          this.isLoading.set(false);
          this.isLoadMore.set(false);
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
      this.getAllOurService(true);
    }
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
      data: this.router.url,
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    });
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }
}
