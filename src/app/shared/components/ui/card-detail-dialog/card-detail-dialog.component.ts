import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface CardDetailData {
  id: number;
  icon: string;
  title: string;
  titleEn: string;
  slug: string;
  pdfUrl?: string;
  imageUrl?: string;
  description?: string;
  description1?: string;
  benefits?: string[];
  faqs?: { question: string; answer: string }[];
  faqImages?: string[];
}

@Component({
  selector: 'app-card-detail-dialog',
  templateUrl: './card-detail-dialog.component.html',
  styleUrls: ['./card-detail-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CardDetailDialogComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  public dialogRef = inject(MatDialogRef<CardDetailDialogComponent>);
  public data = inject<CardDetailData>(MAT_DIALOG_DATA);

  safePdfUrl: SafeResourceUrl | null = null;
  expandedFaqIndex: number | null = null;

  constructor() { }

  ngOnInit(): void {
    // If PDF URL is provided, sanitize it
    if (this.data.pdfUrl) {
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdfUrl);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  downloadPdf(): void {
    if (this.data.pdfUrl) {
      window.open(this.data.pdfUrl, '_blank');
    }
  }

  /**
   * Toggle FAQ answer visibility
   */
  toggleFaq(index: number): void {
    this.expandedFaqIndex = this.expandedFaqIndex === index ? null : index;
  }

  /**
   * Download or open FAQ image in new tab
   */
  downloadFaqImage(url: string): void {
    if (url) {
      // Trigger direct download instead of opening new tab
      const link = document.createElement('a');
      link.href = url;
      // Try to infer a filename from the URL; fallback to generic
      const parts = url.split('/');
      link.download = parts[parts.length - 1] || 'download';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
