import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, OnInit, OnDestroy} from '@angular/core';
import {Showcase} from "../../../interfaces/common/showcase.interface";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ConferenceService} from "../../../services/common/conference.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ShowcaseService} from "../../../services/common/showcase.service";
import {TagService} from "../../../services/common/tag.service";
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  imports: [
    NgIf,
    RouterLink,
    NgForOf,
    TranslatePipe,
  ],
  styleUrls: ['./points.component.scss'],

})
export class PointsComponent implements OnInit, OnDestroy {
  isChangeLanguage: boolean = false;
  language:any;
  isChangeLanguageToggle: string = 'en';
  @Input() showcase: Showcase[] = [];
  
  // Angular 20 Signals for reactive state management
  tag = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  
  // Computed signals
  hasTags = computed(() => this.tag().length > 0);
  
  // Subscriptions
  private subDataSix!: Subscription;
  constructor(
    private matDialog: MatDialog,
    private conferenceService: ConferenceService,
    private activatedRoute: ActivatedRoute,
    private tagService: TagService,
    public translateService: TranslateService,
    private showcaseService: ShowcaseService,

  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })
    this.getAllTag();
  }

  // private getAllTag() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     _id: 1,
  //     queti: 1,
  //     pointQuenty: 1,
  //     pointDescription: 1,
  //     pointQuenty2: 1,
  //     pointDescription2: 1,
  //     quetiEn: 1,
  //     pointQuentyEn: 1,
  //     pointDescriptionEn: 1,
  //     pointQuenty2En: 1,
  //     pointDescription2En: 1,
  //     pointLink2: 1,
  //     pointLink: 1,
  //     image: 1,
  //     pointQuenty3: 1,
  //     pointDescription3: 1,
  //     pointQuenty3En: 1,
  //     pointDescription3En: 1,
  //     pointLink3: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //
  //   this.subDataSix = this.tagService.getAllTags(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         // console.log('res', res.data)
  //         if (res.success) {
  //           this.tag = res.data;
  //         }
  //       },
  //       error: error => {
  //         console.log(error);
  //       }
  //     });
  // }

  private getAllTag(): void {
    this.isLoading.set(true);
    this.subDataSix = this.tagService.getAllTag()
      .subscribe({
        next: res => {
          this.tag.set(res.data);
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  /**
   * Download pdf functionality
   * onDownloadPdf()
   */
  async onDownloadPdf(url: string) {
    const bnUrl = (url === 'bangla')
      ? '/assets/pdf/31 Points Bangla 50k.pdf'
      : '/assets/pdf/31 Points English 2.5k.pdf';

    const data = await fetch( bnUrl);
    const blob = await data.blob();
    const objectUrl = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.setAttribute('href', objectUrl)
    link.download = `${url === 'bangla' ? '31 Points Bangla 50k' : '31 Points English 2.5k'}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  }

  ngOnDestroy(): void {
    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
  }
}
