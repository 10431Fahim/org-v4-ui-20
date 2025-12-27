import {Component, ElementRef, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, OnInit, OnDestroy} from '@angular/core';
import {Showcase} from "../../../interfaces/common/showcase.interface";
import {MatDialog} from "@angular/material/dialog";
import {ConferenceService} from "../../../services/common/conference.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {PortfolioService} from "../../../services/common/portfolio.service";
import {Subscription} from "rxjs";
import {NgForOf, NgIf} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-our-leader',
  templateUrl: './our-leader.component.html',
  imports: [
    RouterLink,
    NgIf,
    SafeHtmlCustomPipe,
    NgForOf,
    TranslatePipe
  ],
  standalone:true,
  styleUrls: ['./our-leader.component.scss'],

})
export class OurLeaderComponent implements OnInit, OnDestroy {
  @ViewChild('section2') section2!:ElementRef;
  isChangeLanguage: boolean = false;
  language: any;
  isChangeLanguageToggle: string = 'en';

  // Angular 20 Signals for reactive state management
  portfolio = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  // Computed signals
  firstPortfolio = computed(() => this.portfolio()[0] || null);
  hasLeaders = computed(() => this.firstPortfolio()?.leaders?.length > 0);
  leadersToShow = computed(() => this.firstPortfolio()?.leaders?.slice(0, 3) || []);

  private subDataTwo!: Subscription;
  constructor(
    private matDialog: MatDialog,
    private conferenceService: ConferenceService,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService,
    private portfolioService: PortfolioService,

  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe(qPram => {
      this.language = qPram.get('language');
    })
    this.getAllPortfolio()
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
  //   this.subDataTwo = this.portfolioService.getAllPortfolios(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.portfolio = res.data;
  //         }
  //       },
  //       error: error => {
  //         console.log(error);
  //       }
  //     });
  // }


  private getAllPortfolio(): void {
    this.isLoading.set(true);
    this.subDataTwo = this.portfolioService.getAllPortfolio()
      .subscribe({
        next: res => {
          this.portfolio.set(res.data);
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
  }
}
