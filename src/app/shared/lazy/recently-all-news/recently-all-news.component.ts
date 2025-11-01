import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Review} from '../../../interfaces/common/review.interface';
import {ReviewService} from '../../../services/common/review.service';
import {RecentlyNewsLoaderComponent} from '../../loader/recently-news-loader/recently-news-loader.component';
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-recently-all-news',
  templateUrl: './recently-all-news.component.html',
  imports: [
    RecentlyNewsLoaderComponent,
    RouterLink,
    TranslatePipe,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./recently-all-news.component.scss']
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
