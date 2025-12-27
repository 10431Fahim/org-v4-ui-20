import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Review} from '../../../interfaces/common/review.interface';
import {ReviewService} from '../../../services/common/review.service';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {RecentlyNewsLoaderModule} from '../../loader/recently-news-loader/recently-news-loader.module';

@Component({
  selector: 'app-recently-all-news',
  templateUrl: './recently-all-news.component.html',
  imports: [
    RouterLink,
    TranslatePipe,
    NgForOf,
    NgIf,
    RecentlyNewsLoaderModule
  ],
  standalone:true,
  styleUrls: ['./recently-all-news.component.scss'],
  host: {
    'ngSkipHydration': 'true'
  }
})
export class RecentlyAllNewsComponent implements OnInit, OnDestroy {

  review: Review[] = [];
  isLoading: boolean = false;

  private subDataFour!: Subscription;
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';

  constructor(
    private reviewService: ReviewService,
    public translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getAllNews();
  }

  ngOnDestroy(): void {
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
  }

  // private getAllOurReviews() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     image2: 1,
  //     shortDescription: 1,
  //      shortDescriptionEn: 1,
  //     _id: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: {pageSize: 4, currentPage: 0},
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
  //   this.isLoading = true;
  //   this.subDataFour = this.reviewService.getAllReviews(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         if (res.success) {
  //           this.review = res.data;
  //         }
  //       },
  //       error: error => {
  //         this.isLoading = false;
  //         console.log(error);
  //       }
  //     });
  // }

  private getAllNews(): void {
    this.isLoading = true;
    this.subDataFour = this.reviewService.getAllNews()
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.review = res.data;
          }
          this.cdr.detectChanges();
        },
        error: err => {
          this.isLoading = false;
          console.error(err);
          this.cdr.detectChanges();
        }
      });
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage = language === 'en';
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
    if (this.isChangeLanguageToggle !== language) {
      this.isChangeLanguageToggle = language;
      this.isChangeLanguage = true;
      this.translateService.use(this.isChangeLanguageToggle);
    } else {
      this.isChangeLanguageToggle = 'bn';
      this.isChangeLanguage = false;
      this.translateService.use(this.isChangeLanguageToggle);
    }
  }
}
