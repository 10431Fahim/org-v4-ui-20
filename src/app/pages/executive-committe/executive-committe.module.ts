import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExecutiveCommitteRoutingModule } from './executive-committe-routing.module';
import { ExecutiveCommitteComponent } from './executive-committe.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ExecutiveCommitteRoutingModule,
    TranslateModule,
    FormsModule,
    ExecutiveCommitteComponent,
  ]
})
export class ExecutiveCommitteModule { }
