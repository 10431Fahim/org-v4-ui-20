import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {MaterialModule} from "../../../material/material.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EditBasicInfoModule} from "../../../shared/dialog-view/edit-basic-info/edit-basic-info.module";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    EditBasicInfoModule,
  ]
})
export class AccountModule { }
