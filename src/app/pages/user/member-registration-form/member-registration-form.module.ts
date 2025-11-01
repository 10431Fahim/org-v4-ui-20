import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRegistrationFormRoutingModule } from './member-registration-form-routing.module';
import { MemberRegistrationFormComponent } from './member-registration-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {PipesModule} from "../../../shared/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MemberRegistrationFormRoutingModule,
    FormsModule,
    MatMenuModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
    MemberRegistrationFormComponent
  ]
})
export class MemberRegistrationFormModule { }
