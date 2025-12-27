import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import {SodossoFormComponent} from "./sodosso-form/sodosso-form.component";
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {UiService} from '../../services/core/ui.service';
import {ContactService} from '../../services/common/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatIconModule
  ],
  standalone:true,
  styleUrls: ['./contact.component.scss']})
export class ContactComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement!: NgForm;
  dataForm!: FormGroup;
  selectedDatas: string[] = [];
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  isLoading:boolean = false;
  // Subscriptions
  subDataOne!: Subscription;
  subDataTwo!: Subscription;

  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'bn';
  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private contacts: ContactService,
    public translateService: TranslateService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initDataForm();
  }


  /**
* FORM FUNCTIONS
* initDataForm()
* onSubmit()
*/
  private initDataForm() {
    this.dataForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null],
      phoneNo: [null, Validators.required],
      email: [null, Validators.required],
      companyName: [null],
      shortDesc: [null],
      husband: [null],
      age: [null],
      occupation: [null],
      qualification: [null],
      village: [null],
      wardNo: [null],
      union: [null],
      thana: [null],
      district: [null],
      nationalIdentity: [null]
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.firstName?.markAsTouched({ onlySelf: true });
      this.phoneNo?.markAsTouched({ onlySelf: true });
      this.uiService.warn('Please fill up all the required field');
      return;
    }


    this.uiService.success('Data Added SuccessFully');
    this.addContact();
    // this.openDialog(mData);
  }

  /**
   * Form Validations
   */
  get firstName() {
    return this.dataForm?.get('firstName');
  }

  get lastName() {
    return this.dataForm.get('lastName');
  }

  get phoneNo() {
    return this.dataForm.get('phoneNo');
  }

  get email() {
    return this.dataForm.get('email');
  }

  get companyName() {
    return this.dataForm.get('companyName');
  }

  get shortDesc() {
    return this.dataForm.get('shortDesc');
  }

  /**
   * HTTP REQ HANDLE
   * addContact()
   */
  private addContact() {
    // this.spinner.show();
    this.subDataOne = this.contacts.addContact(this.dataForm.value)
      .subscribe({
        next: (res => {

          // this.spinner.hide();
          this.uiService.success(res.message);
          this.formElement.resetForm();

        }),
        error: (error => {
          // this.spinner.hide();
          // console.log(error);
        })
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

  public openFormDialog() {
      const dialogRef = this.dialog.open(SodossoFormComponent, {
        maxWidth: '900px',
        data: this.dataForm.value});
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
        }
      });
  }

  downloadPDF() {
    if (this.dataForm.invalid) {
      this.firstName?.markAsTouched({ onlySelf: true });
      this.phoneNo?.markAsTouched({ onlySelf: true });
      this.uiService.warn('Please fill up all the required field');
      return;
    }
    this.isLoading = true;
    const htmlContent = this.pdfContent.nativeElement.innerHTML;
    this.contacts.generatePDF(htmlContent).subscribe((pdfBlob) => {
      this.isLoading = false;
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.dataForm.value.firstName}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  /**
   * Contact card click handlers
   */
  openPhone() {
    window.location.href = 'tel:0248320064';
  }

  openWhatsApp() {
    // WhatsApp link format: https://wa.me/8801713660848
    window.open('https://wa.me/8801713660848', '_blank');
  }

  openMap() {
    // Google Maps link with coordinates from the iframe
    window.open('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.313833472206!2d90.41091947613947!3d23.73618558932039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9a3930cfa6d%3A0xe7f05ff2e7b40ce5!2sBangladesh%20Nationalist%20Party-BNP!5e0!3m2!1sen!2sbd!4v1685778518535!5m2!1sen!2sbd', '_blank');
  }
}
