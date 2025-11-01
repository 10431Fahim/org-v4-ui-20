import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef, HostListener, Inject, Input,
  OnDestroy,
  OnInit, PLATFORM_ID,
  QueryList, Renderer2,
  ViewChild, signal, computed, effect
} from '@angular/core';
import {isPlatformBrowser, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
  imports: [
    NgForOf,
    NgIf
  ],
  standalone: true
})

export class SwiperComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('sliderTrack') sliderTrack!: ElementRef;

  @ContentChildren('sliderItem', {read: ElementRef}) items!: QueryList<ElementRef>;

  @Input() visibleSlides: number = 4;
  @Input() gap: number = 20;
  @Input() autoplay: boolean = false;
  @Input() autoplayInterval: number = 3000;
  @Input() pagination: boolean = true;
  @Input() loop: boolean = false;
  @Input() breakpoints: any = {};
  @Input() navigation: boolean = true;

  private initialized: boolean = false;
  private resizeObserver: ResizeObserver | null = null;
  private currentBreakpoint: string = '';
  private resizeTimeout: any;

  // Angular 20 Signals for reactive state management
  currentIndex = signal<number>(0);
  isDragging = signal<boolean>(false);
  totalSlides = signal<number>(0);

  // Other properties
  startX: number = 0;
  currentX: number = 0;
  walkDistance: number = 0;
  currentTranslate: number = 0;
  prevTranslate: number = 0;
  animationID: number = 0;
  dragThreshold: number = 20;
  autoplayTimer: any;
  itemWidth: number = 0;
  lastTime: number = 0;
  velocity: number = 0;
  originalItems: ElementRef[] = [];
  isTransitioning: boolean = false;
  private hasDragged: boolean = false;
  private clickStartTime: number = 0;
  private touchStartPosition: { x: number; y: number } | null = null;
  private shouldPreventClicks: boolean = false;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.handleResize = this.handleResize.bind(this);
    
    // Watch for changes in totalSlides to reinitialize
    effect(() => {
      const total = this.totalSlides();
      if (total > 0 && this.initialized) {
        // Content has changed, reinitialize
        setTimeout(() => {
          this.initializeSlider();
        }, 50);
      }
    });
  }

  // Computed signals for stable template expressions
  maxIndex = computed(() => {
    const total = this.totalSlides();
    return this.loop
      ? total - 1
      : Math.max(0, total - this.visibleSlides);
  });

  isPrevDisabled = computed(() => {
    return !this.loop && this.currentIndex() === 0;
  });

  isNextDisabled = computed(() => {
    return !this.loop && this.currentIndex() >= this.maxIndex();
  });

  get currentPage(): number {
    let adjustedIndex = this.currentIndex();
    if (this.loop) {
      adjustedIndex = (this.currentIndex() - this.visibleSlides + this.totalSlides()) % this.totalSlides();
    }
    return Math.floor(adjustedIndex / this.visibleSlides);
  }

  get totalPages(): number {
    return Math.ceil(this.totalSlides() / this.visibleSlides);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
          this.handleResize();
        }, 100);
      });

      if (this.autoplay) {
        this.startAutoplay();
      }
      window.addEventListener('resize', this.handleResize);
      this.updateBreakpoint();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Use a longer timeout to ensure content is loaded
      setTimeout(() => {
        this.initializeSlider();
        if (this.sliderTrack && this.resizeObserver) {
          this.resizeObserver.observe(this.sliderTrack.nativeElement);
        }
        this.setupClickPrevention();
      }, 300);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.handleResize);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
    }
    this.stopAutoplay();
  }

  private initializeSlider(): void {
    if (!this.sliderTrack || !this.items?.length) {
      // Retry initialization after a short delay if content is not ready
      setTimeout(() => {
        if (this.sliderTrack && this.items?.length) {
          this.initializeSlider();
        }
      }, 100);
      return;
    }

    const track = this.sliderTrack.nativeElement;
    const container = track.parentElement;

    // Store original items
    this.originalItems = this.items.toArray();
    this.totalSlides.set(this.originalItems.length);

    // console.log('Swiper initialized:', {
    //   totalSlides: this.totalSlides(),
    //   visibleSlides: this.visibleSlides,
    //   loop: this.loop,
    //   currentIndex: this.currentIndex()
    // });

    // Clear existing clones
    track.querySelectorAll('.clone').forEach((clone: Element) => clone.remove());

    // Calculate dimensions
    const containerWidth = container.offsetWidth;
    const currentGap = this.gap;
    const totalGaps = Math.ceil(this.visibleSlides) - 1;
    const availableWidth = containerWidth - (currentGap * totalGaps);
    const slideWidth = availableWidth / this.visibleSlides;

    // Update track styles
    this.renderer.setStyle(track, '--slide-gap', `${currentGap}px`);
    this.renderer.setStyle(track, '--slide-width', `${slideWidth}px`);

    // Apply styles to items
    this.items.forEach((item, index) => {
      const element = item.nativeElement;
      this.renderer.setStyle(element, 'width', `${slideWidth}px`);
      this.renderer.setStyle(element, 'flex', `0 0 ${slideWidth}px`);

      if (index < this.items.length - 1 || this.loop) {
        this.renderer.setStyle(element, 'margin-right', `${currentGap}px`);
      } else {
        this.renderer.setStyle(element, 'margin-right', '0');
      }
    });

    this.itemWidth = slideWidth;

    if (this.loop) {
      this.setupLoop(track);
      this.currentIndex.set(this.visibleSlides);
    } else {
      this.currentIndex.set(0);
    }

    this.updateSliderPosition(false);
    this.initialized = true;
  }

  private setupLoop(track: HTMLElement): void {
    const slidesToClone = Math.ceil(this.visibleSlides);

    // Clone items for both ends
    const beforeClones = this.originalItems.slice(-slidesToClone).map(item => {
      const clone = item.nativeElement.cloneNode(true);
      this.renderer.addClass(clone, 'clone');
      this.renderer.setStyle(clone, 'width', `${this.itemWidth}px`);
      this.renderer.setStyle(clone, 'flex', `0 0 ${this.itemWidth}px`);
      this.renderer.setStyle(clone, 'margin-right', `${this.gap}px`);
      return clone;
    });

    const afterClones = this.originalItems.slice(0, slidesToClone).map(item => {
      const clone = item.nativeElement.cloneNode(true);
      this.renderer.addClass(clone, 'clone');
      this.renderer.setStyle(clone, 'width', `${this.itemWidth}px`);
      this.renderer.setStyle(clone, 'flex', `0 0 ${this.itemWidth}px`);
      this.renderer.setStyle(clone, 'margin-right', `${this.gap}px`);
      return clone;
    });

    beforeClones.forEach(clone => {
      this.renderer.insertBefore(track, clone, track.firstChild);
    });

    afterClones.forEach(clone => {
      this.renderer.appendChild(track, clone);
    });

    // Remove the gap on the very last element in the track
    const lastChild = track.lastElementChild;
    if (lastChild) {
      this.renderer.setStyle(lastChild, 'margin-right', '0');
    }
  }

  private handleLoop(): void {
    if (!this.loop || this.isTransitioning) return;

    const track = this.sliderTrack.nativeElement;

    if (this.currentIndex() >= this.totalSlides() + this.visibleSlides) {
      this.isTransitioning = true;
      this.currentIndex.set(this.visibleSlides);
      this.renderer.setStyle(track, 'transition', 'none');
      this.updateSliderPosition(false);
      requestAnimationFrame(() => {
        this.renderer.setStyle(track, 'transition', 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)');
        this.isTransitioning = false;
      });
    } else if (this.currentIndex() < this.visibleSlides) {
      this.isTransitioning = true;
      this.currentIndex.set(this.totalSlides() + this.visibleSlides - 1);
      this.renderer.setStyle(track, 'transition', 'none');
      this.updateSliderPosition(false);
      requestAnimationFrame(() => {
        this.renderer.setStyle(track, 'transition', 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)');
        this.isTransitioning = false;
      });
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  stopDragging(): void {
    if (!this.isDragging()) return;

    this.isDragging.set(false);
    cancelAnimationFrame(this.animationID);

    const track = this.sliderTrack.nativeElement;
    this.renderer.setStyle(track, 'cursor', 'grab');

    const momentumDistance = this.velocity * 200;
    const totalMovement = this.walkDistance + momentumDistance;
    const slideWidth = this.itemWidth + this.gap;
    let slidesToMove = Math.round(totalMovement / slideWidth);

    if (Math.abs(totalMovement) < this.dragThreshold) {
      slidesToMove = 0;
    }

    if (this.loop) {
      this.currentIndex.set(this.currentIndex() - slidesToMove);
    } else {
      this.currentIndex.set(Math.max(0, Math.min(this.maxIndex(), this.currentIndex() - slidesToMove)));
    }

    this.updateSliderPosition(true);

    setTimeout(() => {
      this.walkDistance = 0;
      this.hasDragged = false;
      this.shouldPreventClicks = false;
      this.touchStartPosition = null;
    }, 150);

    this.velocity = 0;
  }

  private updateSliderPosition(animate: boolean = true): void {
    const track = this.sliderTrack.nativeElement;

    if (animate) {
      this.renderer.setStyle(track, 'transition', 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)');
    } else {
      this.renderer.setStyle(track, 'transition', 'none');
    }

    const position = -(this.currentIndex() * (this.itemWidth + this.gap));
    this.renderer.setStyle(track, 'transform', `translateX(${position}px)`);
    this.currentTranslate = position;
    this.prevTranslate = position;

    if (animate && this.loop) {
      setTimeout(() => this.handleLoop(), 400);
    }
  }

  private handleResize(): void {
    this.updateBreakpoint();
    this.initializeSlider();
  }

  private updateBreakpoint(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const windowWidth = window.innerWidth;

    if (!this.breakpoints || Object.keys(this.breakpoints).length === 0) {
      return;
    }

    const breakpointWidths = Object.keys(this.breakpoints)
      .map(Number)
      .sort((a, b) => b - a);

    let newBreakpoint = '';

    for (const width of breakpointWidths) {
      if (windowWidth >= width) {
        newBreakpoint = width.toString();
        break;
      }
    }

    if (!newBreakpoint && breakpointWidths.length > 0) {
      newBreakpoint = Math.min(...breakpointWidths).toString();
    }

    if (this.currentBreakpoint !== newBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      const config = this.breakpoints[newBreakpoint];

      if (config) {
        const oldVisibleSlides = this.visibleSlides;
        const oldGap = this.gap;

        this.visibleSlides = config.visibleSlides ?? config.slidesPerView ?? this.visibleSlides;
        this.gap = config.gap ?? config.spaceBetween ?? this.gap;

        // console.log(`Breakpoint changed: ${windowWidth}px -> ${newBreakpoint}px`);
        // console.log(`Visible slides: ${oldVisibleSlides} -> ${this.visibleSlides}`);
        // console.log(`Gap: ${oldGap} -> ${this.gap}`);
      }
    }
  }

  startDragging(event: MouseEvent | TouchEvent): void {
    this.isDragging.set(true);
    this.hasDragged = false;
    this.clickStartTime = Date.now();
    this.shouldPreventClicks = false;

    if (event instanceof TouchEvent) {
      this.touchStartPosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else {
      this.touchStartPosition = {
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY
      };
    }

    this.startX = this.getPositionX(event);
    this.currentX = this.startX;
    this.lastTime = Date.now();
    this.velocity = 0;

    const track = this.sliderTrack.nativeElement;
    this.renderer.setStyle(track, 'transition', 'none');
    this.renderer.setStyle(track, 'cursor', 'grabbing');

    const style = window.getComputedStyle(track);
    const matrix = new WebKitCSSMatrix(style.transform);
    this.currentTranslate = matrix.m41;
    this.prevTranslate = this.currentTranslate;

    cancelAnimationFrame(this.animationID);
    this.animate();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  drag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging()) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;
    const currentPosition = this.getPositionX(event);
    const deltaX = currentPosition - this.currentX;

    this.velocity = deltaX / deltaTime;
    this.currentX = currentPosition;
    this.lastTime = currentTime;
    this.walkDistance = this.currentX - this.startX;

    if (Math.abs(this.walkDistance) > 10) {
      this.hasDragged = true;
      this.shouldPreventClicks = true;
    }

    if (this.touchStartPosition) {
      const currentPosition = this.getPositionX(event);
      const deltaX = Math.abs(currentPosition - this.touchStartPosition.x);
      const deltaY = Math.abs((event instanceof TouchEvent ? event.touches[0].clientY : (event as MouseEvent).clientY) - this.touchStartPosition.y);

      if (deltaX > 20 && deltaX > deltaY * 1.5) {
        this.hasDragged = true;
        this.shouldPreventClicks = true;
      }
    }

    if (this.hasDragged) {
      event.preventDefault();
      event.stopPropagation();
    }

    const newTranslate = this.prevTranslate + this.walkDistance;
    const minTranslate = -(this.maxIndex() * (this.itemWidth + this.gap));
    const maxTranslate = 0;

    if (newTranslate > maxTranslate) {
      this.currentTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.2;
    } else if (newTranslate < minTranslate) {
      this.currentTranslate = minTranslate + (newTranslate - minTranslate) * 0.2;
    } else {
      this.currentTranslate = newTranslate;
    }
  }

  private animate(): void {
    if (this.isDragging()) {
      this.setSliderPosition();
      this.animationID = requestAnimationFrame(() => this.animate());
    }
  }

  private setSliderPosition(): void {
    const track = this.sliderTrack.nativeElement;
    this.renderer.setStyle(track, 'transform', `translateX(${this.currentTranslate}px)`);
  }

  private getPositionX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  private startAutoplay(): void {
    if (this.autoplay) {
      this.autoplayTimer = setInterval(() => {
        if (!this.isDragging()) {
          if (this.loop) {
            this.slide('next');
          } else {
            if (this.currentIndex() < this.maxIndex()) {
              this.slide('next');
            } else {
              this.currentIndex.set(0);
              this.updateSliderPosition();
            }
          }
        }
      }, this.autoplayInterval);
    }
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.stopAutoplay();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  slide(direction: 'prev' | 'next'): void {
    console.log('Slide called:', direction, {
      currentIndex: this.currentIndex(),
      maxIndex: this.maxIndex(),
      loop: this.loop
    });

    if (direction === 'prev') {
      this.currentIndex.set(this.loop
        ? this.currentIndex() - 1
        : Math.max(0, this.currentIndex() - 1));
    } else {
      this.currentIndex.set(this.loop
        ? this.currentIndex() + 1
        : Math.min(this.maxIndex(), this.currentIndex() + 1));
    }

    console.log('New currentIndex:', this.currentIndex());
    this.updateSliderPosition(true);
  }

  goToPage(pageIndex: number): void {
    this.currentIndex.set(this.loop
      ? pageIndex * this.visibleSlides + this.visibleSlides
      : pageIndex * this.visibleSlides);
    this.updateSliderPosition();
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
    }
  }

  @HostListener('click', ['$event'])
  onSwiperClick(event: Event): void {
    const clickDuration = Date.now() - this.clickStartTime;
    const target = event.target as HTMLElement;
    const isClickableElement = target.closest('a[routerLink], button, [routerLink], a');

    const dragThreshold = 15;
    const timeThreshold = 500;

    if (isClickableElement && (this.hasDragged || clickDuration > timeThreshold || Math.abs(this.walkDistance) > dragThreshold)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  private setupClickPrevention(): void {
    if (!this.sliderTrack) return;

    const track = this.sliderTrack.nativeElement;
    const clickableElements = track.querySelectorAll('a[routerLink], button, [routerLink], a');

    clickableElements.forEach((element: HTMLElement) => {
      element.addEventListener('click', (event: Event) => {
        const clickDuration = Date.now() - this.clickStartTime;
        const dragThreshold = 15;
        const timeThreshold = 500;

        if (this.hasDragged || clickDuration > timeThreshold || Math.abs(this.walkDistance) > dragThreshold) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      }, true);
    });
  }

  // Public method to refresh the swiper when content changes
  refresh(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeSlider();
      }, 50);
    }
  }
}
