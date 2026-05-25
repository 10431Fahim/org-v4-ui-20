import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetCouncilComponent } from './cabinet-council.component';

const routes: Routes = [
    { path: '', component: CabinetCouncilComponent },
    { path: ':slug', component: CabinetCouncilComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CabinetCouncilRoutingModule { }
