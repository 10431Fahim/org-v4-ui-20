import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  AfterViewInit,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser, NgIf} from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  imports: [RouterLink, MatButton, TranslatePipe, NgIf],
})
export class PaymentSuccessComponent implements OnInit, AfterViewInit, OnDestroy {
  // Canvas & confetti state
  public W = 0;
  public H = 0;
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  public maxConfettis = 100;
  public particles: ConfettiParticle[] = [];
  public possibleColors: string[] = [
    'DodgerBlue',
    'OliveDrab',
    'Gold',
    'Pink',
    'SlateBlue',
    'LightBlue',
    'Gold',
    'Violet',
    'PaleGreen',
    'SteelBlue',
    'SandyBrown',
    'Chocolate',
    'Crimson',
  ];
  private animationFrameId?: number;

  // UI
  paymentId: string | null = null;
  message: string | null = null;

  // SSR guard
  public readonly isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private elRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Read query params only
    this.route.queryParamMap.subscribe((params) => {
      this.paymentId = params.get('paymentId');
      this.message = params.get('message');
    });
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      if (!this.initializeCanvas()) return;
      this.generateParticles(true);
      this.startAnimation();
    }, 0);

  }

  ngOnDestroy(): void {
    if (this.isBrowser) this.stopAnimation();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;

    const container = this.getContainerElement();
    if (!container || !this.canvas || !this.context) return;

    const newW = container.clientWidth || 0;
    const newH = container.clientHeight || 0;
    const sizeChanged = newW !== this.W || newH !== this.H;

    this.W = newW;
    this.H = newH;
    this.canvas.width = this.W;
    this.canvas.height = this.H;

    if (sizeChanged) {
      this.generateParticles(true); // redistribute for new size
    }
  }

  /** Canvas setup (browser-only) */
  private initializeCanvas(): boolean {
    const canvasEl = this.elRef.nativeElement.querySelector(
      '#canvas'
    ) as HTMLCanvasElement | null;
    if (!canvasEl) return false;

    this.canvas = canvasEl;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return false;
    this.context = ctx;

    const container = this.getContainerElement();
    if (!container) return false;

    this.W = container.clientWidth || 0;
    this.H = container.clientHeight || 0;
    this.canvas.width = this.W;
    this.canvas.height = this.H;

    return true;
  }

  private getContainerElement(): HTMLElement | null {
    return this.elRef.nativeElement.querySelector(
      '.payment-success-main'
    ) as HTMLElement | null;
  }

  randomFromTo(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  private generateParticles(reset = false): void {
    if (reset) this.particles = [];
    for (let i = 0; i < this.maxConfettis; i++) {
      this.particles.push(new ConfettiParticle(this));
    }
  }

  private startAnimation(): void {
    if (this.animationFrameId) return; // prevent duplicate loops

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);
      if (!this.context) return;

      this.context.clearRect(0, 0, this.W, this.H);
      this.particles.forEach((p) => p.draw(this.context));

      this.particles.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

        if (p.x > this.W + 30 || p.x < -30 || p.y > this.H) {
          p.x = Math.random() * this.W;
          p.y = -30;
          p.tilt = Math.floor(Math.random() * 10) - 20;
        }
      });
    };

    draw();
  }

  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    if (this.canvas) {
      this.canvas.classList.add('hidden');
      setTimeout(() => (this.canvas.style.display = 'none'), 800);
    }
  }
}

class ConfettiParticle {
  x: number;
  y: number;
  r: number;
  d: number;
  color: string;
  tilt: number;
  tiltAngleIncremental: number;
  tiltAngle: number;

  constructor(private parent: PaymentSuccessComponent) {
    const { W, H, possibleColors } = parent;
    this.x = Math.random() * W;
    this.y = Math.random() * H - H;
    this.r = parent.randomFromTo(11, 33);
    this.d = Math.random() * parent.maxConfettis + 11;
    this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.lineWidth = this.r / 2;
    context.strokeStyle = this.color;
    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    context.stroke();
  }
}
