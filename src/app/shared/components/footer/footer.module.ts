import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {PipesModule} from "../../pipes/pipes.module";



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    PipesModule,
    FooterComponent
  ],
  exports:[
    FooterComponent
  ]
})
export class FooterModule { }
