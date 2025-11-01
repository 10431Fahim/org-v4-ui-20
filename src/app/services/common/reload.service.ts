import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  
  refresPlay = new Subject<boolean>();
  refreshReview = new Subject<boolean>();
  refreshPackage = new Subject<boolean>();
  constructor() { }


  get refreshAutoplay$(){
     return this.refresPlay;
  }

  needRefreshAutoPlay$(a:any){
     this.refresPlay.next(a);
  }

  get refreshReview$(){
    return this.refreshReview;
 }

 needRefreshReview$(a:any){
    this.refreshReview.next(a);
 }

 get refreshPackage$(){
    return this.refreshPackage;
 }

  needRefreshPackage$(){
     this.refreshPackage.next(true);
 }

}
