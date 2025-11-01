import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeadersDetailsComponent} from './leaders-details.component';

const routes: Routes = [
  {
    path: ':slug',
    component: LeadersDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadersDetailsRoutingModule {
}
