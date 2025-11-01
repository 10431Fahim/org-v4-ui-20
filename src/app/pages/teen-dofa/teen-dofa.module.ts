import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeenDofaRoutingModule } from './teen-dofa-routing.module';
import { TeenDofaComponent } from './teen-dofa.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    TeenDofaRoutingModule,
    TranslateModule
  ]
})
export class TeenDofaModule { }
