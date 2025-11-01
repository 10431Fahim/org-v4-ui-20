import {Component, Inject, OnInit, inject, signal, computed, DestroyRef} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {StorageService} from '../../../services/core/storage.service';
import {Popup} from '../../../interfaces/common/popup.interface';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {SafeUrlPipe} from '../../../shared/pipes/safe-url.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  imports: [
    SafeUrlPipe
  ],
  standalone: true,
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Angular 20: Using signals for reactive state management
  readonly isVisible = signal<boolean>(true);
  readonly isLoading = signal<boolean>(false);

  // Angular 20: Computed signals for derived state
  readonly hasUrl = computed(() => !!this.data?.url);
  readonly hasImage = computed(() => !!this.data?.image);

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Popup,
  ) {}

  ngOnInit(): void {
    // Angular 20: Component initialization logic can be added here
  }


  /**
   * CLICK EVENT METHODS
   * onClose()
   * onNavigate()
   */
  onClose(): void {
    this.isVisible.set(false);
    this.storageService.storeDataToSessionStorage(DATABASE_KEY.popup, { close: true });
    this.dialogRef.close();
  }

  onNavigate(): void {
    if (this.data?.url) {
      this.isLoading.set(true);
      this.router.navigate([this.data.url]);
      this.dialogRef.close();
    }
  }
}

