import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegistrationRoutingModule} from './registration-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MaterialModule} from "../../../material/material.module";
import {PipesModule} from "../../../shared/pipes/pipes.module";
import {MatAutocompleteModule} from "@angular/material/autocomplete";


@NgModule({
  declarations: [

  ],
    imports: [
        CommonModule,
        RegistrationRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        MaterialModule,
        PipesModule,
        MatAutocompleteModule,
    ]
})
export class RegistrationModule { }
