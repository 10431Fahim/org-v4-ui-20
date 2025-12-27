import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: 'img[src]', // auto apply to all <img src="...">
  standalone:true,
})
export class AutoCrossoriginDirective implements AfterViewInit, OnDestroy {
  private observer!: MutationObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const img = this.el.nativeElement as HTMLImageElement;

    const apply = () => {
      const src = img.getAttribute('src') || '';
      if (src.includes('api.bnpbd.org')) {
        this.renderer.setAttribute(img, 'crossorigin', 'anonymous');
      }
    };

    apply();

    this.observer = new MutationObserver(() => apply());
    this.observer.observe(img, { attributes: true, attributeFilter: ['src'] });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
