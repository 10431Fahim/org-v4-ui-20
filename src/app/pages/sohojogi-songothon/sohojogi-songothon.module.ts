import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SohojogiSongothonComponent } from './sohojogi-songothon.component';
import { SohojogiSongothonRoutingModule } from './sohojogi-songothon-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SohojogiSongothonRoutingModule,
    TranslateModule
  ]
})
export class SohojogiSongothonModule { }
