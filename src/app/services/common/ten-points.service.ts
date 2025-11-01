import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';

import {Observable, of, tap} from "rxjs";
import {TenPoints} from '../../interfaces/common/ten-points.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/ten-points/';


@Injectable({
  providedIn: 'root'
})
export class TenPointsService {
  private readonly cacheKey: string = 'ten_cache';
  private tenCache: Map<string, { data: TenPoints[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addTenPoints
   * insertManyTenPoints
   * getAllTenPointss
   * getTenPointsById
   * updateTenPointsById
   * updateMultipleTenPointsById
   * deleteTenPointsById
   * deleteMultipleTenPointsById
   */

  addTenPoints(data: TenPoints) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllTenPointss(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: TenPoints[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getTenPointssBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: TenPoints, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateTenPointsByIdUser(id: string, data: TenPoints) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteTenPointsByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllTenPoints(): Observable<{
    data: TenPoints[];
    success: boolean;
    message: string;
  }> {
    if (this.tenCache.has(this.cacheKey)) {
      return of(this.tenCache.get(this.cacheKey) as {
        data: TenPoints[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: TenPoints[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.tenCache.set(this.cacheKey, response);
        })
      );
  }
}
