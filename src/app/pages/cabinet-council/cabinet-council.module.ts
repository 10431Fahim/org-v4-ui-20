import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetCouncilRoutingModule } from './cabinet-council-routing.module';
import { CabinetCouncilComponent } from './cabinet-council.component';

@NgModule({
    imports: [
        CommonModule,
        CabinetCouncilRoutingModule,
        CabinetCouncilComponent // Component is standalone, so imported here
    ]
})
export class CabinetCouncilModule { }
