import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subscription} from "rxjs";
import {Review} from "../../../interfaces/common/review.interface";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ReviewService} from "../../../services/common/review.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {SocialShareComponent} from "../../../shared/components/ui/social-share/social-share.component";
import {NewsDetailsLoaderComponent} from '../../../shared/loader/news-details-loader/news-details-loader.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {NewsCardOneLoaderComponent} from '../../../shared/loader/news-card-one-loader/news-card-one-loader.component';


@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  imports: [
    NewsDetailsLoaderComponent,
    NgIf,
    SafeHtmlCustomPipe,
    RouterLink,
    NewsCardOneLoaderComponent,
    DatePipe,
    TranslatePipe,
    NgForOf,
  ],
  standalone:true,
  styleUrls: ['./test-details.component.scss'],

})
export class TestDetailsComponent implements OnInit {
  // Subscriptions
  private subDataOne!: Subscription;
  private subRouteOne!: Subscription;
  private subDataFour!: Subscription;
  reviewData: Review[] = [];

  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';
  // Store Data
  id?: | any;
  language: | any;
  review?: Review;

  // Loading
  isLoading: boolean = true;
  isLoadingRelated: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private reviewService: ReviewService,
    public translateService: TranslateService,
    private dialog: MatDialog,

  ) {
  }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.activatedRoute.queryParamMap.subscribe(qPram => {
        this.language = qPram.get('language');

        this.id = param.get('id');
        if (this.id) {
          this.getReviewById(this.id);
        }
      })
    });
  }

  getReviewById(id: any) {
    // this.spinnerService.show();
    this.subDataOne = this.reviewService.getReviewById(id)
      .subscribe(res => {
        this.isLoading = false;
        this.review = res.data;
        this.getAllOurReviews()
      }, error => {
        this.isLoading = false;
        // console.log(error);
      });
  }


  private getAllOurReviews() {
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      image: 1,
      seoImage: 1,

      // shortDescription: 1,
      description: 1,
      descriptionEn: 1,
      createdBy: 1,
      _id: 1,
      createdAt: 1
    }

    const filterData: FilterData = {
      pagination: {pageSize: 6, currentPage: 0},
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    }

    this.subDataFour = this.reviewService.getAllReviews(filterData, null)
      .subscribe({
        next: res => {
          this.isLoadingRelated = false;
          if (res.success) {
            this.reviewData = res.data.filter(f => f._id !== this.id);;
          }
        },
        error: error => {
          this.isLoadingRelated = false;
          // console.log(error);
        }
      });
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage = language === 'bn';
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
    if (this.isChangeLanguageToggle !== language) {
      this.isChangeLanguageToggle = language;
      this.isChangeLanguage = true;
      this.translateService.use(this.isChangeLanguageToggle);
    } else {
      this.isChangeLanguageToggle = 'en';
      this.isChangeLanguage = false;
      this.translateService.use(this.isChangeLanguageToggle);
    }
  }



  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */




  openDialog() {
    this.dialog.open(SocialShareComponent, {
      data: this.review,
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    })
  }



}
