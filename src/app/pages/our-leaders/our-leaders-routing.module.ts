import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OurLeadersComponent} from './our-leaders.component';

const routes: Routes = [
  {
    path: '',
    component: OurLeadersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OurLeadersRoutingModule {
}
