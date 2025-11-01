import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';

import {Observable, of, tap} from "rxjs";
import {ThirtyOnePoints} from '../../interfaces/common/thirtyOne-points.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/thirtyOne-points/';


@Injectable({
  providedIn: 'root'
})
export class ThirtyOnePointsService {
  private readonly cacheKey: string = 'thirty_cache';
  private thirtyCache: Map<string, { data: ThirtyOnePoints[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addThirtyOnePoints
   * insertManyThirtyOnePoints
   * getAllThirtyOnePointss
   * getThirtyOnePointsById
   * updateThirtyOnePointsById
   * updateMultipleThirtyOnePointsById
   * deleteThirtyOnePointsById
   * deleteMultipleThirtyOnePointsById
   */

  addThirtyOnePoints(data: ThirtyOnePoints) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllThirtyOnePointss(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ThirtyOnePoints[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getThirtyOnePointssBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ThirtyOnePoints, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateThirtyOnePointsByIdUser(id: string, data: ThirtyOnePoints) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteThirtyOnePointsByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllThirtyOn(): Observable<{
    data: ThirtyOnePoints[];
    success: boolean;
    message: string;
  }> {
    if (this.thirtyCache.has(this.cacheKey)) {
      return of(this.thirtyCache.get(this.cacheKey) as {
        data: ThirtyOnePoints[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: ThirtyOnePoints[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.thirtyCache.set(this.cacheKey, response);
        })
      );
  }
}
