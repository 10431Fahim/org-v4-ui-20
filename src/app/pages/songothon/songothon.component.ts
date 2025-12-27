import {Component, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {RecentlyAllNewsComponent} from '../../shared/lazy/recently-all-news/recently-all-news.component';

@Component({
  selector: 'app-songothon',
  templateUrl: './songothon.component.html',
  imports: [
    RouterLink,
    TranslatePipe,
    RecentlyAllNewsComponent
  ],
  standalone:true,
  styleUrls: ['./songothon.component.scss']})
export class SongothonComponent implements OnInit {
  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'bn';
  constructor( public translateService: TranslateService) { }

  ngOnInit(): void {
  }

  onChangeLanguage(language: string) {
    this.isChangeLanguage = language === 'en';
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string){
     if(this.isChangeLanguageToggle !== language){
           this.isChangeLanguageToggle = language;
           this.isChangeLanguage = true;
           this.translateService.use(this.isChangeLanguageToggle);
     }
     else{
      this.isChangeLanguageToggle = 'bn';
      this.isChangeLanguage = false;
      this.translateService.use(this.isChangeLanguageToggle);
     }
  }

}
