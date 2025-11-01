import { Component, OnInit } from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {ShowcaseService} from '../../../services/common/showcase.service';
import {Showcase} from '../../../interfaces/common/showcase.interface';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  imports: [
    NgForOf,
    MatButton,
    RouterLink,
    TranslatePipe
  ],
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  showcase: Showcase[] = [];
  // Subscriptions
  private subDataOne!: Subscription;
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'bn';
  constructor(
    private showcaseService: ShowcaseService,
    public translateService: TranslateService,
  ) { }

  ngOnInit(): void {

     this.getAllShowcase();

  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage = language === 'en';
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string){
     if(this.isChangeLanguageToggle !== language){
           this.isChangeLanguageToggle = language;
           this.isChangeLanguage = true;
           this.translateService.use(this.isChangeLanguageToggle);
     }
     else{
      this.isChangeLanguageToggle = 'bn';
      this.isChangeLanguage = false;
      this.translateService.use(this.isChangeLanguageToggle);
     }
  }

  /**
   * HTTP REQ HANDLE
   * getAllShowcase()
   */

    // private getAllShowcase() {
    //   // Select
    //   const mSelect = {
    //     image: 1,
    //     title: 1,
    //     description: 1,
    //     titleEn: 1,
    //     descriptionEn: 1
    //   }
    //
    //   const filterData: FilterData = {
    //     pagination: null,
    //     filter: null,
    //     select: mSelect,
    //     sort: { createdAt: -1 }
    //   }
    //
    //   this.subDataOne = this.showcaseService.getAllShowcases(filterData, null)
    //     .subscribe({
    //       next: res => {
    //         if (res.success) {
    //           this.showcase = res.data;
    //         }
    //       },
    //       error: error => {
    //         // console.log(error);
    //       }
    //     });
    // }


  private getAllShowcase(): void {
    this.subDataOne = this.showcaseService.getAllCarousel()
      .subscribe({
        next: (res: any) => {
          this.showcase = res.data;
        },
        error: (err: any) => {
          console.error(err);
        }
      });
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

  }

}
