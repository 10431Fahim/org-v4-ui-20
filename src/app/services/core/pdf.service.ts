import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface PDFPage {
  id: number;
  imageUrl: string;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class PDFService {
  private pdfjsLib: any;
  private isPDFJSLoaded = false;

  constructor() {
    this.loadPDFJS();
  }

  private loadPDFJS(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isPDFJSLoaded) {
        resolve();
        return;
      }

      // Check if PDF.js is already loaded
      if ((window as any).pdfjsLib) {
        this.pdfjsLib = (window as any).pdfjsLib;
        this.isPDFJSLoaded = true;
        resolve();
        return;
      }

      // Load PDF.js from CDN with fallback
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      
      script.onload = () => {
        clearTimeout(timeout);
        try {
          this.pdfjsLib = (window as any).pdfjsLib;
          if (!this.pdfjsLib) {
            reject(new Error('PDF.js library not found after loading'));
            return;
          }
          this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          this.isPDFJSLoaded = true;
          console.log('PDF.js library loaded successfully');
          resolve();
        } catch (error: any) {
          reject(new Error('Failed to initialize PDF.js library: ' + error.message));
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load PDF.js library from CDN'));
      };
      
      // Set timeout for loading
      const timeout = setTimeout(() => {
        reject(new Error('PDF.js library loading timeout'));
      }, 10000); // 10 seconds timeout
      
      document.head.appendChild(script);
    });
  }

  loadPDFFromUrl(url: string): Observable<{ totalPages: number; pages: PDFPage[] }> {
    return from(this.loadPDFJS()).pipe(
      switchMap(() => from(this.loadPDFDocument(url))),
      catchError(error => throwError(() => error))
    );
  }

  private async loadPDFDocument(url: string): Promise<{ totalPages: number; pages: PDFPage[] }> {
    try {
      console.log('Loading PDF document from:', url);
      
      // Load the PDF document
      const loadingTask = this.pdfjsLib.getDocument(url);
      const pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;
      
      console.log('PDF document loaded, total pages:', totalPages);

      // Convert all pages to images
      const pages: PDFPage[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: ctx,
            viewport: viewport
          }).promise;

          // Convert canvas to blob URL
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
          });

          const imageUrl = URL.createObjectURL(blob);

          pages.push({
            id: pageNum - 1,
            imageUrl: imageUrl,
            width: viewport.width,
            height: viewport.height
          });

        } catch (error) {
          console.error(`Error converting page ${pageNum}:`, error);
          throw error;
        }
      }

      return { totalPages, pages };

    } catch (error) {
      console.error('PDF loading error:', error);
      throw new Error('Failed to load PDF file');
    }
  }

  // Method to preload PDF for better performance
  preloadPDF(url: string): Observable<void> {
    return from(this.loadPDFJS()).pipe(
      switchMap(() => from(this.preloadPDFDocument(url))),
      catchError(error => throwError(() => error))
    );
  }

  private async preloadPDFDocument(url: string): Promise<void> {
    try {
      const loadingTask = this.pdfjsLib.getDocument(url);
      await loadingTask.promise;
    } catch (error) {
      console.error('PDF preloading error:', error);
      throw new Error('Failed to preload PDF file');
    }
  }

  // Cleanup method to revoke blob URLs
  cleanupPages(pages: PDFPage[]): void {
    pages.forEach(page => {
      if (page.imageUrl && page.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(page.imageUrl);
      }
    });
  }

  // Get PDF metadata
  getPDFMetadata(url: string): Observable<{ totalPages: number; title?: string; author?: string }> {
    return from(this.loadPDFJS()).pipe(
      switchMap(() => from(this.getPDFDocumentMetadata(url))),
      catchError(error => throwError(() => error))
    );
  }

  private async getPDFDocumentMetadata(url: string): Promise<{ totalPages: number; title?: string; author?: string }> {
    try {
      const loadingTask = this.pdfjsLib.getDocument(url);
      const pdfDoc = await loadingTask.promise;
      
      const metadata = await pdfDoc.getMetadata();
      
      return {
        totalPages: pdfDoc.numPages,
        title: metadata?.info?.Title,
        author: metadata?.info?.Author
      };
    } catch (error) {
      console.error('PDF metadata error:', error);
      throw new Error('Failed to get PDF metadata');
    }
  }

  // Validate PDF URL
  validatePDFUrl(url: string): boolean {
    // Allow local asset paths (starting with /assets/)
    if (url.startsWith('/assets/')) {
      return true;
    }
    
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  // Get optimal scale for device
  getOptimalScale(devicePixelRatio: number = 1): number {
    return Math.min(devicePixelRatio * 1.5, 3.0);
  }
} 