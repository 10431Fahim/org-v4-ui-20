import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalPageViewComponent } from './additional-page-view.component';
import {RouterModule, Routes} from '@angular/router';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";

const routes: Routes = [
  {path: '', redirectTo: 'pages/about-us',
pathMatch:'full'},
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
    AdditionalPageViewComponent
  ],
  exports:[
    AdditionalPageViewComponent
  ]
})
export class AdditionalPageViewModule { }
