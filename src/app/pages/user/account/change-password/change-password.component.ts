import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, effect, DestroyRef, inject} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {UiService} from '../../../../services/core/ui.service';
import {UserService} from '../../../../services/common/user.service';
import {UserDataService} from '../../../../services/common/user-data.service';
import {Subscription} from 'rxjs';
import {ReloadService} from "../../../../services/core/reload.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    RouterLink,
    MatButton
  ],
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  // For Reset
  @ViewChild('formDirective') formDirective!: NgForm;

  public formData!: FormGroup;

  // Angular 20 Signals for reactive state management
  isMobileView = signal<boolean>(false);
  isContentViewVisible = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  passwordStrength = signal<string>('');

  // Computed signals for derived state
  isFormValid = computed(() => this.formData?.valid || false);
  isPasswordStrong = computed(() => {
    const password = this.formData?.value?.password || '';
    return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  });
  canSubmit = computed(() => this.isFormValid() && this.isPasswordStrong());

  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);

  //Subscription (keeping for backward compatibility, will migrate to signals)
  private subDataOne!: Subscription;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private uiService: UiService,
    private router: Router,
    private fb: FormBuilder,
    private reloadService: ReloadService,
    private breakpointObserver: BreakpointObserver
  ) {
    // Angular 20 Effects for side effects management
    effect(() => {
      const isMobile = this.isMobileView();
      if (isMobile) {
      }
    });

    effect(() => {
      const isLoading = this.isLoading();
      if (isLoading) {
      }
    });
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      oldPassword: [null, Validators.required],
      password: [null, Validators.required]
    });

    // Breakpoint observer with modern subscription handling
    this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.isMobileView.set(result.matches);
      });
  }


  /**
   * On submit
   * onSubmitForm()
   */
  onSubmitForm() {
    if (this.formData.invalid) {
      return;
    }

    const password = this.formData.value.password;
    if (password.length < 6) {
      this.uiService.warn('Password must be at least 6 characters!');
      return;
    }

    if (!this.isPasswordStrong()) {
      this.uiService.warn('Password must contain at least one uppercase letter and one number!');
      return;
    }

    this.updatePassword();
  }

  /**
   * Http req handle
   * updatePassword()
   */

  private updatePassword() {
    this.isLoading.set(true);
    this.subDataOne = this.userDataService.changeLoggedInUserPassword(this.formData.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.success(res.message);
            this.formDirective.resetForm();
            this.isLoading.set(false);
          } else {
            this.uiService.wrong(res.message);
            this.isLoading.set(false);
          }
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);
        }
      });
  }

  goBackToSidebar(): void {
    if (this.isMobileView()) {
      this.isContentViewVisible.set(false);
      this.router.navigate(['/account']);
      this.reloadService.needRefreshData$();
    }
  }


  /**
   * Ng On Destroy
   */

  ngOnDestroy(): void {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe()
    }

  }

}
