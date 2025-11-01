import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllNoticeComponent } from './all-notice.component';
import { NoticeDetailsComponent } from './notice-details/notice-details.component';

const routes: Routes = [
  {
    path:'',
    component:AllNoticeComponent
  },
  {
    path:':id',
    component:NoticeDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllNoticeRoutingModule { }
