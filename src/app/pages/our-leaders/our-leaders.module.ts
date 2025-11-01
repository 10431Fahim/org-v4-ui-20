import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OurLeadersRoutingModule } from './our-leaders-routing.module';
import { OurLeadersComponent } from './our-leaders.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    OurLeadersRoutingModule,
    TranslateModule,
    OurLeadersComponent
  ]
})
export class OurLeadersModule { }
