import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MottoRoutingModule } from './motto-routing.module';
import { MottoComponent } from './motto.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MottoRoutingModule,
    TranslateModule,
    MottoComponent,
  ]
})
export class MottoModule { }
