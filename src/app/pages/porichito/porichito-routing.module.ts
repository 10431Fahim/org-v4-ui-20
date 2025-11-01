import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PorichitoComponent} from './porichito.component';

const routes: Routes = [
  {
    path: '', component: PorichitoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PorichitoRoutingModule {
}
