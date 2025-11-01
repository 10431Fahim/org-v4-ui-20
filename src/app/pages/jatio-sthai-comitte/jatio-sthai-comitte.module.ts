import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JatioSthaiComitteComponent } from './jatio-sthai-comitte.component';
import { JatioSthaiSongothonRoutingModule } from './jatio-sthai-comitte-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    JatioSthaiSongothonRoutingModule,
    TranslateModule,
    JatioSthaiComitteComponent,
  ]
})
export class JatioSthaiComitteModule { }
