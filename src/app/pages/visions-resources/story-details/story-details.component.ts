import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';

import {Story} from "../../../interfaces/common/story.interface";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';
import {CanonicalService} from '../../../services/common/canonical.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {StoryService} from '../../../services/common/story.service';
import {OurServiceService} from '../../../services/common/our-service.service';
import {FilterData} from '../../../interfaces/core/filter-data';
import {SwiperComponent} from '../../../shared/components/swiper/swiper.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  imports: [
    TranslatePipe,
    DatePipe,
    RouterLink,
    SafeHtmlCustomPipe,
    SwiperComponent
  ],
  standalone:true,
  styleUrls: ['./story-details.component.scss'],

})
export class StoryDetailsComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');
  language = signal<string>('en');
  id = signal<string | null>(null);
  sub = signal<string | null>(null);
  ourService = signal<Story | null>(null);
  ourServicess = signal<Story[]>([]);

  // Computed signals for derived state
  hasStory = computed(() => this.ourService() !== null);
  hasRelatedStories = computed(() => this.ourServicess().length > 0);
  relatedStories = computed(() => this.ourServicess());
  isLanguageBengali = computed(() => this.language() === 'bn');

  // Swiper breakpoints configuration for related stories
  swiperBreakpoints = {
    '520': { visibleSlides: 2, gap: 15 },
    '768': { visibleSlides: 2.3, gap: 15 },
    '1000': { visibleSlides: 2.5, gap: 20 },
    '1150': { visibleSlides: 2.5, gap: 20 },
    '1180': { visibleSlides: 3, gap: 20 },
    '1200': { visibleSlides: 3, gap: 20 }
  };

  // Subscriptions
  private subDataOne!: Subscription;
  private subRouteOne!: Subscription;
  private subDataThree!: Subscription;

  // Services injected using inject() function for Angular 20
  private activatedRoute = inject(ActivatedRoute);
  private ourServiceService = inject(OurServiceService);
  private storyService = inject(StoryService);
  public translateService = inject(TranslateService);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private canonicalService = inject(CanonicalService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Use takeUntilDestroyed for automatic subscription cleanup
    this.subRouteOne = this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((param) => {
      this.activatedRoute.queryParamMap.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(qPram => {
        this.sub.set(qPram.get('sub'));
        this.language.set(qPram.get('language') || 'en');
        this.id.set(param.get('id'));

        const storyId = this.id();
        if (storyId) {
          this.getStoryById(storyId);
        }
      });
    });

    this.getAllOurService();
  }



  getStoryById(id: string): void {
    this.subDataOne = this.storyService.getStoryById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.ourService.set(res.data);

          const story = this.ourService();
          if (story) {
            if (this.isLanguageBengali()) {
              this.updateMetaDataBn();
            } else {
              this.updateMetaData();
            }
          }
        },
        error: error => {
          console.error('Error fetching story:', error);
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

  private getAllOurService(): void {
    // Select
    const mSelect = {
      name: 1,
      nameEn: 1,
      image: 1,
      shortDescription: 1,
      description: 1,
      shortDescriptionEn: 1,
      descriptionEn: 1,
      createdBy: 1,
      _id: 1,
      slug: 1,
      createdAt: 1
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 }
    };

    this.subDataThree = this.storyService.getAllStorys(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.success) {
            this.ourServicess.set(res.data);
          }
        },
        error: error => {
          console.error('Error fetching related stories:', error);
        }
      });
  }





  /**
   * SEO DATA UPDATE
   * updateMetaData()
   * updateMetaDataBn()
   */

  private updateMetaData(): void {
    const story = this.ourService();
    if (!story) return;

    // Title
    this.title.setTitle(story.name || 'Story Details');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: story.description || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: story.name || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: story.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: story.description || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: story.name || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: story.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: story.description || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: story.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  private updateMetaDataBn(): void {
    const story = this.ourService();
    if (!story) return;

    // Title
    this.title.setTitle(story.nameEn || 'Story Details');
    // Meta
    this.meta.updateTag({name: 'robots', content: 'index, follow'});
    this.meta.updateTag({name: 'theme-color', content: '#00a0db'});
    this.meta.updateTag({name: 'copyright', content: 'BNP BD'});
    this.meta.updateTag({name: 'author', content: 'BNP BD'});
    this.meta.updateTag({name: 'description', content: story.descriptionEn || ''});
    this.meta.updateTag({ name: 'keywords', content: 'news' });
    // Facebook
    this.meta.updateTag({ property: 'og:title', content: story.nameEn || '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '300' });
    this.meta.updateTag({ property: 'og:image:height', content: '300' });
    this.meta.updateTag({ property: 'og:url', content: `https://bnpbd.org${this.router.url}`});
    this.meta.updateTag({ property: 'og:image', content: story.seoImage || '' });
    this.meta.updateTag({ property: 'og:description', content: story.descriptionEn || ''});
    this.meta.updateTag({property: 'og:locale', content: 'en_US'});
    this.meta.updateTag({property: 'og:site_name', content: 'bnpbd'});

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: story.nameEn || '' });
    this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
    this.meta.updateTag({name: 'twitter:site', content: '@bdbnp78'});
    this.meta.updateTag({name: 'twitter:creator', content: '@bdbnp78'});
    this.meta.updateTag({ name: 'twitter:image', content: story.seoImage || '' });
    this.meta.updateTag({name: 'twitter:description', content: story.descriptionEn || ''});

    // Microsoft
    this.meta.updateTag({name: 'msapplication-TileImage', content: story.seoImage || ''});

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }
}
