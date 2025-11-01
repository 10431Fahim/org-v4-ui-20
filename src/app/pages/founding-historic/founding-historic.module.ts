import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FoundingHistoricRoutingModule } from './founding-historic-routing.module';
import { FoundingHistoricComponent } from './founding-historic.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FoundingHistoricRoutingModule,
    TranslateModule,
    FoundingHistoricComponent,
  ]
})
export class FoundingHistoricModule { }
