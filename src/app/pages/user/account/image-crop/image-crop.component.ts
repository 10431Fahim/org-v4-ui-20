import {Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, effect, DestroyRef, inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatButton,
    ImageCropperComponent
  ],
  styleUrls: ['./image-crop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropComponent implements OnInit {
  // Angular 20 Signals for reactive state management
  isLoaded = signal<boolean>(false);
  imageChangedEvent = signal<any>(null);
  croppedImage = signal<any>(null);
  imgBlob = signal<any>(null);
  fileBeforeCropped = signal<any>(null);

  // Computed signals for derived state
  hasCroppedImage = computed(() => this.croppedImage() !== null);
  hasImageBlob = computed(() => this.imgBlob() !== null);
  canSave = computed(() => this.hasCroppedImage() && this.hasImageBlob());
  isLoading = computed(() => !this.isLoaded());

  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);


  constructor(
    public dialogRef: MatDialogRef<ImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Angular 20 Effects for side effects management
    effect(() => {
      const isLoaded = this.isLoaded();
      if (isLoaded) {
      }
    });

    effect(() => {
      const hasCropped = this.hasCroppedImage();
      if (hasCropped) {
      }
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.imageChangedEvent.set(this.data);
    }
  }


  /**
   * Image Upload Area
   * imageCropped()
   * dataURItoBlob()
  */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage.set(event.base64);
    const imageEvent = this.imageChangedEvent();
    if (imageEvent?.target?.files?.[0]) {
      this.fileBeforeCropped.set(imageEvent.target.files[0]);
    }
    if (event.base64) {
      this.imgBlob.set(this.dataURItoBlob(event.base64.split(',')[1]));
    }
  }

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpeg' });
  }

  // Image loader
  loadImageFailed() {
    this.isLoaded.set(false);
  }

  // Image cropper
  cropperReady() {
    this.isLoaded.set(true);
  }

  // Material dialog close
  onCloseDialogue() {
    this.dialogRef.close();
  }

  // Save image function
  onSaveImage() {
    this.dialogRef.close({
      imgBlob: this.imgBlob() || null,
      croppedImage: this.croppedImage() || null
    });
  }

}
