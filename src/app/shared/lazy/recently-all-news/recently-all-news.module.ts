import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentlyAllNewsComponent } from './recently-all-news.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecentlyNewsLoaderModule } from '../../loader/recently-news-loader/recently-news-loader.module';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    RecentlyNewsLoaderModule,
    RecentlyAllNewsComponent
  ],
  exports:[
    RecentlyAllNewsComponent
  ]
})
export class RecentlyAllNewsModule { }
