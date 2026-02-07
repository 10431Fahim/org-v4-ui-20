import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManifestoRoutingModule } from './manifesto-routing-module';


import { Manifesto } from './manifesto';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManifestoRoutingModule,
    Manifesto
  ]
})
export class ManifestoModule { }
