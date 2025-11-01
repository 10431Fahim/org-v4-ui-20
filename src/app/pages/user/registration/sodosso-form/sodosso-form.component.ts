import {Component, ElementRef, Inject, Input, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import {ContactService} from "../../../../services/common/contact.service";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sodosso-form',
  templateUrl: './sodosso-form.component.html',
  styleUrls: ['./sodosso-form.component.scss'],
  imports: [NgIf]
})
export class SodossoFormComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @Input() registrationData: any;
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'bn';
  constructor(
    @Inject(ContactService) private contactService: ContactService,
    public translateService: TranslateService
  ) { }

  downloadPDF() {
    const htmlContent = this.pdfContent.nativeElement.innerHTML;
    this.contactService.generatePDF(htmlContent).subscribe((pdfBlob) => {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Membership_Registration_Form.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage = language === 'en';
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string) {
    if (this.isChangeLanguageToggle !== language) {
      this.isChangeLanguageToggle = language;
      this.isChangeLanguage = true;
      this.translateService.use(this.isChangeLanguageToggle);
    }
    else {
      this.isChangeLanguageToggle = 'bn';
      this.isChangeLanguage = false;
      this.translateService.use(this.isChangeLanguageToggle);
    }
  }
}
