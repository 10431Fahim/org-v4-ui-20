import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportsComponent} from "./reports.component";
import {ReportDetailsComponent} from "./report-details/report-details.component";

const routes: Routes = [
  {
    path:'',
    component:ReportsComponent
  },
  {
    path:':id',
    component:ReportDetailsComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
