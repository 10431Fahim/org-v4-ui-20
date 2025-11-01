import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../shared/pipes/safe-html.pipe';
import {FilterData} from '../../interfaces/core/filter-data';
import {About} from '../../interfaces/common/about.interface';
import {AboutService} from '../../services/common/about.service';

@Component({
  selector: 'app-presidency-details',
  templateUrl: './presidency-details.component.html',
  imports: [
    NgIf,
    SafeHtmlCustomPipe,
    NgForOf,
    SlicePipe
  ],
  styleUrls: ['./presidency-details.component.scss'],

})
export class PresidencyDetailsComponent implements OnInit, OnDestroy {


  about: About[] | null = null;
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';
  // Subscriptions
  private subDataOne!: Subscription;

  constructor(
    private aboutService: AboutService,
    public translateService: TranslateService,

  ) {
  }

  ngOnInit(): void {
    this.getAllAbouts();
  }

  private getAllAbouts() {
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      image: 1,
      description: 1,
      descriptionEn: 1,
      informations: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {createdAt: -1}
    }

    this.subDataOne = this.aboutService.getAllAbouts(filterData, null)
      .subscribe({
        next: res => {
          if (res.success) {
            this.about = res.data;

          }
        },
        error: error => {
          // console.log(error);
        }
      });
  }

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
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

}
