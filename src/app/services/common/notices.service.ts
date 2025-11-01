import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Notices} from '../../interfaces/common/notices.interface';

import {Observable, of, tap} from "rxjs";
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/notices/';


@Injectable({
  providedIn: 'root'
})
export class NoticesService {
  private readonly cacheKey: string = 'notices_cache';
  private noticesCache: Map<string, { data: Notices[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllNoticess
   */
  getAllNoticess(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Notices[],
      count: number,
      success: boolean
    }>(API_PROJECT + 'get-all', filterData, {params});
  }

  getNoticesById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Notices,
      message: string,
      success: boolean
    }>(API_PROJECT + 'get-notices/' + id, {params});
  }

  /**
   * getAllCarousel
   */

  getAllNotices(): Observable<{
    data: Notices[];
    success: boolean;
    message: string;
  }> {
    if (this.noticesCache.has(this.cacheKey)) {
      return of(this.noticesCache.get(this.cacheKey) as {
        data: Notices[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Notices[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.noticesCache.set(this.cacheKey, response);
        })
      );
  }
}
