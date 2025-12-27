import { Component, OnInit } from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import {EngBnNumPipe} from '../../pipes/eng-bn-num.pipe';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    RouterLink,
    NgIf,
    EngBnNumPipe,
    TranslatePipe
  ],
  standalone:true,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number;
  constructor(
    public translateService: TranslateService,

  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
  }

}
