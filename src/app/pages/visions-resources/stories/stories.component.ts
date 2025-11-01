import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Story} from '../../../interfaces/common/story.interface';
import {StoryService} from '../../../services/common/story.service';
import {RouterLink} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  imports: [
    RouterLink,
    DatePipe,
    TranslatePipe
  ],
  styleUrls: ['./stories.component.scss'],

})
export class StoriesComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  isLoadMore = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(1);
  totalProducts = signal<number>(0);
  productsPerPage = signal<number>(6);
  totalProductsStore = signal<number>(0);
  story = signal<Story[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasStories = computed(() => this.story().length > 0);
  storiesToShow = computed(() => this.story());
  canLoadMore = computed(() => this.totalProducts() > this.story().length);
  showLoadMore = computed(() => this.canLoadMore() && !this.isLoadMore());

  // Subscriptions
  private subDataThree!: Subscription;

  // Services injected using inject() function for Angular 20
  private storyService = inject(StoryService);
  public translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getAllStory()
  }

  //
  // private getAllStory(loadMore?: boolean) {
  //
  //   const pagination: Pagination = {
  //     pageSize: Number(this.productsPerPage),
  //     currentPage: Number(this.currentPage) - 1
  //   };
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     shortDescription: 1,
  //     description: 1,
  //     shortDescriptionEn: 1,
  //     descriptionEn: 1,
  //     createdBy: 1,
  //     _id: 1,
  //     slug: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: pagination,
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.subDataThree = this.storyService.getAllStorys(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         this.isLoadMore = false;
  //         // if (res.success) {
  //         //   this.story = res.data;
  //         // }
  //         if (loadMore) {
  //           this.story = [...this.story, ...res.data];
  //         } else {
  //           this.story = res.data;
  //         }
  //         this.totalProducts = res.count;
  //
  //       },
  //       error: error => {
  //         this.isLoading = false;
  //         // console.log(error);
  //       }
  //     });
  // }

  private getAllStory(): void {
    this.storyService.getAllStory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.isLoadMore.set(false);
          this.story.set(res.data);
        },
        error: err => {
          console.error('Error fetching stories:', err);
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

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }
}