import {Component, OnInit, ViewChild, signal, computed, effect} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {UiService} from "../../../services/core/ui.service";
import {UserService} from "../../../services/common/user.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    TranslatePipe,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatInput,
    MatIcon,
    RouterLink
  ],
  styleUrls: ['./login.component.scss']})
export class LoginComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement!: NgForm;
  dataForm!: FormGroup;

  // Angular 20 Signals
  navigateFrom = signal<string | null>(null);
  memberType = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  formErrors = signal<{[key: string]: string}>({});

  // Computed properties
  isFormValid = computed(() => this.dataForm?.valid ?? false);
  hasFormErrors = computed(() => Object.keys(this.formErrors()).length > 0);
  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {

    // Effect to watch form changes and update errors
    effect(() => {
      if (this.dataForm) {
        this.updateFormErrors();
      }
    });
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    // Subscribe to route parameters using signals
    this.activatedRoute.queryParamMap.subscribe(param => {
      const navigateFrom = param.get('navigateFrom');
      this.navigateFrom.set(navigateFrom);
    });

    this.activatedRoute.paramMap.subscribe(params => {
      const memberType = params.get('type');
      this.memberType.set(memberType);
    });
  }

  /**
   * FORM FUNCTIONS
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      username: new FormControl(
        {value: '', disabled: false},
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3)
        ]
      ),
      password: new FormControl(
        {value: '', disabled: false},
        [
          Validators.minLength(6),
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/)
        ]
      )
    });

    // Watch form changes
    this.dataForm.valueChanges.subscribe(() => {
      this.updateFormErrors();
    });
  }

  private updateFormErrors() {
    const errors: {[key: string]: string} = {};

    if (this.username?.errors) {
      if (this.username.errors['required']) {
        errors['username'] = 'Email is required';
      } else if (this.username.errors['email']) {
        errors['username'] = 'Please enter a valid email address';
      } else if (this.username.errors['minlength']) {
        errors['username'] = 'Email must be at least 3 characters';
      }
    }

    if (this.password?.errors) {
      if (this.password.errors['required']) {
        errors['password'] = 'Password is required';
      } else if (this.password.errors['minlength']) {
        errors['password'] = 'Password must be at least 6 characters';
      } else if (this.password.errors['pattern']) {
        errors['password'] = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }

    this.formErrors.set(errors);
  }


  async onSubmit() {
    if (this.dataForm.invalid) {
      this.username?.markAsTouched({onlySelf: true});
      this.password?.markAsTouched({onlySelf: true});
      this.uiService.warn('Please fill all the required fields');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.userService.userLogin(this.dataForm.value, this.navigateFrom() || undefined);
    } catch (error) {
      console.error('Login error:', error);
      this.uiService.warn('Login failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Form Validations
   */
  get username() {
    return this.dataForm.get('username');
  }

  get password() {
    return this.dataForm.get('password');
  }

  /**
   * NAVIGATION
   */
  onRegistrationNavigate() {
    const navigateFrom = this.navigateFrom();
    if (navigateFrom) {
      this.router.navigate(['/registration'], {queryParams: {navigateFrom}, queryParamsHandling: 'merge'});
    } else {
      this.router.navigate(['/registration']);
    }
  }
}
