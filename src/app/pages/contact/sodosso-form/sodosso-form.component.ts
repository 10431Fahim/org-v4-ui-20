import {Component, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ContactService} from "../../../services/common/contact.service";

@Component({
  selector: 'app-sodosso-form',
  templateUrl: './sodosso-form.component.html',
  imports: [
    TranslatePipe
  ],
  standalone:true,
  styleUrls: ['./sodosso-form.component.scss'],

})
export class SodossoFormComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  data= 'test'
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'bn';
  constructor(private contactService: ContactService, public translateService: TranslateService,

  ) {}

  downloadPDF() {
    const htmlContent = this.pdfContent.nativeElement.innerHTML;
    this.contactService.generatePDF(htmlContent).subscribe((pdfBlob) => {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Generated_${this.data}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

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
}
