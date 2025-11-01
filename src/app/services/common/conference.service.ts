import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {Observable, of, tap} from "rxjs";
import {Conference} from '../../interfaces/common/conference.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/conference/';


@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  private readonly cacheKey: string = 'conference_cache';
  private conferenceCache: Map<string, { data: Conference[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addconference
   * getAllconferences
   */

  getAllConferences(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Conference[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }

  getConferenceById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Conference, message: string, success: boolean }>(API_PROJECT + 'get-conference/' + id, {params});
  }

  /**
   * getAllCarousel
   */

  getAllConference(): Observable<{
    data: Conference[];
    success: boolean;
    message: string;
  }> {
    if (this.conferenceCache.has(this.cacheKey)) {
      return of(this.conferenceCache.get(this.cacheKey) as {
        data: Conference[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Conference[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.conferenceCache.set(this.cacheKey, response);
        })
      );
  }
}
