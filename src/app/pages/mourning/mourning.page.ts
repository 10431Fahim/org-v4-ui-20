import { Component, OnInit, inject, signal, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { MourningService } from '../../services/core/mourning.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-mourning-page',
  template: `
  <div class="mourning-page" *ngIf="cfg$ | async as cfg">
    <div class="page-header">
      <h1 class="page-title">{{ currentLang() === 'bn' ? 'শোকবার্তা' : 'Condolence Message' }}</h1>
      <div class="divider"></div>
    </div>

    <div class="content-wrapper">
      <div class="mourning-card">
        <!-- Arabic Text Section -->
        <div class="arabic-section">
          <p class="arabic-text">إِنَّا لِلّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ</p>
          <p class="arabic-translation">{{ currentLang() === 'bn' ? '"নিশ্চয়ই আমরা আল্লাহর এবং নিশ্চয়ই আমরা তাঁরই কাছে ফিরে যাব"' : '"Indeed, we belong to Allah, and to Him we shall return."' }}</p>
          <img class="mourning-image" src="/zia.jpeg" alt="">
        </div>

        <!-- Main Content -->
        <div class="content-section">
          <p class="main-text" [innerHTML]="getMainText()"></p>

          <p class="prayer-text">
            {{ currentLang() === 'bn' ? 'গভীর শোক ও শ্রদ্ধায় তাঁর বিদেহী আত্মার মাগফিরাত কামনা করছি এবং দেশবাসীসহ সকলের নিকট দোয়া প্রার্থনা করছি।' : 'We mourn this great loss with deep grief and respect. We pray that Almighty Allah grants forgiveness to her departed soul and bestows upon her the highest place in Jannatul Ferdous. We humbly request prayers from the people of the nation and all well wishers for the eternal peace of her soul.' }}
          </p>
        </div>

        <!-- Footer Note -->
        <div class="footer-note">
          <p class="muted-text">
            <!-- <span class="icon">ℹ️</span> -->
            <img class="logo" src="/images/logo/bangladesh-flag-independent-victory-day_551555-340 (2).png" alt="Mourning Ribbon" >
            {{ currentLang() === 'bn' ? 'বাংলাদেশ জাতীয়তাবাদী দল-বিএনপি' : 'Bangladesh Nationalist Party-BNP' }}
          </p>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .mourning-page {
      min-height: 80vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      padding: 40px 16px;
      animation: fadeIn 0.6s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .page-header {
      max-width: 900px;
      margin: 0 auto 40px;
      text-align: center;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      color: #253B38;
      margin: 0 0 20px;
      font-family: 'Noto Sans Bengali', sans-serif;
      letter-spacing: 1px;
    }

    .divider {
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #0E7356 0%, #253B38 100%);
      margin: 0 auto;
      border-radius: 2px;
    }

    .content-wrapper {
      max-width: 900px;
      margin: 0 auto;
    }

    .mourning-card {
      background: #000000;
      border-radius: 24px;
      padding: 48px 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .mourning-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #0E7356 0%, #253B38 50%, #0E7356 100%);
    }

    .arabic-section {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 32px;
      border-bottom: 2px solid #f0f0f0;
    }

    .arabic-text {
      font-size: 2.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 12px;
      line-height: 1.6;
      font-family: 'Amiri', 'Noto Sans Arabic', serif;
      direction: rtl;
    }

    .arabic-translation {
      font-size: 1.1rem;
      color: #ffffff;
      margin: 0;
      font-style: italic;
      font-family: 'Noto Sans Bengali', sans-serif;
    }

    .content-section {
      margin-bottom: 32px;
    }

    .main-text {
      font-size: 1.2rem;
      line-height: 1.8;
      color: #ffffff;
      margin: 0 0 24px;
      font-family: 'Noto Sans Bengali', sans-serif;
      text-align: justify;
    }

    .highlight {
      color: #ffffff;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .date, .time {
      color: #253B38;
      font-weight: 600;
      background: #f0f7f5;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .prayer-text {
      font-size: 1.15rem;
      line-height: 1.8;
      color: #000000;
      margin: 0;
      font-family: 'Noto Sans Bengali', sans-serif;
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #f8faf9 0%, #f0f7f5 100%);
      border-radius: 12px;
      border-left: 4px solid #0E7356;
    }

    .footer-note {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e8e8e8;
    }

    .muted-text {
      font-size: 0.95rem;
      color: #ffffff;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: 'Noto Sans Bengali', sans-serif;
      
    }
    .logo{
        width: 54px;
        height: 38px;
        display: block;
        object-fit: contain;
        filter: none !important;
        vertical-align: middle;
        margin-right: 8px;
      }
    .mourning-image{
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      filter: none !important;
      max-width: 400px;
      margin: 0 auto;
      filter: none !important;
    }

    .muted-text .icon {
      font-size: 1.2rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .mourning-page {
        padding: 24px 12px;
      }

      .page-title {
        font-size: 2rem;
      }

      .mourning-card {
        padding: 32px 24px;
        border-radius: 16px;
      }

      .arabic-text {
        font-size: 1.8rem;
      }

      .main-text {
        font-size: 1.05rem;
        text-align: left;
      }

      .prayer-text {
        font-size: 1rem;
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 1.75rem;
      }

      .mourning-card {
        padding: 24px 16px;
      }

      .arabic-text {
        font-size: 1.5rem;
      }

      .arabic-translation {
        font-size: 0.95rem;
      }
    }
  `]
})
export class MourningPage implements OnInit {
  cfg$;
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private platformId = inject(PLATFORM_ID);
  currentLang = signal<string>(this.translateService.currentLang || 'en');

  constructor(private m: MourningService) {
    this.cfg$ = this.m.config$;
    
    // Listen to language changes from query params
    this.route.queryParams.subscribe(params => {
      const lang = params['language'] || this.translateService.currentLang || 'en';
      this.currentLang.set(lang);
      this.translateService.use(lang);
      this.updateMetaTags(); // Update meta tags when language changes
    });

    // Listen to TranslateService language changes
    this.translateService.onLangChange.subscribe(lang => {
      this.currentLang.set(lang.lang);
      this.updateMetaTags(); // Update meta tags when language changes
    });
  }

  getMainText(): string {
    if (this.currentLang() === 'bn') {
      return `গভীর শোকের সঙ্গে জানাচ্ছি যে, বাংলাদেশ জাতীয়তাবাদী দল-বিএনপি'র চেয়ারপার্সন,
            সাবেক প্রধানমন্ত্রী, দেশনেত্রী <strong class="highlight">বেগম খালেদা জিয়া </strong> আজ
            <strong class="date">৩০ ডিসেম্বর ২০২৫</strong> (মঙ্গলবার) সকাল <strong class="time">৬:০০</strong> টায় ইন্তেকাল করেছেন।`;
    } else {
      return `It is with profound grief and sorrow that we announce the passing of the Chairperson of the Bangladesh Nationalist Party (BNP), former Prime Minister, and Deshnetri <strong class="highlight">Begum Khaleda Zia.</strong> She passed away today, <strong class="date">Tuesday, 30 December 2025,</strong> at <strong class="time">6:00 AM</strong>.`;
    }
  }

  ngOnInit() {
    // Initialize service when page loads (non-blocking)
    this.m.init().catch(() => {
      // Silently fail - service will handle it
    });
    
    // Set meta tags for social media sharing
    this.updateMetaTags();
  }

  private updateMetaTags() {
    const isBengali = this.currentLang() === 'bn';
    
    // Get title and description based on language
    const title = isBengali 
      ? 'নিশ্চয়ই আমরা আল্লাহর এবং নিশ্চয়ই আমরা তাঁরই কাছে ফিরে যাব'
      : 'Indeed, we belong to Allah, and to Him we shall return.';
    
    const description = isBengali
      ? 'গভীর শোক ও শ্রদ্ধায় তাঁর বিদেহী আত্মার মাগফিরাত কামনা করছি এবং দেশবাসীসহ সকলের নিকট দোয়া প্রার্থনা করছি।'
      : 'We mourn this great loss with deep grief and respect. We pray that Almighty Allah grants forgiveness to her departed soul and bestows upon her the highest place in Jannatul Ferdous. We humbly request prayers from the people of the nation and all well wishers for the eternal peace of her soul.';
    
    // Image URL - absolute URL for social media
    const baseUrl = isPlatformBrowser(this.platformId) 
      ? window.location.origin 
      : 'https://bnpbd.org';
    const imageUrl = `${baseUrl}/zia.jpeg`;
    const pageUrl = `${baseUrl}${this.router.url}`;

    // Set page title
    this.title.setTitle(isBengali ? 'শোকবার্তা - BNP' : 'Condolence Message - BNP');

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color', content: '#00a0db' });
    this.meta.updateTag({ name: 'author', content: 'BNP BD' });

    // Open Graph meta tags (Facebook, LinkedIn, etc.)
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: isBengali ? 'bn_BD' : 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'BNP Bangladesh' });

    // Twitter Card meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:site', content: '@bdbnp78' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@bdbnp78' });
  }
}
