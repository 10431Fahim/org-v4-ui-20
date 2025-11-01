import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BannerComponent} from './banner.component';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    BannerComponent,
  ],
  exports:[
    BannerComponent
  ]
})
export class BannerModule { }
