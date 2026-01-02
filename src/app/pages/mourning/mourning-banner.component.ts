import { Component, OnInit, inject, signal } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { map, startWith, catchError } from 'rxjs';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {MourningService} from '../../services/core/mourning.service';

@Component({
  standalone: true,
  selector: 'app-mourning-banner',
  imports: [NgIf, AsyncPipe, RouterLink],
  template: `
  <ng-container *ngIf="vm$ | async as vm">
    <div class="mourning-wrapper" *ngIf="vm.enabled">
      <div class="mourning-banner mourning-no-filter">
        <div class="left">
        <div class="mourning-badge-wrapper">
          <span class="mourning-badge">{{ (currentLang() === 'bn' ? 'গভীর শোকবার্তা' : 'Condolence Message') }}</span>

        </div>
          <div class="text">{{ (currentLang() === 'bn' ? 'দেশনেত্রী বেগম খালেদা জিয়া ইন্তেকাল করেছেন। ইন্নালিল্লাহি ওয়া ইন্না ইলাইহি রাজিঊন।' : 'Deshnetri Begum Khaleda Zia Has Passed Away. Inna Lillahi wa Inna Ilayhi Raji‘un.') }}   <a class="mobil-btn" routerLink="/mourning">{{ currentLang() === 'bn' ? 'বিস্তারিত...' : 'Details...' }}</a></div>
        </div>
        <a class="btn" routerLink="/mourning">{{ currentLang() === 'bn' ? 'বিস্তারিত' : 'Details' }}</a>
      </div>
      <div class="mobile-ribbon">
        <div class="ribbon-image"></div>
        <div class="ribbon-text" [innerHTML]="getRibbonText()"></div>
      </div>
    </div>
  </ng-container>
  `,
  styles: [`
    .mourning-wrapper {
      position: sticky; top: 0; z-index: 999999999;
      background:#111; color:#fff;
    }
    .mourning-banner{
      color:#fff;
      display:flex; gap:16px; align-items:center; justify-content:space-between;
      padding:12px 0;
      max-width: 1366px;
      margin: 0 auto;
    }
    .left{display:flex; gap:12px; align-items:center;}
    .text{opacity:.95}
    .btn{
      color:#fff; text-decoration:none; border:1px solid rgba(255,255,255,.35);
      padding:8px 12px; border-radius:10px;
    }
    .mobil-btn{
      color:#fff;
      text-decoration: underline;
      // border:1px solid rgba(255,255,255,.35);
      // padding:4px 8px; border-radius:10px;
      display: none;
      font-size: 15px;
      // padding-top: 6px;

    }
    .mourning-badge-wrapper{
      display: flex;
    }
    .mobile-ribbon {
      display: none;
    }
    @media (max-width: 768px) {
      .mourning-wrapper {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 10px;
        background: #2c2c2c;
        padding: 12px 10px;
      }
      .mourning-banner {
        flex: 1;
        position: relative;
        padding: 0;
      }
      .mobil-btn{
      margin-left: 10px;
      display: inline;
    }
      .mourning-banner{
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .left{
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .mourning-badge{
        padding: 4px 0px;
        background: #2c2c2c;
        white-space: nowrap;
        // order: 1;
        display: inline-flex;
        align-items: center;
      }
      .btn {
        display: none;
      }
      .text {
        // order: 3;
        width: 100%;
        flex-basis: 100%;
        margin-top: 4px;
      }
      .mobile-ribbon {
        display: block;
        position: relative;
        width: 100px;
        height: 90px;
        flex-shrink: 0;
      }
      .ribbon-image {
        position: absolute;
        top: -12px;
        right: -20px;
        width: 126px;
        height: 128px;
        background-image: url('/Shok1.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: top right;
      }
      .ribbon-text {
        position: absolute;
        top: -10px;
        right: -9px;
        width: 100px;
        height: 90px;
        color: #fff;
        font-family: "Noto Sans Bengali", sans-serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 1;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }
    }
  `]
})
export class MourningBannerComponent implements OnInit {
  vm$;
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  currentLang = signal<string>(this.translateService.currentLang || 'en');

  constructor(private m: MourningService) {
    // Start with default value to prevent blank page
    this.vm$ = this.m.config$.pipe(
      startWith(null), // Ensure observable always has a value
      map(cfg => {
        try {
          if (!cfg || !cfg.enabled) {
            return { enabled: false, headline: undefined, shortText: undefined };
          }
          const untilMs = new Date(cfg.until).getTime();
          const enabled = Number.isFinite(untilMs) && Date.now() < untilMs && cfg.enabled;
          return { ...cfg, enabled };
        } catch (error) {
          // Return safe default on any error
          return { enabled: false, headline: undefined, shortText: undefined };
        }
      }),
      catchError(() => {
        // Return safe default on stream error
        return of({ enabled: false, headline: undefined, shortText: undefined });
      })
    );
  }

  getShortText(shortText?: string): string {
    if (!shortText) return '';

    if (this.currentLang() === 'bn') {
      return shortText;
    } else {
      // Translate to English
      return "Inna lillahi wa inna ilayhi raji'un. National leader Begum Khaleda Zia has passed away.";
    }
  }

  getRibbonText(): string {
    return this.currentLang() === 'bn' ? 'আমরা<br>গভীরভাবে<br>শোকাহত' : 'We Are<br>Deeply Mourning';
  }

  ngOnInit() {
    // Initialize service immediately when component loads (non-blocking)
    this.m.init().catch(() => {
      // Silently fail - service will handle it
    });

    // Initialize language from current service state
    const initialLang = this.translateService.currentLang || this.route.snapshot.queryParams['language'] || 'en';
    this.currentLang.set(initialLang);

    // Listen to language changes from query params
    this.route.queryParams.subscribe(params => {
      const lang = params['language'] || this.translateService.currentLang || 'en';
      if (lang !== this.currentLang()) {
        this.currentLang.set(lang);
        this.translateService.use(lang);
      }
    });

    // Listen to TranslateService language changes
    this.translateService.onLangChange.subscribe(lang => {
      if (lang.lang !== this.currentLang()) {
        this.currentLang.set(lang.lang);
      }
    });
  }

}
