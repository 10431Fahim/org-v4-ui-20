import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CardDetailDialogComponent, CardDetailData } from '../../shared/components/ui/card-detail-dialog/card-detail-dialog.component';

@Component({
  selector: 'app-plan-to-build-nation',
  templateUrl: './plan-to-build-nation.component.html',
  styleUrls: ['./plan-to-build-nation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class PlanToBuildNationComponent implements OnInit {

  // Card data based on image description
  cards = [
    {
      id: 1,
      icon: 'family_restroom',
      title: 'ফ্যামিলি কার্ড',
      titleEn: 'Family Card',
      slug: 'family-card',
      pdfUrl: '', // Add PDF URL here when available
      description: 'ফ্যামিলি কার্ডের মাধ্যমে পর্যায়ক্রমে দেশের প্রতিটি পরিবারকে বিএনপি সরকার দিবে',
      benefits: [
        'প্রতি মাসে ২০০০-২৫০০ টাকার আর্থিক সহায়তা অথবা খাদ্য সুবিধা যথা: চাল, ডাল, তেল, লবণসহ নিত্যপ্রয়োজনীয় পণ্য',
        'দারিদ্র্য বিমোচন, ক্ষুধামুক্তি ও নারীর স্বাবলম্বী হওয়ার নিশ্চয়তা',
        'একটি কার্ডেই পরিবারের নিরাপত্তা',
        'স্বাবলম্বী পরিবার গড়ার প্রতিশ্রুতি'
      ]
    },
    {
      id: 2,
      icon: 'favorite',
      title: 'স্বাস্থ্য',
      titleEn: 'Health',
      slug: 'health'
    },
    {
      id: 3,
      icon: 'school',
      title: 'শিক্ষা',
      titleEn: 'Education',
      slug: 'education'
    },
    {
      id: 4,
      icon: 'emoji_events',
      title: 'ক্রীড়া',
      titleEn: 'Sports',
      slug: 'sports'
    },
    {
      id: 5,
      icon: 'public',
      title: 'প্রবাসী',
      titleEn: 'Expatriate',
      slug: 'expatriate'
    },
    {
      id: 6,
      icon: 'agriculture',
      title: 'কৃষক কার্ড',
      titleEn: 'Farmer Card',
      slug: 'farmer-card'
    },
    {
      id: 7,
      icon: 'work',
      title: 'কর্মসংস্থান',
      titleEn: 'Employment',
      slug: 'employment'
    },
    {
      id: 8,
      icon: 'eco',
      title: 'পরিবেশ',
      titleEn: 'Environment',
      slug: 'environment'
    },
    {
      id: 9,
      icon: 'mosque',
      title: 'ইমাম মুয়াজ্জিনদের সম্মানী',
      titleEn: 'Imam Muezzin\'s Honorarium',
      slug: 'imam-muezzin-honorarium'
    },
    {
      id: 10,
      icon: 'security',
      title: 'দুর্নীতিমুক্ত বাংলাদেশ',
      titleEn: 'Corruption-free Bangladesh',
      slug: 'corruption-free-bangladesh'
    }
  ];

  private router = inject(Router);
  private dialog = inject(MatDialog);

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Open card details dialog
   */
  onCardClick(card: any) {
    const dialogData: CardDetailData = {
      id: card.id,
      icon: card.icon,
      title: card.title,
      titleEn: card.titleEn,
      slug: card.slug,
      pdfUrl: card.pdfUrl || undefined,
      imageUrl: card.imageUrl || undefined,
      description: card.description || undefined,
      benefits: card.benefits || undefined
    };

    this.dialog.open(CardDetailDialogComponent, {
      data: dialogData,
      width: '90%',
      maxWidth: '1000px',
      maxHeight: '90vh',
      panelClass: ['card-detail-dialog-container'],
      disableClose: false,
      autoFocus: false
    });
  }

  /**
   * Go to home page
   */
  goToHome() {
    this.router.navigate(['/']);
  }

  /**
   * Restart/Refresh
   */
  restart() {
    // Reload the page or reset state
    window.location.reload();
  }
}
