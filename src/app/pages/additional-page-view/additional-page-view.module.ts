import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalPageViewComponent } from './additional-page-view.component';
import {RouterModule, Routes} from '@angular/router';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";
import {CandidateListComponent} from '../candidate-list/candidate-list.component';
import {CandidateProfileComponent} from '../candidate-profile/candidate-profile.component';

const routes: Routes = [
  {path: '', redirectTo: 'about-us', pathMatch:'full'},
  {path: 'candidate-list', component: CandidateListComponent},
  {path: 'candidate-list/profile/:slug', component: CandidateProfileComponent},
  {path: ':pageSlug', component: AdditionalPageViewComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PipesModule,
    TranslateModule,
    FormsModule,
    AdditionalPageViewComponent,
    CandidateListComponent,
    CandidateProfileComponent
  ],
  exports:[
    AdditionalPageViewComponent
  ]
})
export class AdditionalPageViewModule { }
