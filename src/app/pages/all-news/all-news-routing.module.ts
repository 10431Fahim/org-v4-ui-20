import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllNewsComponent} from './all-news.component';
import {NewsDetailComponent} from './news-detail/news-detail.component';

const routes: Routes = [{
  path: '',
  component: AllNewsComponent
},
  {
    path: ':id',
    component: NewsDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllNewsRoutingModule {
}
