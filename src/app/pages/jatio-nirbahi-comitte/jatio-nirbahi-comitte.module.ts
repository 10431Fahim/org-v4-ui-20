import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JatioNirbahiComitteComponent } from './jatio-nirbahi-comitte.component';
import { JatioNirbahiComitteRoutingModule } from './jatio-nirbahi-comitte-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    JatioNirbahiComitteRoutingModule,
    TranslateModule,
    JatioNirbahiComitteComponent,
  ]
})
export class JatioNirbahiComitteModule { }
