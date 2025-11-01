import {AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild,} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PipesModule} from '../../pipes/pipes.module';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NgIf} from "@angular/common";

// (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  imports: [PipesModule, NgIf],
  standalone: true,
})
export class PdfViewerComponent implements AfterViewInit {
  isLoading = false;
  showNoPdfMessage = false;
  @ViewChild('pdfContainer', { static: true }) pdfContainer!: ElementRef<HTMLDivElement>;

  private pdf: any;
  private scale: number | null = null;
  private numPages = 0;
  private renderedPages = new Set<number>();
  private observer!: IntersectionObserver;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Inject(PLATFORM_ID) public platformId: any,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    if (this.data?.pdfFile) {
      this.loadPdf(this.data.pdfFile);
    } else {
      this.showNoPdfMessage = true;
    }
  }

  async loadPdf(url: string) {
    // try {
    //   this.isLoading = true;
    //   this.pdfContainer.nativeElement.innerHTML = '';
    //
    //   this.pdf = await pdfjsLib.getDocument(url).promise;
    //   this.numPages = this.pdf.numPages;
    //
    //   this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
    //     root: this.pdfContainer.nativeElement,
    //     threshold: 0.1
    //   });
    //
    //   for (let i = 1; i <= this.numPages; i++) {
    //     const placeholder = document.createElement('div');
    //     placeholder.id = `page-${i}`;
    //     placeholder.style.minHeight = '100px';
    //     placeholder.dataset['pageNumber'] = i.toString();
    //     this.pdfContainer.nativeElement.appendChild(placeholder);
    //     this.observer.observe(placeholder);
    //   }
    // } catch (err) {
    //   console.error('PDF load error:', err);
    //   this.showNoPdfMessage = true;
    // } finally {
    //   this.isLoading = false;
    // }
  }

  private onIntersection(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const pageNum = Number((entry.target as HTMLElement).dataset['pageNumber']);
        if (!this.renderedPages.has(pageNum)) {
          this.renderPage(pageNum, entry.target);
        }
      }
    }
  }

  async renderPage(pageNum: number, placeholder: Element) {
    const page = await this.pdf.getPage(pageNum);
    const unscaledViewport = page.getViewport({ scale: 1 });

    if (!this.scale) {
      const containerWidth = this.pdfContainer.nativeElement.clientWidth;
      this.scale = (containerWidth / unscaledViewport.width) * 0.95;
    }

    const outputScale = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale: this.scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    canvas.width = viewport.width * outputScale;
    canvas.height = viewport.height * outputScale;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    context.setTransform(outputScale, 0, 0, outputScale, 0, 0);

    await page.render({ canvasContext: context, viewport }).promise;

    this.pdfContainer.nativeElement.replaceChild(canvas, placeholder);
    this.renderedPages.add(pageNum);
  }

  onClose() {
    this.dialogRef.close();
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

