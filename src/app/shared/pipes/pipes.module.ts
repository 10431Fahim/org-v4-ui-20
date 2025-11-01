import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {SecToTimePipe} from './sec-to-time.pipe';
import { SafeHtmlCustomPipe } from './safe-html.pipe';
import { SortPipe } from './sort.pipe';
import {SafeUrlPipe} from './safe-url.pipe';
import {EngBnNumPipe} from "./eng-bn-num.pipe";
import { EnglishToBanglaDatePipe } from './english-to-bangla-date.pipe';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SafeHtmlCustomPipe,
    EngBnNumPipe,
    NumberMinDigitPipe,
    SortPipe,
    EnglishToBanglaDatePipe,
    SecToTimePipe,
    SafeUrlPipe
  ],
  exports: [
    NumberMinDigitPipe,
    SecToTimePipe,
    SafeHtmlCustomPipe,
    SortPipe,
    SafeUrlPipe,
    EngBnNumPipe,
    EnglishToBanglaDatePipe
  ]
})
export class PipesModule {
}
