import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NineteenDofaRoutingModule } from './nineteen-dofa-routing.module';
import { NineteenDofaComponent } from './nineteen-dofa.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NineteenDofaRoutingModule,
    //RouterModule.forChild(routes),
    TranslateModule,
    NineteenDofaComponent,
  ]
})
export class NineteenDofaModule { }

