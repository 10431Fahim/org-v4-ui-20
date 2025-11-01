import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AdditionalPageService } from '../../services/core/additional-page.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import {NgForOf, NgIf} from '@angular/common';
import {TenPointsService} from '../../services/common/ten-points.service';
import {TenPoints} from '../../interfaces/common/ten-points.interface';
import {NgxSpinnerService} from 'ngx-spinner';
import {CanonicalService} from '../../services/common/canonical.service';
@Component({
  selector: 'app-teen-dofa',
  templateUrl: './teen-dofa.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./teen-dofa.component.scss']})
export class TeenDofaComponent implements OnInit, OnDestroy {

  slug: any = null;
  pageInfo: any = '';
  msg = '';

  isLoading: boolean = true;
  language: any;


  tenPoints: TenPoints[] | any[] = [];

  // Subscriptions
  private subRouteOne!: Subscription;
  private subDataThree!: Subscription;
  private subDataOne!: Subscription;
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';
  constructor(
    private activatedRoute: ActivatedRoute,
    private additionalPageService: AdditionalPageService,
    private spinnerService: NgxSpinnerService,
    public translateService: TranslateService,
    private tenPointsService: TenPointsService,
    private title: Title,
    private meta: Meta,
    private router: Router,
    private canonicalService: CanonicalService) {
  }

  ngOnInit(): void {


    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })

    this.subRouteOne = this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getAllTenPointss();
    });

  }

  /**
   * HTTP REQ HANDLE
   * getPageInfo()
   */



  // getAllTenPointss() {
  //
  //   this.spinnerService.show();
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: {
  //       name: 1,
  //       description: 1,
  //       nameEn: 1,
  //       descriptionEn: 1,
  //       websiteUrl: 1,
  //       slug: 1,
  //       informations: 1,
  //       image: 1,
  //       seoImage: 1,
  //       createdAt: 1,
  //       tenPointsCategory: 1
  //     },
  //     sort: {
  //       createdAt: -1
  //     }
  //   }
  //
  //   this.subDataOne = this.tenPointsService.getAllTenPointss(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         this.tenPoints = res.data;
  //         if (this.tenPoints) {
  //           if (this.language === 'bn') {
  //             this.updateMetaDataBn();
  //           }
  //         else {
  //             this.updateMetaData();
  //           }
  //         }
  //
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         // console.log(err)
  //       }
  //     })
  // }

  private getAllTenPointss(): void {
    this.tenPointsService.getAllTenPoints()
      .subscribe({
        next: res => {
          this.tenPoints = res.data;
          this.isLoading = false;
          if (this.tenPoints) {
            if (this.language === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
          },
        error: err => {
          console.error(err);
          this.isLoading = false;
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
    }
    else {
      this.isChangeLanguageToggle = 'bn';
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
    this.title.setTitle(this.tenPoints[0]?.name);
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: this.tenPoints[0]?.description});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: this.tenPoints[0]?.name });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: this.tenPoints[0]?.seoImage });
    this.meta.updateTag({ property: 'og:description', content: this.tenPoints[0]?.description});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: this.tenPoints[0]?.name });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: this.tenPoints[0]?.seoImage });
    this.meta.updateTag({name: 'twitter:description', content: this.tenPoints[0]?.description});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: this.tenPoints[0]?.seoImage});

    // Canonical
    this.canonicalService.setCanonicalURL();

  }

  private updateMetaDataBn() {
    // Title
    this.title.setTitle(this.tenPoints[0]?.nameEn);
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: this.tenPoints[0]?.descriptionEn});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: this.tenPoints[0]?.nameEn });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: this.tenPoints[0]?.seoImage });
    this.meta.updateTag({ property: 'og:description', content: this.tenPoints[0]?.descriptionEn});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: this.tenPoints[0]?.nameEn });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: this.tenPoints[0]?.seoImage });
    this.meta.updateTag({name: 'twitter:description', content: this.tenPoints[0]?.descriptionEn});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: this.tenPoints[0]?.seoImage});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }
  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }


}
