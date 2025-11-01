import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresidencyRoutingModule } from './presidency-routing.module';
import { PresidencyComponent } from './presidency.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PresidencyRoutingModule,
    TranslateModule,
    PresidencyComponent
  ]
})
export class PresidencyModule { }
