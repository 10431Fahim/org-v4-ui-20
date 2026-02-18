import { isPlatformBrowser, NgForOf, NgIf } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, signal, computed, HostListener } from '@angular/core';

@Component({
  selector: 'app-flipbook',
  imports: [NgIf],
  templateUrl: './flipbook.html',
  styleUrl: './flipbook.scss',
  standalone: true
})
export class Flipbook {
  private readonly langSignal = signal<'bn' | 'en'>('bn');

  @Input() set lang(value: 'bn' | 'en') {
    this.langSignal.set(value || 'bn');
  }

  readonly title = computed(() =>
    this.langSignal() === 'bn' ? `বিএনপি'র নির্বাচনী ইশতেহার ২০২৬` : `BNP's Election Manifesto 2026`
  );

  readonly subtitle = computed(() =>
    this.langSignal() === 'bn'
      ? '১৩ ফেব্রুয়ারী শুরু হবে জনগণের দিন, ইনশাআল্লাহ - <span class="highlight-name">তারেক রহমান</span>'
      : 'From the 13th February, the People’s Days will begin Insa\'Allah - <span class="highlight-name">Tarique Rahman</span>'
  );

  readonly currentIndex = signal(0);
  readonly isAnimating = signal(false);
  readonly animationDirection = signal<'next' | 'prev'>('next');
  readonly prevIndex = signal(0);

  readonly isBrowser = signal(false);
  readonly zoomLevel = signal(1);
  readonly isFullscreen = signal(false);

  // Pan state
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly isPanning = signal(false);
  private isDragging = false;
  private lastX = 0;
  private lastY = 0;

  private readonly TOTAL_PAGES = 40;

  readonly pages = computed(() => {
    const folder = this.langSignal() === 'en' ? 'en' : 'bn';
    const baseUrl = `/flipbooks/${folder}/pagess`;

    return Array.from({ length: this.TOTAL_PAGES }).map((_, i) =>
      `${baseUrl}/p${String(i + 1).padStart(3, '0')}.jpg`
    );
  });

  readonly currentPageLabel = computed(() => {
    const current = this.currentIndex();
    const total = this.TOTAL_PAGES;
    const isMobile = this.isBrowser() && window.innerWidth < 820;

    if (isMobile) {
      return `Page ${current + 1} / ${total}`;
    } else {
      const left = current + 1;
      const right = Math.min(current + 2, total);
      return `Pages ${left} ${right < total ? '– ' + right : ''} / ${total}`;
    }
  });

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
    if (event.key === 'Escape' && this.isFullscreen()) this.toggleFullscreen();
  }

  @HostListener('window:fullscreenchange')
  onFullscreenChange() {
    this.isFullscreen.set(!!document.fullscreenElement);
    if (!this.isFullscreen()) this.resetZoom();
  }

  next(): void {
    if (this.isAnimating()) return;
    const step = this.getStep();
    if (this.currentIndex() + step < this.TOTAL_PAGES) {
      this.prevIndex.set(this.currentIndex());
      this.animationDirection.set('next');
      this.isAnimating.set(true);

      setTimeout(() => {
        this.currentIndex.update(v => v + step);
        // Sync exactly with CSS 600ms
        setTimeout(() => this.isAnimating.set(false), 600);
      }, 50);
    }
  }

  prev(): void {
    if (this.isAnimating()) return;
    const step = this.getStep();
    if (this.currentIndex() - step >= 0) {
      this.prevIndex.set(this.currentIndex());
      this.animationDirection.set('prev');
      this.isAnimating.set(true);

      setTimeout(() => {
        this.currentIndex.update(v => v - step);
        // Sync exactly with CSS 600ms
        setTimeout(() => this.isAnimating.set(false), 600);
      }, 50);
    }
  }

  private getStep(): number {
    if (!this.isBrowser()) return 2;
    return window.innerWidth < 820 ? 1 : 2;
  }

  zoomIn(): void {
    if (this.zoomLevel() < 3) {
      this.zoomLevel.update(z => z + 0.5);
    }
  }

  zoomOut(): void {
    if (this.zoomLevel() > 1) {
      this.zoomLevel.update(z => z - 0.5);
      if (this.zoomLevel() === 1) this.resetPan();
    }
  }

  resetZoom(): void {
    this.zoomLevel.set(1);
    this.resetPan();
  }

  private resetPan(): void {
    this.panX.set(0);
    this.panY.set(0);
  }

  onMouseDown(e: MouseEvent | TouchEvent): void {
    if (this.zoomLevel() <= 1) return;
    this.isDragging = true;
    this.isPanning.set(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    this.lastX = clientX;
    this.lastY = clientY;
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onMouseMove(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging || this.zoomLevel() <= 1) return;

    if ('cancelable' in e && e.cancelable) e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - this.lastX;
    const dy = clientY - this.lastY;

    this.panX.update(x => x + dx);
    this.panY.update(y => y + dy);

    this.lastX = clientX;
    this.lastY = clientY;
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onMouseUp(): void {
    this.isDragging = false;
    this.isPanning.set(false);
  }

  private startX: number | null = null;
  onTouchStart(e: TouchEvent): void {
    if (this.zoomLevel() > 1) {
      this.onMouseDown(e);
      return;
    }
    this.startX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    if (this.zoomLevel() > 1) {
      this.onMouseUp();
      return;
    }
    if (this.startX === null) return;
    const dx = e.changedTouches[0].clientX - this.startX;
    this.startX = null;
    if (Math.abs(dx) > 40) dx < 0 ? this.next() : this.prev();
  }

  toggleFullscreen(): void {
    if (!this.isBrowser()) return;
    const el = document.getElementById('fb-container');
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => console.error(err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    }
  }
}
