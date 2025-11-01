import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    HeaderComponent
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
