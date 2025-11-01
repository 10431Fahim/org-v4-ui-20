import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'englishToBanglaDate'
})
export class EnglishToBanglaDatePipe implements PipeTransform {

  private banglaNumbers: string[] = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  private banglaMonths: string[] = ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

  private toBanglaNumber(num: number): string {
    return num.toString().split('').map(digit => this.banglaNumbers[parseInt(digit, 10)]).join('');
  }

  transform(date: string): string {
    const parsedDate = new Date(date);
    const day = this.toBanglaNumber(parsedDate.getDate());
    const month = this.banglaMonths[parsedDate.getMonth()];
    const year = this.toBanglaNumber(parsedDate.getFullYear());

    return `${day} ${month} ${year}`;
  }
}
