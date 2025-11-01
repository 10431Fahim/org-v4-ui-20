import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Popup} from '../../interfaces/common/popup.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {Observable, of, tap} from "rxjs";

const API_POPUP = environment.apiBaseLink + '/api/popup/';


@Injectable({
  providedIn: 'root'
})
export class PopupService {
  // Store Data
  private readonly cacheKey: string = 'popup_cache';
  private tagCache: Map<string, { data: Popup; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllPopups()
   */


  getAllPopups(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Popup[], count: number, success: boolean }>(API_POPUP + 'get-all', filterData, {params});
  }


  getPopup(): Observable<{
    data: Popup;
    success: boolean;
    message: string;
  }> {
    if (this.tagCache.has(this.cacheKey)) {
      return of(this.tagCache.get(this.cacheKey) as {
        data: Popup;
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Popup;
        success: boolean;
        message: string;
      }>(API_POPUP + 'get-popup')
      .pipe(
        tap((response) => {
          // Cache the response
          this.tagCache.set(this.cacheKey, response);
        })
      );
  }


}
