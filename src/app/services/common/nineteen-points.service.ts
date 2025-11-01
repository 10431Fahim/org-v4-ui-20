import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';

import {Observable, of, tap} from "rxjs";
import {NineteenPoints} from '../../interfaces/common/nineteen-points.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/nineteen-points/';


@Injectable({
  providedIn: 'root'
})
export class NineteenPointsService {
  private readonly cacheKey: string = 'nineteen_cache';
  private nineteenCache: Map<string, { data: NineteenPoints[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addNineteenPoints
   * insertManyNineteenPoints
   * getAllNineteenPointss
   * getNineteenPointsById
   * updateNineteenPointsById
   * updateMultipleNineteenPointsById
   * deleteNineteenPointsById
   * deleteMultipleNineteenPointsById
   */

  addNineteenPoints(data: NineteenPoints) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllNineteenPointss(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: NineteenPoints[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getNineteenPointssBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: NineteenPoints, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateNineteenPointsByIdUser(id: string, data: NineteenPoints) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteNineteenPointsByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllNineTeenPoints(): Observable<{
    data: NineteenPoints[];
    success: boolean;
    message: string;
  }> {
    if (this.nineteenCache.has(this.cacheKey)) {
      return of(this.nineteenCache.get(this.cacheKey) as {
        data: NineteenPoints[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: NineteenPoints[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.nineteenCache.set(this.cacheKey, response);
        })
      );
  }
}
