import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, effect, DestroyRef, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {UserDataService} from '../../../../services/common/user-data.service';
import {ReloadService} from '../../../../services/core/reload.service';
import {EditBasicInfoComponent} from "../../../../shared/dialog-view/edit-basic-info/edit-basic-info.component";
import {MatButton} from '@angular/material/button';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    TitleCasePipe,
    DatePipe
  ],
  styleUrls: ['./basic-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicInfoComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  user = signal<any>(null);
  phoneNo = signal<any>(null);
  isLoading = signal<boolean>(false);

  // Computed signals for derived state
  hasUserData = computed(() => this.user() !== null);
  userDisplayName = computed(() => this.user()?.name || '');
  userDisplayEmail = computed(() => this.user()?.email || '');
  userDisplayPhone = computed(() => this.user()?.phoneNo || '');
  userDisplayMemberId = computed(() => this.user()?.memberId || '');
  userDisplayGender = computed(() => this.user()?.gender || '');
  userDisplayCountryCode = computed(() => this.user()?.countryCode || '');
  userDisplayCreatedAt = computed(() => this.user()?.createdAt || '');
  isProfileComplete = computed(() => {
    const user = this.user();
    return !!(user?.name && user?.email && user?.phoneNo && user?.memberId);
  });

  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);

  //Subscription (keeping for backward compatibility, will migrate to signals)
  private subReloadService!: Subscription;
  private subUserDataService!: Subscription;

  constructor(
    private dialog: MatDialog,
    protected userDataService: UserDataService,
    private reloadService: ReloadService
  ) {
    // Angular 20 Effects for side effects management
    effect(() => {
      const user = this.user();
      if (user?.phoneNo) {
        this.phoneNo.set(user.phoneNo);
      }
    });

    effect(() => {
      const user = this.user();
      if (user) {
      }
    });

    effect(() => {
      const isComplete = this.isProfileComplete();
      if (isComplete) {
      } else {
      }
    });
  }

  ngOnInit(): void {
    // Get logged user info with modern subscription handling
    this.subReloadService = this.reloadService.refreshData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getLoggedInUserInfo();
      });

    this.getLoggedInUserInfo();
  }

  /**
   * Login function
   * getLoggedInUserInfo()
  */
  private getLoggedInUserInfo() {
    this.isLoading.set(true);
    this.subUserDataService = this.userDataService.getLoggedInUserData("name username email memberId gender phoneNo countryCode createdAt")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.user.set(res.data?.user);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);
        }
      });
  }

  // Material popup
  openNewDialog() {
    const userData = this.user();
    this.dialog.open(EditBasicInfoComponent, {
      maxWidth: "600px",
      width: "100%",
      height: "40%",
      data: userData,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }

  /**
   * Hook
   * ngOnDestroy()
  */
  ngOnDestroy(): void {
    if (this.subReloadService) {
      this.subReloadService.unsubscribe();
    }
    if (this.subUserDataService) {
      this.subUserDataService.unsubscribe();
    }
  }
}


