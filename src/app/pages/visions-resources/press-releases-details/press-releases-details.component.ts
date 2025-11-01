

import {Component, Inject, OnInit, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import {OurService} from '../../../interfaces/common/our-service.interface';
import {OurServiceService} from '../../../services/common/our-service.service';
import {StoryService} from '../../../services/common/story.service';
import {FilterData} from '../../../interfaces/core/filter-data';
import {DatePipe, isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {SwiperComponent} from '../../../shared/components/swiper/swiper.component';



@Component({
  selector: 'app-press-releases-details',
  templateUrl: './press-releases-details.component.html',
  imports: [
    TranslatePipe,
    RouterLink,
    NgIf,
    DatePipe,
    SafeHtmlCustomPipe,
    NgForOf,
    SwiperComponent,
  ],
  styleUrls: ['./press-releases-details.component.scss'],

  standalone: true,
})
export class PressReleasesDetailsComponent implements OnInit {
  // Subscriptions
  private subDataOne!: Subscription;
  private subRouteOne!: Subscription;
// Store Data
  ourServicess: OurService[] = [];
// Subscriptions
  private subDataThree!: Subscription;

  // Store Data
  id?: any;
  sub: any;
  ourService?: OurService;
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';

  // Swiper breakpoints configuration for related press releases
  swiperBreakpoints = {
    '520': { visibleSlides: 2, gap: 15 },
    '768': { visibleSlides: 2.3, gap: 15 },
    '1000': { visibleSlides: 2.5, gap: 20 },
    '1150': { visibleSlides: 2.5, gap: 20 },
    '1180': { visibleSlides: 3, gap: 20 },
    '1200': { visibleSlides: 3, gap: 20 }
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private ourServiceService: OurServiceService,
    private storyService: StoryService,
    public translateService: TranslateService,
    @Inject(PLATFORM_ID) private pid: Object
  ) { }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.activatedRoute.queryParamMap.subscribe(qPram => {
        this.sub = qPram.get('sub');
        this.id = param.get('id');
        if (this.id) {
          this.getPressById(this.id);


        }
      })
    });
    this.getAllOurService()

    // Debug: Log current breakpoints
    console.log('Press Releases Details Swiper Breakpoints:', this.swiperBreakpoints);
  }


  get isBrowser() { return isPlatformBrowser(this.pid); }

  getPressById(id:any) {
    // this.spinnerService.show();
    this.subDataOne = this.ourServiceService.getOurServiceById(id)
      .subscribe(res => {
        this.ourService = res.data;
      }, error => {
        // this.spinnerService.hide();
        // console.log(error);
      });
  }





  private getAllOurService() {
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      image: 1,
      shortDescription: 1,
      description:1,
      shortDescriptionEn: 1,
      descriptionEn:1,
      createdBy:1,
      _id: 1,
      slug: 1,
      createdAt: 1
    }

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 }
    }

    this.subDataThree = this.ourServiceService.getAllOurServices(filterData, null)
      .subscribe({
        next: res => {
          if (res.success) {
            this.ourServicess = res.data;
          }
        },
        error: error => {
          // console.log(error);
        }
      });
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
