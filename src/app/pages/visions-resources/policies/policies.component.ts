import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {SocialShareComponent} from "../../../shared/components/ui/social-share/social-share.component";
import {MatDialog} from "@angular/material/dialog";
import {NgForOf, NgIf} from '@angular/common';
import {AdditionalPageService} from '../../../services/core/additional-page.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./policies.component.scss'],

})
export class PoliciesComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  slug = signal<any>(null);
  pageInfo = signal<any>('');
  partyNameData = signal<any>(null);
  declarationData = signal<any>(null);
  constitutionData = signal<any>(null);
  principlesData = signal<any>(null);
  objectivesData = signal<any>(null);
  historyData = signal<any>(null);
  partyFlagData = signal<any>(null);
  sloganData = signal<any>(null);
  electoralSymbolData = signal<any>(null);
  partyMusicData = signal<any>(null);
  registrationData = signal<any>(null);
  msg = signal<string>('');
  allData = signal<any[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasPageInfo = computed(() => !!this.pageInfo());
  hasAllData = computed(() => this.allData().length > 0);
  allDataToShow = computed(() => this.allData());
  showComingSoon = computed(() => !this.hasPageInfo() && this.msg().includes('Coming Soon'));

  // Static links data
  links: any[] = [
    {
      name: 'ln.PartyName',
      url: '/pages/party-name',
      image: 'https://api.bnpbd.org/api/upload/images/about-us-l-3-af7f.png'
    },
    {
      name: 'ln.Declaration',
      url: '/pages/declaration',
      image: 'https://api.bnpbd.org/api/upload/images/about-us-l-4-88e9.png'
    },
    {
      name: 'ln.Constitution',
      url: '/pages/constitution',
      image: 'https://api.bnpbd.org/api/upload/images/about-us-l-5-8107.png'
    },
    {
      name: 'ln.Declaration',
      url: '/pages/declaration',
      image: 'https://api.bnpbd.org/api/upload/images/about-us-l-4-88e9.png'
    },
    {
      name: 'ln.PartyName',
      url: '/pages/party-name',
      image: 'https://api.bnpbd.org/api/upload/images/about-us-l-3-af7f.png'
    },
    {
      name: 'ln.Constitution',
      url: '/pages/constitution',
      image: 'https://api.bnpbd.org/api/upload/images/about-us-l-5-8107.png'
    },
  ];

  // Subscriptions
  private subRouteOne!: Subscription;
  private subDataOne!: Subscription;

  // Services injected using inject() function for Angular 20
  private activatedRoute = inject(ActivatedRoute);
  private additionalPageService = inject(AdditionalPageService);
  public translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Check if slug is not set initially
    if (!this.slug()) {
      this.additionalPageService.getAdditionalPageBySlug('policies')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res => {
            this.pageInfo.set(res.data);
            if (!res.data) {
              this.msg.set('<h2>Coming Soon!</h2>');
            }
          }),
          error: (error => {
            console.error('Error fetching policies page:', error);
          })
        });
    }

    // Subscribe to route parameters
    this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(param => {
      this.slug.set(param.get('pageSlug'));
      this.getPageInfo();
    });

    // Load all page data
    this.getPageInfoByPartName();
    this.getPageInfoByDeclaration();
    this.getPageInfoByConstitution();
    this.getPageInfoByPrinciples();
    this.getPageInfoByObjectives();
    this.getPageInfoByHistory();
    this.getPageInfoByPartyFlag();
    this.getPageInfoBySlogan();
    this.getPageInfoByElectoralSymbol();
    this.getPageInfoByPartyMusic();
    this.getPageInfoByRegistration();
  }

  /**
   * HTTP REQ HANDLE
   * getPageInfo()
   * getPageInfoByPartName()
   * getPageInfoByDeclaration()
   */



  private getPageInfo(): void {
    this.additionalPageService.getAdditionalPageBySlug(this.slug())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.pageInfo.set(res.data);
          if (!res.data) {
            this.msg.set('<h2>Coming Soon!</h2>');
          }
        }),
        error: (error => {
          console.error('Error fetching page info:', error);
        })
      });
  }


  private getPageInfoByPartName(): void {
    const pageUrl = 'party-name';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.partyNameData.set(res.data);
          if (!res.data) {
            this.msg.set('<h2>Coming Soon!</h2>');
          }
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching party name data:', error);
        })
      });
  }

  private getPageInfoByDeclaration(): void {
    const pageUrl = 'declaration';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.declarationData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching declaration data:', error);
        })
      });
  }

  private getPageInfoByConstitution(): void {
    const pageUrl = 'constitution';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.constitutionData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching constitution data:', error);
        })
      });
  }

  private getPageInfoByPrinciples(): void {
    const pageUrl = 'principles';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.principlesData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching principles data:', error);
        })
      });
  }

  private getPageInfoByObjectives(): void {
    const pageUrl = 'aimsand-objectives';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.objectivesData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching objectives data:', error);
        })
      });
  }

  private getPageInfoByHistory(): void {
    const pageUrl = 'history';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.historyData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching history data:', error);
        })
      });
  }

  private getPageInfoByPartyFlag(): void {
    const pageUrl = 'party-flag';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.partyFlagData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching party flag data:', error);
        })
      });
  }

  private getPageInfoBySlogan(): void {
    const pageUrl = 'slogan';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.sloganData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching slogan data:', error);
        })
      });
  }

  private getPageInfoByElectoralSymbol(): void {
    const pageUrl = 'electoral-symbol';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.electoralSymbolData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching electoral symbol data:', error);
        })
      });
  }

  private getPageInfoByPartyMusic(): void {
    const pageUrl = 'party-music';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.partyMusicData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching party music data:', error);
        })
      });
  }

  private getPageInfoByRegistration(): void {
    const pageUrl = 'registration-no-007';
    this.additionalPageService.getAdditionalPageBySlug(pageUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.registrationData.set(res.data);
          this.updateAllData();
        }),
        error: (error => {
          console.error('Error fetching registration data:', error);
        })
      });
  }

  private updateAllData(): void {
    this.allData.set([
      {...this.partyNameData()},
      {...this.declarationData()},
      {...this.constitutionData()},
      {...this.principlesData()},
      {...this.objectivesData()},
      {...this.historyData()},
      {...this.partyFlagData()},
      {...this.sloganData()},
      {...this.electoralSymbolData()},
      {...this.partyMusicData()},
      {...this.registrationData()},
    ]);
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }

  onChangeLanguage(language: string): void {
    this.isChangeLanguage.set(language === 'en');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string): void {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(this.isChangeLanguageToggle());
    } else {
      this.isChangeLanguageToggle.set('bn');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }

  openDialog(): void {
    this.dialog.open(SocialShareComponent, {
      data: this.router.url,
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    });
  }

}
