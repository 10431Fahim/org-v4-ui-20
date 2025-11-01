import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBasicInfoComponent } from './edit-basic-info.component';
import {SharedModule} from '../../shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from "../../../material/material.module";



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EditBasicInfoComponent
  ],
  exports: [
    EditBasicInfoComponent
  ]
})
export class EditBasicInfoModule { }
