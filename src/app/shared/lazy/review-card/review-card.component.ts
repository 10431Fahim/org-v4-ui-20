import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent implements OnInit {
  @Input() data?:any;

  isChangeLanguage: boolean = false;
  isChangeLanguageToggle: string = 'en';
  constructor( public translateService: TranslateService,) { }

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
