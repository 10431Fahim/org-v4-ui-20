import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Standing} from '../../interfaces/common/standing.interface';
import {Observable, of, tap} from "rxjs";
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/standing/';


@Injectable({
  providedIn: 'root'
})
export class StandingService {
  private readonly cacheKey: string = 'standing_cache';
  private standingCache: Map<string, { data: Standing[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }
  /**
   * getAllStandings
   */
  getAllStandings(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Standing[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }

  /**
   * getAllCarousel
   */

  getAllStanding(): Observable<{
    data: Standing[];
    success: boolean;
    message: string;
  }> {
    if (this.standingCache.has(this.cacheKey)) {
      return of(this.standingCache.get(this.cacheKey) as {
        data: Standing[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Standing[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.standingCache.set(this.cacheKey, response);
        })
      );
  }
}
