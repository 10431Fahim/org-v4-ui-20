import {Component, ViewChild, signal, computed, inject, DestroyRef, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GalleryPopupComponent } from './gallery-popup/gallery-popup.component';
import {Photo} from '../../interfaces/common/photo.interface';
import {ImageGallery} from '../../interfaces/common/image-gallery';
import {ImageFolder} from '../../interfaces/common/image-folder';
import {PhotoService} from '../../services/common/photo.service';
import {NgForOf, NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  host: {ngSkipHydration: 'true'},
  imports: [
    GalleryPopupComponent,
    NgForOf,
    NgIf
  ]
})
export class GalleryComponent implements OnInit {
  @ViewChild('galleryPop', {static: false}) galleryPop!: GalleryPopupComponent;

  // Angular 20 Signals for reactive state management
  photo = signal<Photo[]>([]);
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('bn');
  images = signal<ImageGallery[]>([]);
  folders = signal<ImageFolder[]>([]);
  selectedImages = signal<Photo[]>([]);
  selectPreview = signal<Photo | undefined>(undefined);
  selectedFolder = signal<any>(null);
  isLoading = signal<boolean>(false);

  // Pagination signals
  currentPage = signal<number>(1);
  totalProducts = signal<number>(0);
  productsPerPage = signal<number>(24);
  totalProductsStore = signal<number>(0);

  // Computed signals for derived state
  hasPhotos = computed(() => this.photo().length > 0);
  isEnglish = computed(() => this.isChangeLanguage());
  isBengali = computed(() => !this.isChangeLanguage());

  // Angular 20 dependency injection
  private photoService = inject(PhotoService);
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getAllPhotos();
  }

  private getAllPhotos(): void {
    this.isLoading.set(true);
    this.photoService.getAllPhoto()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.photo.set(res.data);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Error loading photos:', err);
          this.isLoading.set(false);
        }
      });
  }

  onChangeLanguage(language: string): void {
    this.isChangeLanguage.set(language === 'en');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string): void {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(language);
    } else {
      this.isChangeLanguageToggle.set('bn');
      this.isChangeLanguage.set(false);
      this.translateService.use('bn');
    }
  }

  onShowPop(index: number): void {
    if (index > -1 && this.galleryPop) {
      this.galleryPop.onShowGallery(index);
    }
  }
}
