import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MemberRegistrationFormComponent} from "./member-registration-form.component";

const routes: Routes = [
  {
    path:"",
    component:MemberRegistrationFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRegistrationFormRoutingModule { }
