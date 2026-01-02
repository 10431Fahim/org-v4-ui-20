import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, timeout } from 'rxjs';

export interface MourningConfig {
  enabled: boolean;
  until: string;           // ISO with timezone
  showGrayscale: boolean;
  showRibbon: boolean;
  headline?: string;
  shortText?: string;
}

interface SiteStatus {
  mourning?: MourningConfig;
}

@Injectable({ providedIn: 'root' })
export class MourningService {
  private readonly _config$ = new BehaviorSubject<MourningConfig | null>(null);
  readonly config$ = this._config$.asObservable();
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  async init(): Promise<void> {
    // Only initialize in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const data = await firstValueFrom(
        this.http.get<SiteStatus>('/site-status.json', { headers: { 'Cache-Control': 'no-cache' } })
          .pipe(timeout(5000)) // 5 second timeout
      );

      const cfg = data?.mourning ?? null;
      this._config$.next(cfg);

      this.applyToDom(cfg);
    } catch (error) {
      // Silently fail - app should continue loading
      this._config$.next(null);
      this.applyToDom(null);
    }
  }

  private applyToDom(cfg: MourningConfig | null) {
    // Only apply DOM changes in browser environment
    if (!isPlatformBrowser(this.platformId)) return;

    // Ensure DOM is ready
    if (typeof document === 'undefined' || !document.body) {
      // Retry after a short delay if DOM is not ready
      setTimeout(() => this.applyToDom(cfg), 100);
      return;
    }

    const body = document.body;

    // reset first
    body.classList.remove('mourning-mode', 'mourning-grayscale', 'mourning-ribbon');

    if (!cfg?.enabled) return;

    const untilMs = new Date(cfg.until).getTime();
    const nowMs = Date.now();

    if (!Number.isFinite(untilMs) || nowMs >= untilMs) return;

    body.classList.add('mourning-mode');
    if (cfg.showGrayscale) body.classList.add('mourning-grayscale');
    if (cfg.showRibbon) body.classList.add('mourning-ribbon');

    // Auto revert in client side when time hits
    const delay = untilMs - nowMs;
    if (delay > 0) {
      window.setTimeout(() => {
        if (document.body) {
          document.body.classList.remove('mourning-mode', 'mourning-grayscale', 'mourning-ribbon');
          this._config$.next({ ...cfg, enabled: false });
        }
      }, delay);
    }
  }
}
