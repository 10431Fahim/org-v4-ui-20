import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {UiService} from '../../../services/core/ui.service';
import {User} from '../../../interfaces/common/user.interface';
import {Select} from '../../../interfaces/core/select';
import {UserDataService} from '../../../services/common/user-data.service';
import {ReloadService} from '../../../services/core/reload.service';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-edit-basic-info',
  templateUrl: './edit-basic-info.component.html',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatError,
    MatInput
  ],
  standalone:true,
  styleUrls: ['./edit-basic-info.component.scss']
})
export class EditBasicInfoComponent implements OnInit {



  public formData!: FormGroup;

  genders: Select[] = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
    {value: 'other', viewValue: 'Other'},
  ];
  private message: string | any;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private uiService: UiService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<EditBasicInfoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {

    this.formData = this.fb.group({
      name: [null, Validators.required],
      phoneNo: [null, Validators.required],
      email: [null, Validators.required],
      occupation: [null],
      gender: null,
    });

    this.setFormData();

  }

  private setFormData() {
    this.formData.patchValue(this.data);
  }

  /**
   * ON SUBMIT FORM
   */

  onSubmit() {
    if (this.formData.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }


    const finalData = {...this.formData.value,};
      this.editLoggedInUserData(finalData);
  }

  editLoggedInUserData(data: User) {
    this.userDataService.updateLoggedInUserInfo(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
        this.dialogRef.close();
        // this.matDialog.closeAll();
      }, error => {
        console.log(error);
      });
  }

}
