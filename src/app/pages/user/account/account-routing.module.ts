import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from "./account.component";
import {BasicInfoComponent} from "./basic-info/basic-info.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {TransactionComponent} from "./transaction/transaction.component";


const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    // pathMatch:"full",
    children: [
      {path: '', redirectTo: 'basic-info', pathMatch: "full"},
      {path: 'basic-info', component: BasicInfoComponent},
      {path: 'transaction', component: TransactionComponent},
      {path: 'change-password', component: ChangePasswordComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
