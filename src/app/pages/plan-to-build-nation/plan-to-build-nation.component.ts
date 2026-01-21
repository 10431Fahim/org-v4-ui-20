import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CardDetailDialogComponent, CardDetailData } from '../../shared/components/ui/card-detail-dialog/card-detail-dialog.component';

type PlanCard = {
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
};

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
  cards: PlanCard[] = [
    {
      id: 1,
      icon: 'family_restroom',
      title: 'ফ্যামিলি কার্ড',
      titleEn: 'Family Card',
      slug: 'family-card',
      pdfUrl: '', // Add PDF URL here when available
      description: `নারী উন্নয়নে বিএনপি'র উদ্যোগ `,
      description1: `ফ্যামিলি কার্ড স্বাবলম্বী পরিবার গড়ার প্রতিশ্রুতি`,
      // benefits: [
      //   'প্রতি মাসে ২০০০-২৫০০ টাকার আর্থিক সহায়তা অথবা খাদ্য সুবিধা যথা: চাল, ডাল, তেল, লবণসহ নিত্যপ্রয়োজনীয় পণ্য',
      //   'দারিদ্র্য বিমোচন, ক্ষুধামুক্তি ও নারীর স্বাবলম্বী হওয়ার নিশ্চয়তা',
      //   'একটি কার্ডেই পরিবারের নিরাপত্তা',
      //   'স্বাবলম্বী পরিবার গড়ার প্রতিশ্রুতি'
      // ],নারী উন্নয়নে বিএনপি'র উদ্যোগ

      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'ফ্যামিলি কার্ডের মাধ্যমে সহায়তা'
        },
        {
          question: 'পলিসি -২',
          answer: 'নারীর স্বাবলম্বিতা নিশ্চিত করা'
        }
      ],
      // FAQ সেকশনের নিচে ১ বা ২টা ইমেজ (public\family-1.jpeg, public\family-2.jpeg)
      faqImages: ['/family-1.jpeg', '/family-2.jpeg']
    },
    {
      id: 2,
      icon: 'favorite',
      title: 'স্বাস্থ্য',
      titleEn: 'Health',
      slug: 'health',
      description: `সুস্বাস্থ্যের বাংলাদেশ গঠনে বিএনপি'র পরিকল্পনা`,
      description1: `স্মার্ট স্বাস্থ্যসেবা ও আধুনিক চিকিৎসা প্রযুক্তির সমন্বয়`,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'টেলিমেডিসিন ও প্রাথমিক স্বাস্থ্যসেবা সবার দোরগোড়ায় পৌঁছে দেওয়া।'
        },
        {
          question: 'পলিসি -২',
          answer: 'সরকারি-বেসরকারি স্বাস্থ্যখাতে স্বচ্ছতা ও মান উন্নয়নের মাধ্যমে সুস্বাস্থ্যের বাংলাদেশ গড়া।'
        }
      ],
      faqImages: ['/health.jpg']
    },
    {
      id: 3,
      icon: 'school',
      title: 'শিক্ষা',
      titleEn: 'Education',
      slug: 'education',
      description: `বিএনপি'র পরিকল্পনা আনন্দময় শিক্ষা`,
      description1: `দক্ষ জনশক্তি ও আধুনিক বাংলাদেশ`,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'শিক্ষাকে আনন্দদায়ক ও দক্ষতাভিত্তিক করে ভবিষ্যৎ জনশক্তি তৈরির উদ্যোগ।'
        },
        {
          question: 'পলিসি -২',
          answer: 'ডিজিটাল টুলস, কারিকুলাম ও গবেষণা-বান্ধব পরিবেশের মাধ্যমে আধুনিক শিক্ষা ব্যবস্থা গঠন।'
        }
      ],
      faqImages: ['/education.jpeg']
    },
    {
      id: 4,
      icon: 'emoji_events',
      title: 'ক্রীড়া',
      titleEn: 'Sports',
      slug: 'sports',
      description: `বাংলাদেশের ক্রীড়া উন্নয়নে বিএনপি'র চিন্তা`,
      description1: `ক্রীড়া হলে পেশা, পরিবার পাবে ভরসা`,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'পেশাদার লিগ, অবকাঠামো ও প্রশিক্ষণের মাধ্যমে ক্রীড়াকে টেকসই পেশায় রূপান্তর।'
        },
        {
          question: 'পলিসি -২',
          answer: 'প্রান্তিক পর্যায় থেকে প্রতিভা অন্বেষণ ও আন্তর্জাতিক মানের সুযোগ-সুবিধা নিশ্চিত করা।'
        }
      ],
      faqImages: ['/sports.jpeg']
    },
    {
      id: 5,
      icon: 'public',
      title: 'প্রবাসী',
      titleEn: 'Expatriate',
      slug: 'expatriate',
      description: `প্রবাসী রেমিটেন্স যোদ্ধাদের নিয়ে বিএনপি'র পরিকল্পনা`,
      description1: ``,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'প্রবাসী শ্রমিকদের নিরাপত্তা, আইনি সহায়তা ও সম্মানজনক অধিকার নিশ্চিত করা।'
        },
        {
          question: 'পলিসি -২',
          answer: 'রেমিটেন্স প্রেরণ সহজীকরণ ও বিনিয়োগবান্ধব পরিবেশ তৈরির মাধ্যমে প্রবাসীদের সম্পৃক্ত করা।'
        }
      ],
      faqImages: ['/remitance.jpg']
    },
    {
      id: 6,
      icon: 'agriculture',
      title: 'কৃষক কার্ড',
      titleEn: 'Farmer Card',
      slug: 'farmer-card',
      description: `বাংলাদেশের কৃষকের ভাগ্যোন্নয়নে বিএনপি'র পরিকল্পনা`,
      description1: `কৃষকের জন্য নিরাপদ ও নির্ভরযোগ্য কৃষক কার্ড`,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'কৃষক কার্ডের মাধ্যমে সাশ্রয়ী দামে সার, বীজ ও কৃষি উপকরণ সরবরাহ।'
        },
        {
          question: 'পলিসি -২',
          answer: 'কৃষকবান্ধব ঋণ, বীমা ও ন্যায্যমূল্য নিশ্চিত করে কৃষকের জীবনমান উন্নয়ন।'
        }
      ],
      faqImages: ['/farmer-card-2.jpeg', '/farmer-card-1.jpeg']
    },
    {
      id: 7,
      icon: 'work',
      title: 'কর্মসংস্থান',
      titleEn: 'Employment',
      slug: 'employment',
      description: `বিএনপি'র পরিকল্পনা `,
      description1: `দেশব্যাপী কর্মসংস্থান: সবার জন্য সমান সুযোগ`,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'স্টার্টআপ, এসএমই ও স্থানীয় শিল্পে প্রণোদনা দিয়ে নতুন কর্মসংস্থান সৃষ্টির উদ্যোগ।'
        },
        {
          question: 'পলিসি -২',
          answer: 'ফ্রিল্যান্সিং ও স্কিল ডেভেলপমেন্ট প্রোগ্রামের মাধ্যমে গ্লোবাল মার্কেটে দক্ষ কর্মশক্তি তৈরি।'
        }
      ],
      faqImages: ['/employment-1.jpeg', '/employment-2.jpeg']
    },
    {
      id: 8,
      icon: 'eco',
      title: 'পরিবেশ',
      titleEn: 'Environment',
      slug: 'environment',
      description: `নদী-খাল-বিল ও পরিবেশ রক্ষায় বিএনপি'র পরিকল্পনা`,
      description1: ``,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'নদী-খাল-বিল পুনরুদ্ধার ও দূষণ নিয়ন্ত্রণের মাধ্যমে সুস্থ পরিবেশ গড়ে তোলা।'
        },
        {
          question: 'পলিসি -২',
          answer: 'নবায়নযোগ্য জ্বালানি ও সবুজ অবকাঠামোতে বিনিয়োগ করে টেকসই উন্নয়ন নিশ্চিত করা।'
        }
      ],
      faqImages: ['/environment.jpeg']
    },
    {
      id: 9,
      icon: 'mosque',
      title: 'ইমাম মুয়াজ্জিনদের সম্মানী',
      titleEn: 'Imam Muezzin\'s Honorarium',
      slug: 'imam-muezzin-honorarium',
      description: `খতিব, ইমাম - মুয়াজ্জিন সাহেবগণের সামাজিক মর্যাদা ও জীবনমান উন্নয়নে `,
      description1: `বিএনপি'র পরিকল্পনা`,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'মসজিদের খতিব, ইমাম ও মুয়াজ্জিনদের জন্য সম্মানীভিত্তিক আর্থিক নিরাপত্তা প্রদান।'
        },
        {
          question: 'পলিসি -২',
          answer: 'ধর্মীয় শিক্ষা ও সামাজিক নেতৃত্বে তাদের ভূমিকা আরও শক্তিশালী করতে বিভিন্ন কল্যাণমূলক পদক্ষেপ।'
        }
      ],
      faqImages: ['imam-muezzin-honorarium.jpeg']
    },
    {
      id: 10,
      icon: 'security',
      title: 'দুর্নীতিমুক্ত বাংলাদেশ',
      titleEn: 'Corruption-free Bangladesh',
      slug: 'corruption-free-bangladesh',
      description: `দুর্নীতি মুক্ত বাংলাদেশ বিএনপি'র অঙ্গীকার`,
      description1: ``,
      faqs: [
        {
          question: 'পলিসি -১',
          answer: 'প্রশাসনে স্বচ্ছতা ও জবাবদিহি নিশ্চিত করতে ডিজিটাল ট্র্যাকিং ও ওপেন ডাটা সিস্টেম চালু।'
        },
        {
          question: 'পলিসি -২',
          answer: 'দুর্নীতিবিরোধী আইন কঠোর প্রয়োগ ও স্বাধীন তদন্ত ব্যবস্থার মাধ্যমে দুর্নীতিমুক্ত রাষ্ট্র গঠন।'
        }
      ],
      faqImages: ['/corruption.jpg']
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
  onCardClick(card: PlanCard) {
    const dialogData: CardDetailData = {
      id: card.id,
      icon: card.icon,
      title: card.title,
      titleEn: card.titleEn,
      slug: card.slug,
      pdfUrl: card.pdfUrl || undefined,
      imageUrl: card.imageUrl || undefined,
      description: card.description || undefined,
      description1: card.description1 || undefined,
      benefits: card.benefits || undefined,
      faqs: card.faqs || undefined,
      faqImages: card.faqImages || undefined
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
