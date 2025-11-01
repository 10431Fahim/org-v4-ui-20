import { Component, OnInit, signal, computed, effect, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/common/portfolio.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { CanonicalService } from '../../services/common/canonical.service';
import { SocialShareComponent } from '../../shared/components/ui/social-share/social-share.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-leaders-details',
  templateUrl: './leaders-details.component.html',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  styleUrls: ['./leaders-details.component.scss'],
  standalone: true
})
export class LeadersDetailsComponent implements OnInit {
  // Angular 20 Signals for reactive state management
  private readonly portfolioService = inject(PortfolioService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly canonicalService = inject(CanonicalService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // Signals for reactive state
  leader = signal<any>(null);
  portfolio = signal<any>(null);
  slugData = signal<string | null>(null);
  language = signal<string | null>(null);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');
  
  // Button visibility signals
  buttonHide = signal<boolean>(true);
  buttonHide1 = signal<boolean>(true);
  buttonHide2 = signal<boolean>(true);

  // Computed signals for derived state
  isLanguageBengali = computed(() => this.language() === 'bn');
  currentLanguage = computed(() => this.language() || this.translateService.currentLang);
  leaderName = computed(() => {
    const leader = this.leader();
    if (!leader) return '';
    return this.isLanguageBengali() ? leader.nameEn : leader.name;
  });
  leaderDescription = computed(() => {
    const leader = this.leader();
    if (!leader) return '';
    return this.isLanguageBengali() ? leader.descriptionEn : leader.description;
  });
  hasPortfolio = computed(() => {
    const portfolio = this.portfolio();
    return portfolio && portfolio.length > 0;
  });
  leaderButtons = computed(() => {
    const portfolio = this.portfolio();
    if (!portfolio || !portfolio[0]?.leaders) return [];
    return portfolio[0].leaders.slice(0, 3);
  });

  // Computed signal for button names based on language
  getButtonName = (leader: any) => {
    return this.isLanguageBengali() ? leader?.nameEn : leader?.name;
  };

  // Effects for side effects
  constructor() {
    // Effect for language changes
    effect(() => {
      const lang = this.language();
      if (lang) {
        console.log('Language changed to:', lang);
        this.translateService.use(lang);
        this.isChangeLanguage.set(lang === 'bn');
      }
    });

    // Effect for SEO updates
    effect(() => {
      const leader = this.leader();
      const lang = this.language();
      if (leader && lang) {
        if (lang === 'bn') {
          this.updateMetaDataBn();
        } else {
          this.updateMetaData();
        }
      }
    });

    // Effect for button visibility
    effect(() => {
      const slug = this.slugData();
      if (slug !== null) {
        this.updateButtonVisibility(slug);
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to route parameters using Angular 20 patterns
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(param => {
        const slug = param.get('slug');
        this.slugData.set(slug);
        // Reload portfolio data when route changes
        this.getAllPortfolio();
      });

    // Subscribe to query parameters
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(queryParam => {
        const lang = queryParam.get('language');
        this.language.set(lang);
      });

    // Initial load
    this.getAllPortfolio();
  }

  private getAllPortfolio(): void {
    this.portfolioService.getAllPortfolio()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.portfolio.set(res.data);
          
          // Find and set the current leader based on slug
          this.findAndSetCurrentLeader(res.data);
        },
        error: err => {
          console.error('Error fetching portfolio:', err);
        }
      });
  }

  private findAndSetCurrentLeader(portfolioData: any): void {
    const currentSlug = this.slugData();
    if (!currentSlug || !portfolioData || !portfolioData.length) {
      this.leader.set(null);
      return;
    }

    const portfolio = portfolioData[0];
    if (portfolio && portfolio.leaders && portfolio.leaders.length) {
      const leader = portfolio.leaders.find((f: { slug: any; }) => f.slug === currentSlug);
      if (leader) {
        this.leader.set(leader);
        console.log('Leader found and set:', leader.name);
      } else {
        console.warn('Leader not found for slug:', currentSlug);
        this.leader.set(null);
      }
    } else {
      this.leader.set(null);
    }
  }

  checkButtonHide(data: number): void {
    this.updateButtonVisibility(data.toString());
    // No need to call getAllPortfolio() here as route change will trigger it
  }

  private updateButtonVisibility(data: string): void {
    const index = parseInt(data);
    
    this.buttonHide.set(index === 0);
    this.buttonHide1.set(index === 1);
    this.buttonHide2.set(index === 2);
  }

  onChangeLanguage(language: string): void {
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string): void {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(language);
    } else {
      this.isChangeLanguageToggle.set('en');
      this.isChangeLanguage.set(false);
      this.translateService.use('en');
    }
  }

  /**
   * SEO DATA UPDATE
   * updateMetaData()
   */
  private updateMetaData(): void {
    const leader = this.leader();
    if (!leader) return;

    // Title
    this.title.setTitle(leader.name);
    
    // Meta tags
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: leader.description});
    this.meta.updateTag({ name: 'keywords', content: 'leader-details' });

    // Facebook
    this.meta.updateTag({ property: 'og:title', content: leader.name });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: leader.seoImage });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
    
    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: leader.name });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: leader.seoImage });
    this.meta.updateTag({name: 'twitter:description', content: leader.description});
    
    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: leader.seoImage});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn(): void {
    const leader = this.leader();
    if (!leader) return;

    // Title
    this.title.setTitle(leader.nameEn);
    
    // Meta tags
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: leader.descriptionEn});
    this.meta.updateTag({ name: 'keywords', content: 'leader-details' });

    // Facebook
    this.meta.updateTag({ property: 'og:title', content: leader.nameEn });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: leader.seoImage });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
    
    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: leader.nameEn });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: leader.seoImage });
    this.meta.updateTag({name: 'twitter:description', content: leader.descriptionEn});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: leader.seoImage});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  openDialog(): void {
    const leader = this.leader();
    if (!leader) return;

    this.dialog.open(SocialShareComponent, {
      data: leader,
      maxWidth: "480px",
      width: "100%",
      height: "auto",
      panelClass: ['social-share', 'social-dialog']
    });
  }
}