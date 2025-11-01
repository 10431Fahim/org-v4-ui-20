import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FooterControllService {
  
  footerHide = true;

  constructor() { }

  /***
   * footerHideControll()
   */
  
   footerHideControll(){
    this.footerHide = false;
  }
}
