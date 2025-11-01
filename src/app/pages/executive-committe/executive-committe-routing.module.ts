import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecutiveCommitteComponent } from './executive-committe.component';

const routes: Routes = [
  {
    path:'',component:ExecutiveCommitteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveCommitteRoutingModule { }
