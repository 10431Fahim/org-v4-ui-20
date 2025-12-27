import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-floating-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #wrap class="fab-wrap" [class.open]="open" *ngIf="isBrowser">
      <button
        type="button"
        class="fab"
        (click)="toggleMenu($event)"
        [attr.aria-haspopup]="true"
        [attr.aria-expanded]="open"
        aria-controls="fab-menu"
      >
        <i class="icon" aria-hidden="true"></i>

        <div
          id="fab-menu"
          class="fab-items"
          [attr.inert]="!open ? '' : null"
          [attr.hidden]="!open ? '' : null"
        >
          <button class="fab-item item-1" type="button" (click)="onSelect('membership')">
            Membership Fee
          </button>
          <button class="fab-item item-2" type="button" (click)="onSelect('primary')">
            Primary Member Fee
          </button>
          <button class="fab-item item-3" type="button" (click)="onSelect('donate')">
            Donate
          </button>
        </div>
      </button>
    </div>
  `,
  styles: [`
    .fab-wrap {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      z-index: 9999;
      touch-action: none;
      user-select: none;
    }

    .fab {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #6c3cff;
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      touch-action: none;
      user-select: none;
      position: relative;
    }

    .fab .icon {
      width: 24px;
      height: 24px;
      background: currentColor;
      -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect x="4" y="7" width="16" height="2" fill="white"/><rect x="4" y="11" width="16" height="2" fill="white"/><rect x="4" y="15" width="16" height="2" fill="white"/></svg>')
      center/contain no-repeat;
      mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect x="4" y="7" width="16" height="2" fill="white"/><rect x="4" y="11" width="16" height="2" fill="white"/><rect x="4" y="15" width="16" height="2" fill="white"/></svg>')
      center/contain no-repeat;
      pointer-events: none;
    }

    .fab-items {
      position: absolute;
      inset: 0;
      pointer-events: none; /* keep drag active on wrap */
    }

    .fab-item {
      position: absolute;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #fff;
      color: #111;
      display: grid;
      place-items: center;
      opacity: 0;
      transform: scale(0.5);
      transition: transform 0.25s, opacity 0.2s;
      text-decoration: none;
      font-weight: 500;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      touch-action: none;
      user-select: none;
      border: none;
      pointer-events: none;
    }

    .fab-wrap.open .fab-item {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    .fab-item.item-1 {
      top: -70px;
      left: 8px;
    }
    .fab-item.item-2 {
      left: -70px;
      top: 8px;
    }
    .fab-item.item-3 {
      left: -50px;
      top: -50px;
    }
  `],
})
export class FloatingFabComponent implements AfterViewInit, OnDestroy {
  @ViewChild('wrap') wrapRef!: ElementRef<HTMLDivElement>;
  isBrowser = false;
  open = false;

  private dragging = false;
  private wasDragging = false;
  private startX = 0;
  private startY = 0;
  private origLeft = 0;
  private origTop = 0;
  private pointerId: number | null = null;
  private readonly STORAGE_KEY = 'fab-position';

  private onPointerDownRef = (e: PointerEvent) => this.onPointerDown(e);
  private onPointerMoveRef = (e: PointerEvent) => this.onPointerMove(e);
  private onPointerUpRef = (e: PointerEvent) => this.onPointerUp(e);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const wrap = this.wrapRef.nativeElement;

    // Restore saved position
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const pos = JSON.parse(saved);
      wrap.style.left = pos.x + 'px';
      wrap.style.top = pos.y + 'px';
      wrap.style.right = 'auto';
      wrap.style.bottom = 'auto';
    }

    // Event listeners
    wrap.addEventListener('pointerdown', this.onPointerDownRef, { passive: false, capture: true });
    window.addEventListener('pointermove', this.onPointerMoveRef, { passive: false });
    window.addEventListener('pointerup', this.onPointerUpRef, { passive: false });
    window.addEventListener('pointercancel', this.onPointerUpRef as any, { passive: false });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    const wrap = this.wrapRef?.nativeElement;
    if (wrap) wrap.removeEventListener('pointerdown', this.onPointerDownRef);
    window.removeEventListener('pointermove', this.onPointerMoveRef as any);
    window.removeEventListener('pointerup', this.onPointerUpRef as any);
    window.removeEventListener('pointercancel', this.onPointerUpRef as any);
  }

  toggleMenu(e: MouseEvent) {
    if (this.wasDragging) {
      this.wasDragging = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.open = !this.open;
    const host = this.wrapRef.nativeElement;
    const fabBtn = host.querySelector<HTMLButtonElement>('.fab');
    const firstItem = host.querySelector<HTMLButtonElement>('.fab-item');

    // Focus management
    if (this.open && firstItem) {
      setTimeout(() => firstItem.focus(), 0);
    } else if (fabBtn) {
      setTimeout(() => fabBtn.focus(), 0);
    }
  }

  onSelect(which: string) {
    // Example action handler — replace with your logic
    console.log('Selected:', which);
    this.open = false;

    const fabBtn = this.wrapRef.nativeElement.querySelector<HTMLButtonElement>('.fab');
    fabBtn?.focus();
  }

  private onPointerDown(e: PointerEvent) {
    this.dragging = true;
    this.wasDragging = false;
    this.startX = e.clientX;
    this.startY = e.clientY;

    const rect = this.wrapRef.nativeElement.getBoundingClientRect();
    this.origLeft = rect.left;
    this.origTop = rect.top;
    this.wrapRef.nativeElement.style.transition = 'none';

    this.pointerId = e.pointerId;
    try {
      this.wrapRef.nativeElement.setPointerCapture(e.pointerId);
    } catch {}
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.dragging) return;
    e.preventDefault();

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.wasDragging = true;

    const wrap = this.wrapRef.nativeElement;
    const nx = this.origLeft + dx;
    const ny = this.origTop + dy;

    wrap.style.left = nx + 'px';
    wrap.style.top = ny + 'px';
    wrap.style.right = 'auto';
    wrap.style.bottom = 'auto';
  }

  private onPointerUp(e: PointerEvent) {
    if (!this.dragging) return;
    this.dragging = false;

    const wrap = this.wrapRef.nativeElement;
    wrap.style.transition = '';

    if (this.pointerId !== null) {
      try {
        wrap.releasePointerCapture(this.pointerId);
      } catch {}
      this.pointerId = null;
    }

    const rect = wrap.getBoundingClientRect();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ x: rect.left, y: rect.top }));
  }
}
