import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UiService} from '../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserService} from '../../../services/common/user.service';
import {Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {OtpService} from '../../../services/common/otp.service';
import {NgClass, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass,
    MatButton,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./reset-password.component.scss'],

})
export class ResetPasswordComponent implements OnInit {

  phoneNo: any = null;
  otp: any = null;
  otpMatched = false;
  password: any = null;

  // verificationCode: string;
  public sendVerificationCode = false;
  public showVerificationCodeField = false;


  public dataForm!: FormGroup;

  // Store Data
  isOtpSent: boolean = false;
  isOtpValid: boolean = false;
  isRegisteredUser: boolean = false;
  isCountDownEnd = false;
  isPasswordShow = false;
  isPasswordConfarmShow = false;

  // Subscriptions
  private subDataOne!: Subscription;
  private subDataTwo!: Subscription;

  constructor(
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public otpService: OtpService,

  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      // phoneNo: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      otp: [null],
      password: [null],
      confirmPassword: [null],
    });
  }


  onPhoneFormSubmit(): void {
    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      this.uiService.warn('Please complete all the required field');
      return;
    }

    // if (!this.utilsService.checkValidPhone(this.dataForm.value.phoneNo) || this.dataForm.value.phoneNo.length !== 11) {
    //   this.dataForm.get('phoneNo').setErrors({invalid: true});
    //   this.uiService.warn('Please enter a valid 11 digit phone no');
    //   return;
    // }

    if (this.dataForm.value.password && this.dataForm.value.confirmPassword && this.dataForm.value.password.length < 6) {
      this.uiService.warn('Password must be at lest 6 characters!');
      return;
    }

    if (this.dataForm.value.password && this.dataForm.value.confirmPassword && this.dataForm.value.password !== this.dataForm.value.confirmPassword) {
      this.uiService.warn('Password and confirm password not matched!');
      return;
    }


    this.spinner.show();
    if (this.isOtpSent && !this.isOtpValid) {
      if (!this.dataForm.value.otp) {
        this.uiService.warn('Please enter otp code!')
        return;
      }
      this.validateOtpWithEmail(
        {
          email: this.dataForm.value.email,
          code: this.dataForm.value.otp,
        }
      );
    } else if (this.isOtpValid) {
      const data: any = {
        email: this.dataForm.value.email,
        oldPassword: this.dataForm.value.oldPassword,
        password: this.dataForm.value.password,
      }
      this.resetUserPassword(data);
    } else {
      this.checkUserForRegistration(this.dataForm.value.email);
    }
  }

  /**
   * HTTP REQ HANDLE
   */

  checkUserForRegistration(email: string) {
    this.subDataOne = this.userService.checkUserForRegistration(email)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.isOtpSent = res.data.otp;
            this.uiService.success(res.message)
          } else {
            this.uiService.warn(res.message);
          }
        }),
        error: ((error) => {
          console.log(error);
        })
      });
  }

  resetUserPassword(data:any) {
    this.subDataOne = this.userService.resetUserPassword(data)
      .subscribe({
        next: ((res) => {
          if (res.success) {
            this.uiService.success(res.message)
            this.router.navigate(['/login'])
          }
        }),
        error: ((error) => {
        console.log(error);
      })
  });
  }

  validateOtpWithPhoneNo(data: any) {
    this.subDataTwo = this.otpService.validateOtpWithPhoneNo(data)
      .subscribe({
      next: ((res) => {
        if (res.success) {
          this.isOtpValid = true;
        } else {
          this.uiService.warn(res.message);
        }
      }),
      error: ((error) => {
        console.log(error);
      })
    });
  }

  validateOtpWithEmail(data: { email: string, code: string }) {
    this.subDataTwo = this.otpService.validateOtpWithEmail(data)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.isOtpValid = true;
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => console.log(error)
      });
  }
  onShowPassword() {
    this.isPasswordShow = !this.isPasswordShow;
  }

  onShowConfarmPassword() {
    this.isPasswordConfarmShow = !this.isPasswordConfarmShow;
  }
  /**
   * LOGICAL METHODS
   * get submitBtnName()
   */
  get submitBtnName() {
    if (this.isOtpSent && !this.isOtpValid) {
      return 'Verify Otp'
    } else if (this.isOtpValid) {
      return 'Change Password';
    } else {
      return 'Recover Via email'
    }
  }


  /**
   * NG ON DESTROY
   */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
  }

}
