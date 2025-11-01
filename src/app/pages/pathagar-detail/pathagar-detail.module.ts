import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathagarDetailComponent } from './pathagar-detail.component';
import { PathagarDetailRoutingModule } from './pathagar-detail-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    PathagarDetailRoutingModule,
    TranslateModule,
    PathagarDetailComponent,
  ]
})
export class PathagarDetailModule { }
