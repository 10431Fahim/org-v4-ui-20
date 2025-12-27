import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import { FilterData } from "../../interfaces/gallery/filter-data";
import { NgxSpinnerService } from "ngx-spinner";
import { UtilsService } from "../../services/core/utils.service";
import { ReloadService } from "../../services/core/reload.service";
import { UiService } from "../../services/core/ui.service";
import { MotoService } from "../../services/common/motto.service";
import { MatDialog } from '@angular/material/dialog';
import { Moto } from "../../interfaces/common/motto.interface";
import { Select } from "../../interfaces/core/select";
import { MONTHS } from "../../core/utils/app-data";
import { Subscription } from "rxjs";
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {CanonicalService} from '../../services/common/canonical.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-motto',
  templateUrl: './motto.component.html',
  imports: [],
  standalone:true,
  styleUrls: ['./motto.component.scss'],
})
export class MottoComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  motto = signal<Moto[]>([]);
  isLoading = signal<boolean>(true);
  adminId = signal<any>(null);
  role = signal<any>(null);
  language = signal<string>('en');
  months = signal<Select[]>(MONTHS);
  filter = signal<any>(null);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasMotto = computed(() => this.motto().length > 0);
  firstMotto = computed(() => this.motto()[0] || null);
  isLanguageBengali = computed(() => this.language() === 'bn');
  showContent = computed(() => !this.isLoading() && this.hasMotto());

  // Subscriptions
  private subDataOne!: Subscription;
  private subDataTwo!: Subscription;
  private subDataThree!: Subscription;
  private subDataFour!: Subscription;
  private subReloadOne!: Subscription;

  // Services injected using inject() function for Angular 20
  private dialog = inject(MatDialog);
  private mottoService = inject(MotoService);
  private uiService = inject(UiService);
  private reloadService = inject(ReloadService);
  private utilsService = inject(UtilsService);
  private spinnerService = inject(NgxSpinnerService);
  public translateService = inject(TranslateService);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private canonicalService = inject(CanonicalService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    // Subscribe to query parameters
    this.activatedRoute.queryParamMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(qPram => {
      this.language.set(qPram.get('language') || 'en');
    });

    this.getAllMottos();
  }

  // getAllMottos() {
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
  //       mottoCategory: 1,
  //       briefTimelineImg: 1,
  //       title: 1,
  //       titleEn: 1,
  //       subTitle: 1,
  //       shortDescription: 1,
  //       subTitleEn: 1,
  //       shortDescriptionEn: 1,
  //     },
  //     sort: {
  //       createdAt: -1
  //     }
  //   }
  //
  //   this.subDataOne = this.mottoService.getAllMotos(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         this.motto = res.data;
  //         // console.log(' this.motto', this.motto);
  //         if (this.motto) {
  //           if (this.language === 'bn') {
  //             this.updateMetaDataBn();
  //           }
  //         else {
  //             this.updateMetaData();
  //           }
  //         }
  //
  //
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.spinnerService.hide();
  //         // console.log(err)
  //       }
  //     })
  // }

  private getAllMottos(): void {
    this.mottoService.getAllMoto()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading.set(false);
          this.spinnerService.hide();
          this.motto.set(res.data);

          if (this.hasMotto()) {
            if (this.isLanguageBengali()) {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: err => {
          console.error('Error fetching motto data:', err);
          this.isLoading.set(false);
        }
      });
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





  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData(): void {
    const firstMotto = this.firstMotto();
    if (!firstMotto) return;

    // Title
    this.title.setTitle(firstMotto.name || '');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    this.meta.updateTag({name: 'description', content: firstMotto.description || ''});
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstMotto.name || ''});
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstMotto.seoImage || ''});
    this.meta.updateTag({ property: 'og:description', content: firstMotto.description || ''});
    this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstMotto.name || ''});
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstMotto.seoImage || ''});
    this.meta.updateTag({ name: 'twitter:description', content: firstMotto.description || ''});
    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstMotto.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }
  private updateMetaDataBn(): void {
    const firstMotto = this.firstMotto();
    if (!firstMotto) return;

    // Title
    this.title.setTitle(firstMotto.nameEn || '');

    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    this.meta.updateTag({name: 'description', content: firstMotto.descriptionEn || ''});
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: firstMotto.nameEn || ''});
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: firstMotto.seoImage || ''});
    this.meta.updateTag({ property: 'og:description', content: firstMotto.descriptionEn || ''});
    this.meta.updateTag({ property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({ property: 'og:site_name', content: 'bnpbd'});
    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: firstMotto.nameEn || ''});
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: firstMotto.seoImage || ''});
    this.meta.updateTag({ name: 'twitter:description', content: firstMotto.descriptionEn || ''});
    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: firstMotto.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }
}
