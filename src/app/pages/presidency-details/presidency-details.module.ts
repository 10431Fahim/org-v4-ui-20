import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresidencyDetailsRoutingModule } from './presidency-details-routing.module';
import { PresidencyDetailsComponent } from './presidency-details.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PresidencyDetailsRoutingModule,
    TranslateModule,
    PresidencyDetailsComponent
  ]
})
export class PresidencyDetailsModule { }
