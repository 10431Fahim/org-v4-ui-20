import {Component, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../services/common/canonical.service";
import {SeoPageService} from "../../services/common/seo-page.service";
import {NewsCardOneLoaderComponent} from '../../shared/loader/news-card-one-loader/news-card-one-loader.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Review} from '../../interfaces/common/review.interface';
import {ReviewService} from '../../services/common/review.service';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  imports: [
    NewsCardOneLoaderComponent,
    RouterLink,
    DatePipe,
    TranslatePipe,
    NgIf,
    NgForOf
  ],
  standalone:true,
  styleUrls: ['./all-news.component.scss']})
export class AllNewsComponent implements OnInit {

  // Store Data
  seoPage: SeoPage | any;
  language: | any;

  private subDataFour: Subscription | any;
  review: Review[] = [];
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';

  // Loading
  isLoading: boolean = true;

  constructor(
    private reviewService: ReviewService,
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private router: Router,
    private canonicalService: CanonicalService,
    private seoPageService: SeoPageService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })
// Seo
    this.getSeoPageByPageWithCache();

    this.getAllNotices()
  }

  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllOurReviews()
   */

  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName'
   this.seoPageService.getSeoPageByPageWithCache('all-news', select)
      .subscribe({
        next: res => {
          this.seoPage = res;
          if (this.seoPage) {
            if (this.language === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }

        },
        error: err => {
          // console.log(err);
        }
      })
  }


  // private getAllOurReviews() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     // shortDescription: 1,
  //     // description:1,
  //     // descriptionEn:1,
  //     createdBy: 1,
  //     _id: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: {createdAt: -1}
  //   }
  //
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
  //         // console.log(error);
  //       }
  //     });
  // }

  private getAllNotices(): void {
    this.reviewService.getAllNewsData()
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.review = res.data;
        },
        error: err => {
          this.isLoading = false;
          console.error(err);
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

  private updateMetaData() {
    // Title
    this.title.setTitle(this.seoPage?.name);

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: this.seoPage?.seoDescription});
    this.meta.updateTag({name: 'keywords', content: this.seoPage?.keyWord});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: this.seoPage?.name});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: this.seoPage?.image});
    // this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({ property: 'og:image:width', content: '1200' }); // Recommended width
    this.meta.updateTag({ property: 'og:image:height', content: '630' }); // Recommended height
    this.meta.updateTag({property: 'og:description', content: this.seoPage?.seoDescription});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: this.seoPage?.name});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: this.seoPage?.seoDescription});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: this.seoPage?.image});

    // Canonical
    this.canonicalService.setCanonicalURL();

  }

  private updateMetaDataBn() {
    // Title
    this.title.setTitle(this.seoPage?.nameEn);

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: this.seoPage?.seoDescription});
    this.meta.updateTag({name: 'keywords', content: this.seoPage?.keyWord});

    // Open Graph(og:)
    this.meta.updateTag({property: 'og:title', content: this.seoPage?.nameEn});
    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({property: 'og:image', content: this.seoPage?.image});
    // this.meta.updateTag({property: 'og:image:type', content: 'image/jpeg'});
    this.meta.updateTag({ property: 'og:image:width', content: '1200' }); // Recommended width
    this.meta.updateTag({ property: 'og:image:height', content: '630' }); // Recommended height
    this.meta.updateTag({property: 'og:description', content: this.seoPage?.seoDescription});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({name: 'twitter:title', content: this.seoPage?.nameEn});
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:description', content: this.seoPage?.seoDescription});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: this.seoPage?.image});

    // Canonical
    this.canonicalService.setCanonicalURL();

  }

}
