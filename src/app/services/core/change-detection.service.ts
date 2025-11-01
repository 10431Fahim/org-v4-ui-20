import { Injectable, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChangeDetectionService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  /**
   * Trigger change detection safely for zoneless change detection
   * @param cdr ChangeDetectorRef instance
   */
  triggerChangeDetection(cdr: ChangeDetectorRef): void {
    if (isPlatformBrowser(this.platformId)) {
      // Use setTimeout to ensure change detection runs in the next tick
      setTimeout(() => {
        cdr.detectChanges();
      }, 0);
    }
  }

  /**
   * Trigger change detection immediately
   * @param cdr ChangeDetectorRef instance
   */
  triggerChangeDetectionImmediate(cdr: ChangeDetectorRef): void {
    if (isPlatformBrowser(this.platformId)) {
      cdr.detectChanges();
    }
  }

  /**
   * Trigger change detection with a small delay for better UX
   * @param cdr ChangeDetectorRef instance
   * @param delay Optional delay in milliseconds (default: 100ms)
   */
  triggerChangeDetectionWithDelay(cdr: ChangeDetectorRef, delay: number = 100): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        cdr.detectChanges();
      }, delay);
    }
  }
}