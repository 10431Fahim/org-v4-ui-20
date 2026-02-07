import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Flipbook } from '../home/flipbook/flipbook';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-manifesto',
  standalone: true,
  imports: [Flipbook],
  templateUrl: './manifesto.html',
  styleUrl: './manifesto.scss'
})
export class Manifesto {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private meta = inject(Meta);
  private titleService = inject(Title);

  readonly language = signal<string>(this.translateService.currentLang || 'en');
  readonly isLanguageBengali = computed(() => this.language() === 'bn');
  readonly isDownloading = signal(false);

  readonly title = computed(() =>
    this.isLanguageBengali() ? `বিএনপি'র নির্বাচনী ইশতেহার ২০২৬` : `BNP's Election Manifesto 2026`
  );

  readonly subtitle = computed(() =>
    this.isLanguageBengali()
      ? '১৩ ফেব্রুয়ারী শুরু হবে জনগণের দিন, ইনশাআল্লাহ - <span class="highlight-name">তারেক রহমান</span>'
      : 'From the 13th February, the People’s Days will begin Insa\'Allah - <span class="highlight-name">Tarique Rahman</span>'
  );

  startDownload() {
    this.isDownloading.set(true);
    setTimeout(() => this.isDownloading.set(false), 2000);
  }

  constructor() {
    // Initial from query param override
    this.route.queryParamMap.subscribe(params => {
      const lang = params.get('language');
      if (lang) {
        this.language.set(lang);
        this.updateSeo();
      }
    });

    // React to global language changes
    this.translateService.onLangChange.subscribe(event => {
      this.language.set(event.lang);
      this.updateSeo();
    });

    // Initial SEO update for SSR visibility
    this.updateSeo();
  }

  private updateSeo() {
    const currentTitle = this.title();
    const rawDesc = this.subtitle();
    // Strip HTML tags for meta description
    const currentDesc = rawDesc.replace(/<[^>]*>/g, '');
    const shareImage = 'https://bnpbd.org/image-2.jpeg';
    const currentUrl = `https://bnpbd.org${this.router.url}`;

    // Set Page Title
    this.titleService.setTitle(currentTitle + ' | BNP');

    // Update Meta Tags
    this.meta.updateTag({ name: 'description', content: currentDesc });

    // Open Graph / Facebook
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:title', content: currentTitle });
    this.meta.updateTag({ property: 'og:description', content: currentDesc });
    this.meta.updateTag({ property: 'og:image', content: shareImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:url', content: currentUrl });
    this.meta.updateTag({ name: 'twitter:title', content: currentTitle });
    this.meta.updateTag({ name: 'twitter:description', content: currentDesc });
    this.meta.updateTag({ name: 'twitter:image', content: shareImage });
  }
}
