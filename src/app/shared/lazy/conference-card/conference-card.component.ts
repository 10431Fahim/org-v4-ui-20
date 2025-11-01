import { Component, OnInit } from '@angular/core';
import {Review} from "../../../interfaces/common/review.interface";
import {Subscription} from "rxjs";
import {ReviewService} from "../../../services/common/review.service";
import {TranslateService} from "@ngx-translate/core";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Conference} from "../../../interfaces/common/conference.interface";
import {ConferenceService} from "../../../services/common/conference.service";
import {Pagination} from "../../../interfaces/core/pagination";
import {RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-conference-card',
  templateUrl: './conference-card.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./conference-card.component.scss']
})
export class ConferenceCardComponent implements OnInit {

  isLoadMore = false;
  // Loading
  isLoading = true;
  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 8;
  totalProductsStore = 0;


  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';
  private subDataFive!: Subscription;
  safeURL!: SafeResourceUrl;
  conference: Conference[] = [];
  private subDataOne!: Subscription;
  constructor(
    private conferenceService: ConferenceService,
    private sanitizer: DomSanitizer,
    public translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.getAllConference();
  }


  private getAllConference(loadMore?: boolean) {
    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage),
      currentPage: Number(this.currentPage) - 1
    };
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      title: 1,
      titleEn: 1,
      image:1,
      _id: 1,
      createdAt: 1
    }

    const filterData: FilterData = {
      pagination: pagination,
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    }

    this.subDataFive = this.conferenceService.getAllConferences(filterData, undefined)
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.isLoadMore = false;
          if (loadMore) {
            this.conference = [...this.conference, ...res.data];
          } else {
            this.conference = res.data;
            // res.data.map((item) => {
            //   this.conference.push({...item, ...{safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(item.name)}})
            // })
          }
          this.totalProducts = res.count;

        }, error: error => {
          this.isLoading = false;
          console.log(error);
        }
      });
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  /**
   * LOAD MORE
   */
  onLoadMore() {
    if (this.totalProducts > this.conference.length) {
      this.isLoadMore = true;
      this.currentPage += 1;
      this.getAllConference(true);
    }
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

}
