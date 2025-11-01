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
}
