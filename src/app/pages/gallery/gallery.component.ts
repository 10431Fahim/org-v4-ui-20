import {Component, OnInit, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GalleryPopupComponent } from './gallery-popup/gallery-popup.component';
import {Photo} from '../../interfaces/common/photo.interface';
import {Subscription} from 'rxjs';
import {ImageGallery} from '../../interfaces/common/image-gallery';
import {ImageFolder} from '../../interfaces/common/image-folder';
import {PhotoService} from '../../services/common/photo.service';
import {FilterData} from '../../interfaces/core/filter-data';
import {NgForOf} from '@angular/common';

// var mixitup = require('mixitup');
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [
    GalleryPopupComponent,
    NgForOf
  ]})
export class GalleryComponent implements OnInit {
  @ViewChild('galleryPop',{static:false}) galleryPop!:GalleryPopupComponent;
  _albums: any = [];
    // Store Data
    photo: any[] = [];
    // Subscriptions
    private subDataThree!: Subscription;

  // Pagination
 currentPage = 1;
 totalProducts = 0;
 productsPerPage = 24;
 totalProductsStore = 0;

  // images: ImageGallery[] = [];
  selectedFolder = null;
  private holdPrevData: any[] = [];
  // SELECTED IMAGE
  selectedImages: Photo[] = [];
  selectPreview?: Photo;


  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'bn';
  images: ImageGallery[] = [];
  folders: ImageFolder[] = [];
  // light box
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private photoService: PhotoService,
    public translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.getAllPhotos()
  }




  // private getAllPhotos() {
  //   // Select
  //   const mSelect = {
  //     name: 1,
  //     nameEn: 1,
  //     image: 1,
  //     images:1,
  //     _id: 1,
  //     slug: 1,
  //     createdAt: 1
  //   }
  //
  //   const filterData: FilterData = {
  //     pagination: null,
  //     filter: null,
  //     select: mSelect,
  //     sort: { createdAt: -1 }
  //   }
  //
  //   this.subDataThree = this.photoService.getAllPhotos(filterData, null)
  //     .subscribe({
  //       next: res => {
  //         if (res.success) {
  //           this.photo = res.data;
  //           if (this.photo && this.photo.length) {
  //             // this.prepareImagesForLightBox();
  //           }
  //         }
  //       },
  //       error: error => {
  //         // console.log(error);
  //       }
  //     });
  // }

  private getAllPhotos(): void {
    const subscription = this.photoService.getAllPhoto()
      .subscribe({
        next: res => {
          this.photo = res.data;
          // this.isLoading = false;
        },
        error: err => {
          console.error(err);
          // this.isLoading = false;
        }
      });
    this.subscriptions?.push(subscription);
  }

  //
  // private prepareImagesForLightBox() {
  //   this.albums = this.images.map(m => {
  //
  //     return {
  //       src: m.url,
  //       // caption: m.name,
  //       thumb: m.url
  //
  //     } as IAlbum;
  //
  //   });
  // }

  onChangeLanguage(language: string) {
    this.isChangeLanguage = language === 'en';
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string){
     if(this.isChangeLanguageToggle !== language){
           this.isChangeLanguageToggle = language;
           this.isChangeLanguage = true;
           this.translateService.use(this.isChangeLanguageToggle);
     }
     else{
      this.isChangeLanguageToggle = 'bn';
      this.isChangeLanguage = false;
      this.translateService.use(this.isChangeLanguageToggle);
     }
  }

  onShowPop(index:any){
      if(index > -1){
        this.galleryPop.onShowGallery(index);
        // console.log(index);
      }
  }

    /**
   * LIGHT BOX VIEW DIALOG
   */
  //
  // openLightBox(index: number): void {
  //   this.lightboxConfig.showZoom = false;
  //   this.lightboxConfig.showRotate = false;
  //   this.lightboxConfig.centerVertically = false;
  //   this.lightboxConfig.enableTransition = false;
  //   this.lightbox.open(this.albums, index);
  // }
  //
  // closeLightBox(): void {
  //   this.lightbox.close();
  // }

  /**
   * ON Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }
}
