import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {Observable, of, tap} from "rxjs";
import {OurService} from '../../interfaces/common/our-service.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/our-service/';


@Injectable({
  providedIn: 'root'
})
export class OurServiceService {
  private readonly cacheKey: string = 'service_cache';
  private serviceCache: Map<string, { data: OurService[]; message: string; success: boolean }> = new Map();

  private readonly cacheAllKey: string = 'serviceAll_cache';
  private serviceAllCache: Map<string, { data: OurService[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllOurServices
   */

  getAllOurServices(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();

    // Add search query
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }

    // Add pagination parameters
    if (filterData.pagination) {
      params = params.append('pageSize', filterData.pagination.pageSize.toString());
      params = params.append('currentPage', filterData.pagination.currentPage.toString());
    }

    // Add filter parameters
    if (filterData.filter) {
      params = params.append('filter', JSON.stringify(filterData.filter));
    }

    // Add sort parameters
    if (filterData.sort) {
      params = params.append('sort', JSON.stringify(filterData.sort));
    }

    // Add select parameters
    if (filterData.select) {
      params = params.append('select', JSON.stringify(filterData.select));
    }

    return this.httpClient.get<{ data: OurService[], count: number, success: boolean }>(API_PROJECT + 'get-all-by', {params});
  }

  getOurServiceById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: OurService, message: string, success: boolean }>(API_PROJECT + 'get-ourService/' + id, {params});
  }

  getOurServicesBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: OurService, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }
  /**
   * getAllCarousel
   */

  getAllServices(): Observable<{
    data: OurService[];
    success: boolean;
    message: string;
  }> {
    if (this.serviceCache.has(this.cacheKey)) {
      return of(this.serviceCache.get(this.cacheKey) as {
        data: OurService[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: OurService[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.serviceCache.set(this.cacheKey, response);
        })
      );
  }

  /**
   * getAllCarousel
   */

  getAllVision(): Observable<{
    data: OurService[];
    success: boolean;
    message: string;
  }> {
    if (this.serviceAllCache.has(this.cacheAllKey)) {
      return of(this.serviceAllCache.get(this.cacheAllKey) as {
        data: OurService[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: OurService[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-service-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.serviceAllCache.set(this.cacheAllKey, response);
        })
      );
  }
}
