import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
// import { FilterData } from 'src/app/interfaces/core/filter-data';
import {FilterData} from '../../interfaces/gallery/filter-data';

import {Observable, of, tap} from "rxjs";
import {OurVision} from '../../interfaces/common/our-vision.interface';

const API_PROJECT = environment.apiBaseLink + '/api/our-vision/';


@Injectable({
  providedIn: 'root'
})
export class OurVisionService {
  private readonly cacheKey: string = 'ourvision_cache';
  private ourvisionCache: Map<string, { data: OurVision[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addOurVision
   * insertManyOurVision
   * getAllOurVisions
   * getOurVisionById
   * updateOurVisionById
   * updateMultipleOurVisionById
   * deleteOurVisionById
   * deleteMultipleOurVisionById
   */

  addOurVision(data: OurVision) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllOurVisions(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: OurVision[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getOurVisionsBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: OurVision, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateOurVisionByIdUser(id: string, data: OurVision) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteOurVisionByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllOurVision(): Observable<{
    data: OurVision[];
    success: boolean;
    message: string;
  }> {
    if (this.ourvisionCache.has(this.cacheKey)) {
      return of(this.ourvisionCache.get(this.cacheKey) as {
        data: OurVision[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: OurVision[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.ourvisionCache.set(this.cacheKey, response);
        })
      );
  }
}
