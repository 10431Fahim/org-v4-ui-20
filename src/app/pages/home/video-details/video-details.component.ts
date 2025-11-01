import {Component, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {SafeUrlPipe} from '../../../shared/pipes/safe-url.pipe';
import {ClientService} from '../../../services/common/client.service';
import {Client} from '../../../interfaces/common/client.interface';
import {CanonicalService} from '../../../services/common/canonical.service';
import {FilterData} from '../../../interfaces/core/filter-data';
import {SocialShareComponent} from '../../../shared/components/ui/social-share/social-share.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  imports: [
    SafeUrlPipe,
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./video-details.component.scss']
})
export class VideoDetailsComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly canonicalService = inject(CanonicalService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly id = signal<string | null>(null);
  readonly sub = signal<string | null>(null);
  readonly isLoadMore = signal<boolean>(false);
  readonly language = signal<string | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly totalVideo = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly totalProducts = signal<number>(0);
  readonly productsPerPage = signal<number>(6);
  readonly totalProductsStore = signal<number>(0);
  readonly isChangeLanguage = signal<boolean>(false);
  readonly isChangeLanguageToggle = signal<string>('en');
  readonly client = signal<Client[]>([]);
  readonly clientData = signal<Client | null>(null);

  // Angular 20: Computed signals for derived state
  readonly currentLanguage = computed(() => this.translateService.currentLang);
  readonly isEnglish = computed(() => this.currentLanguage() === 'en' || !this.currentLanguage());
  readonly isBengali = computed(() => this.currentLanguage() === 'bn');

  ngOnInit(): void {
    // Angular 20: Using takeUntilDestroyed for automatic subscription cleanup
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        this.activatedRoute.queryParamMap
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(qParam => {
            this.sub.set(qParam.get('sub'));
            this.language.set(qParam.get('language'));
            this.id.set(param.get('id'));
            const currentId = this.id();
            if (currentId) {
              this.getClintById(currentId);
            }
          });
      });
    this.getAllClient();
  }


  getClintById(id: string) {
    this.clientService.getClientById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.clientData.set(res.data);
          const currentClientData = this.clientData();
          if (currentClientData) {
            if (this.language() === 'bn') {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: error => {
          console.error(error);
        }
      });
  }

  private getAllClient(loadMore?: boolean) {
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      title: 1,
      titleEn: 1,
      _id: 1,
      createdAt: 1
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 }
    };

    this.clientService.getAllClients(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.isLoadMore.set(false);
          
          if (loadMore) {
            this.client.set([...this.client(), ...res.data]);
            setTimeout(() => {
              this.isLoading.set(false);
            }, 2000);
          } else {
            this.client.set(res.data);
          }
          this.totalVideo.set(res.count);
        },
        error: error => {
          this.isLoading.set(false);
          console.error(error);
        }
      });
  }

  getSafeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  /**
   * LOAD MORE
   */
  // onLoadMore() {
  //   if (this.totalProducts > this.conference.length) {
  //     this.isLoadMore = true;
  //     this.currentPage += 1;
  //     this.getAllConference(true);
  //   }
  // }


  onChangeLanguage(language: string) {
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(this.isChangeLanguageToggle());
    } else {
      this.isChangeLanguageToggle.set('en');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }

  openDialog() {
    const currentClientData = this.clientData();
    if (currentClientData) {
      this.dialog.open(SocialShareComponent, {
        data: currentClientData,
        maxWidth: "480px",
        width: "100%",
        height: "auto",
        panelClass: ['social-share', 'social-dialog']
      });
    }
  }





  /**
   * SEO DATA UPDATE
   * updateMetaData()
   */

  private updateMetaData() {
    const currentClientData = this.clientData();
    if (!currentClientData) return;

    const title = currentClientData.title || 'BNPBD.ORG';
    const seoImage = currentClientData.seoImage || '';

    // Title
    this.title.setTitle(title);

    // Meta Tags
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#00a0db' });
    this.meta.updateTag({ name: 'copyright', content: 'BNP BD' });
    this.meta.updateTag({ name: 'author', content: 'BNP BD' });
    this.meta.updateTag({ name: 'keywords', content: 'client' });

    // Open Graph Tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:type', content: 'video' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: seoImage });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh' });

    // Twitter Tags
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:image', content: seoImage });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });

    // Microsoft Tile Image
    this.meta.updateTag({ name: 'msapplication-TileImage', content: seoImage });

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn() {
    const currentClientData = this.clientData();
    if (!currentClientData) return;

    const title = currentClientData.titleEn || 'BNPBD.ORG';
    const seoImage = currentClientData.seoImage || '';

    // Title
    this.title.setTitle(title);

    // Meta Tags
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#00a0db' });
    this.meta.updateTag({ name: 'copyright', content: 'BNP BD' });
    this.meta.updateTag({ name: 'author', content: 'BNP BD' });
    this.meta.updateTag({ name: 'keywords', content: 'client' });

    // Open Graph Tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:type', content: 'video' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}` });
    this.meta.updateTag({ property: 'og:image', content: seoImage });
    this.meta.updateTag({ property: 'og:locale', content: 'bn_BD' });
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh' });

    // Twitter Tags
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:image', content: seoImage });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });

    // Microsoft Tile Image
    this.meta.updateTag({ name: 'msapplication-TileImage', content: seoImage });

    // Canonical URL
    this.canonicalService.setCanonicalURL();
  }

}
