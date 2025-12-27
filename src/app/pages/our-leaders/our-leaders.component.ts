import {Component, OnDestroy, OnInit} from '@angular/core';
import {Portfolio} from '../../interfaces/common/portfolio.interface';
import {PortfolioService} from '../../services/common/portfolio.service';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {SeoPage} from "../../interfaces/common/seo-page.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";
import {CanonicalService} from "../../services/common/canonical.service";
import {SeoPageService} from "../../services/common/seo-page.service";
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-our-leaders',
  templateUrl: './our-leaders.component.html',
  imports: [
    NgIf,
    RouterLink,
    NgForOf
  ],
  standalone:true,
  styleUrls: ['./our-leaders.component.scss']})
export class OurLeadersComponent implements OnInit, OnDestroy {

  // Store Data
  seoPage: SeoPage | any;
  language: any;
  portfolio: Portfolio[] = [];

  // Subscriptions
  private subDataOne!: Subscription;
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';
  constructor(
    private portfolioService: PortfolioService,
    public translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private canonicalService: CanonicalService,
    private seoPageService: SeoPageService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })
    this.getAllPortfolio()

    // Seo
    this.getSeoPageByPageWithCache();

  }

  /**
   * HTTP REQ HANDLE
   * getSeoPageByPageWithCache()
   * getAllPortfolio()
   */
  private getSeoPageByPageWithCache() {
    const select = 'name nameEn image seoDescription keyWord pageName'
    this.seoPageService.getSeoPageByPageWithCache('our-leaders', select)
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



  // private getAllPortfolio() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     description: 1,
  //     nameEn: 1,
  //     descriptionEn: 1,
  //     leaders: 1,
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //
  //   this.subDataOne = this.portfolioService.getAllPortfolios(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.portfolio = res.data;
  //           // console.log('this.portfolio',this.portfolio);
  //         }
  //       },
  //       error: error => {
  //         // console.log(error);
  //       }
  //     });
  // }

  private getAllPortfolio(): void {
    this.subDataOne = this.portfolioService.getAllPortfolio()
      .subscribe({
        next: res => {
          this.portfolio = res.data;
        },
        error: err => {
          console.error(err);
        }
      });
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
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
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
    this.meta.updateTag({property: 'og:image:width', content: '300'});
    this.meta.updateTag({property: 'og:image:height', content: '300'});
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

  onChangeLanguage(language: string) {
    this.isChangeLanguage = language === 'bn';
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string){
     if(this.isChangeLanguageToggle !== language){
           this.isChangeLanguageToggle = language;
           this.isChangeLanguage = true;
           this.translateService.use(this.isChangeLanguageToggle);
     }
     else{
      this.isChangeLanguageToggle = 'en';
      this.isChangeLanguage = false;
      this.translateService.use(this.isChangeLanguageToggle);
     }
  }


  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
