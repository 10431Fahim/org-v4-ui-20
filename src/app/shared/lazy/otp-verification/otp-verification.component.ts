import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {NumberMinDigitPipe} from '../../pipes/number-min-digit.pipe';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    NumberMinDigitPipe,
    NgIf
  ],
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {

  // Event Track
  @Input() phoneNo!: string;
  @Output() onEnterOtp = new EventEmitter<string>();
  @Output() onResentOtp = new EventEmitter<boolean>();

  // Data Form
  verificationForm!: FormGroup;

  // Counter
  countDown = 0;
  timeInstance: any = null;

  // OTP
  expireCountDown = 0;
  timeInstanceExpire: any = null;


  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.countOtpExpireTime(300);
    this.countResendTime(60);

    // Init Form
    this.initForm();
  }

  /**
   * INIT FORM & Form Input Control
   * initForm()
   * nextStep()
   * paste()
   * focused()
   */

  private initForm() {
    this.verificationForm = this.fb.group({
      code1: ['', Validators.required],
      code2: ['', Validators.required],
      code3: ['', Validators.required],
      code4: ['', Validators.required],
    });
  }

  nextStep(event: any, step: number): void {
    if (this.verificationForm.valid) {
      this.onSubmit();
    }
    const prevElement = document.getElementById('code' + (step - 1));
    const nextElement = document.getElementById('code' + (step + 1));
    if (event.code === 'Backspace' && event.target.value === '') {
      // event.target.parentElement.parentElement.children[step - 2 > 0 ? step - 2 : 0].children[0].value = ''
      if (prevElement) {
        prevElement.focus();
        return;
      }
    } else {
      if (nextElement) {
        nextElement.focus();
        return;
      } else {

      }
    }

  }

  paste(event: any) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    this.verificationForm.setValue({
      code1: pastedText.charAt(0),
      code2: pastedText.charAt(1),
      code3: pastedText.charAt(2),
      code4: pastedText.charAt(3),
    });
    document.getElementById('code3')?.focus();
    this.onSubmit();
  }

  focused(step: any) {
    if (step === 2) {
      if (this.verificationForm.controls['code1'].value === '') {
        document.getElementById('code1')?.focus();
      }
    }
    if (step === 3) {
      if (this.verificationForm.controls['code1'].value === '' || this.verificationForm.controls['code2'].value === '') {
        document.getElementById('code2')?.focus();
      }
    }

    if (step === 4) {
      if (this.verificationForm.controls['code1'].value === '' || this.verificationForm.controls['code2'].value === '' || this.verificationForm.controls['code3'].value === '') {
        document.getElementById('code3')?.focus();
      }
    }

  }

  /**
   * ON SUBMIT
   * onSubmit()
   */
  onSubmit(): void {
    if (this.verificationForm.invalid) {
      return;
    }
    const code = this.verificationForm.value.code1 +
      this.verificationForm.value.code2 +
      this.verificationForm.value.code3 +
      this.verificationForm.value.code4;

    this.onEnterOtp.emit(code);

  }


  /**
   * COUNT DOWN METHODS
   * countResendTime()
   * countOtpExpireTime()
   */

  countResendTime(time?: any) {
    const count = (num: any) => () => {
      this.countDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        if (this.timeInstance) {
          clearInterval(this.timeInstance);
        }
        this.countDown = 0;
      }
    };

    this.timeInstance = setInterval(count(time), 1000);
  }

  countOtpExpireTime(time: number) {
    const count = (num: any) => () => {
      this.expireCountDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        if (this.timeInstanceExpire) {
          clearInterval(this.timeInstanceExpire);
        }
        this.expireCountDown = 0;
      }
    };

    this.timeInstanceExpire = setInterval(count(time), 1000);
  }


  /**
   * SENT OTP TO PHONE
   * resendLoginCode()
   */


  // Resent Verification Code...
  resendLoginCode() {
    if (this.timeInstance) {
      clearInterval(this.timeInstance);
    }
    if (this.timeInstanceExpire) {
      clearInterval(this.timeInstanceExpire);
    }
    this.onResentOtp.emit(true)
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.timeInstance) {
      clearInterval(this.timeInstance);
    }

    if (this.timeInstanceExpire) {
      clearInterval(this.timeInstanceExpire);
    }

  }

}
