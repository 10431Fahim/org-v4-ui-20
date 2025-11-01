import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadersDetailsRoutingModule } from './leaders-details-routing.module';
import { LeadersDetailsComponent } from './leaders-details.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    LeadersDetailsRoutingModule,
    TranslateModule,
    LeadersDetailsComponent,
  ]
})
export class LeadersDetailsModule { }
