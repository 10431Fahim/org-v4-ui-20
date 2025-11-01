import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollToTopService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Scrolls to the top of the page
   * @param smooth - Whether to use smooth scrolling (default: true)
   */
  scrollToTop(smooth: boolean = true): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }

  /**
   * Scrolls to a specific element by ID
   * @param elementId - The ID of the element to scroll to
   * @param smooth - Whether to use smooth scrolling (default: true)
   */
  scrollToElement(elementId: string, smooth: boolean = true): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: smooth ? 'smooth' : 'instant',
          block: 'start'
        });
      }
    }
  }

  /**
   * Scrolls to a specific position
   * @param x - Horizontal position
   * @param y - Vertical position
   * @param smooth - Whether to use smooth scrolling (default: true)
   */
  scrollToPosition(x: number, y: number, smooth: boolean = true): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: y,
        left: x,
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }
}
