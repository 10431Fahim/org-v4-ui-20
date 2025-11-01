import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OngoSongothonComponent } from './ongo-songothon.component';
import { OngoSongothonRoutingModule } from './ongo-songothon-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    OngoSongothonRoutingModule,
    TranslateModule,
    OngoSongothonComponent
  ]
})
export class OngoSongothonModule { }
