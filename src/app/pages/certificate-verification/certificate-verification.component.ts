import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatFormField, MatInput, MatLabel, MatError } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { UiService } from '../../services/core/ui.service';
import { UserService } from '../../services/common/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiBaseLink + '/api/user/';

@Component({
  selector: 'app-certificate-verification',
  templateUrl: './certificate-verification.component.html',
  imports: [
    CommonModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatIcon
  ],
  standalone: true,
  styleUrls: ['./certificate-verification.component.scss']
})
export class CertificateVerificationComponent implements OnInit {
  @ViewChild('formElement') formElement!: NgForm;
  dataForm!: FormGroup;
  isLoading = false;
  verificationResult: any = null;
  showResult = false;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private httpClient: HttpClient,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initDataForm();
  }

  private initDataForm() {
    this.dataForm = this.fb.group({
      verificationId: [null, Validators.required]
    });
  }

  get verificationId() {
    return this.dataForm?.get('verificationId');
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.verificationId?.markAsTouched({ onlySelf: true });
      this.uiService.warn('Please enter a Member ID or Certificate ID');
      return;
    }

    this.isLoading = true;
    this.showResult = false;
    this.verificationResult = null;

    const verificationId = this.dataForm.value.verificationId?.trim();

    this.httpClient
      .post<{ success: boolean; message: string; data: any }>(
        API_URL + 'verify-certificate',
        { verificationId }
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            this.verificationResult = res.data;
            this.showResult = true;
            this.uiService.success(res.message || 'Certificate verified successfully');
          } else {
            this.uiService.warn(res.message || 'Certificate not found');
            this.showResult = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showResult = false;
          this.uiService.warn(
            error?.error?.message || 'Failed to verify certificate. Please try again.'
          );
        }
      });
  }

  resetForm() {
    this.formElement.resetForm();
    this.verificationResult = null;
    this.showResult = false;
  }
}

