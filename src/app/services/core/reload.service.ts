import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private refreshUser = new Subject<void>();
  private refreshData = new Subject<void>();
  private refreshRoute = new Subject();
  private refreshLang = new BehaviorSubject<string>('');

  get refreshLang$() {
    return this.refreshLang;
  }
  needRefreshLang$(lang: string) {
    this.refreshLang.next(lang);
  }

  /**
   * REFRESH GLOBAL DATA
   */
  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }


  /**
   * REFRESH USEr DATA
   */

  get refreshUser$() {
    return this.refreshUser;
  }
  needRefreshUser$() {
    this.refreshUser.next();
  }


  /**
   * REFRESH Route
   */

  get refreshRoute$() {
    return this.refreshRoute;
  }
  needRefreshRoute$(type:string) {
    this.refreshRoute.next(type);
  }

}
