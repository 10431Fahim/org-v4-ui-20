import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable, of, tap} from "rxjs";
import {VisionsResources} from '../../interfaces/common/visions-resources.interface';

const API_PROJECT = environment.apiBaseLink + '/api/visions-resources/';


@Injectable({
  providedIn: 'root'
})
export class VisionsResourcesService {
  private readonly cacheKey: string = 'visions_cache';
  private visionsCache: Map<string, { data: VisionsResources[]; message: string; success: boolean }> = new Map();

  private readonly cacheAllKey: string = 'visionsAll_cache';
  private visionsAllCache: Map<string, { data: VisionsResources[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addVisionsResources
   * insertManyVisionsResources
   * getAllVisionsResourcess
   * getVisionsResourcesById
   * updateVisionsResourcesById
   * updateMultipleVisionsResourcesById
   * deleteVisionsResourcesById
   * deleteMultipleVisionsResourcesById
   */

  addVisionsResources(data: VisionsResources) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllVisionsResourcess(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: VisionsResources[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getVisionsResourcessBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: VisionsResources, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateVisionsResourcesByIdUser(id: string, data: VisionsResources) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteVisionsResourcesByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllVisions(): Observable<{
    data: VisionsResources[];
    success: boolean;
    message: string;
  }> {
    if (this.visionsCache.has(this.cacheKey)) {
      return of(this.visionsCache.get(this.cacheKey) as {
        data: VisionsResources[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: VisionsResources[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.visionsCache.set(this.cacheKey, response);
        })
      );
  }


  getAllVisionsData(): Observable<{
    data: VisionsResources[];
    success: boolean;
    message: string;
  }> {
    if (this.visionsAllCache.has(this.cacheAllKey)) {
      return of(this.visionsAllCache.get(this.cacheAllKey) as {
        data: VisionsResources[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: VisionsResources[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-visions-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.visionsAllCache.set(this.cacheAllKey, response);
        })
      );
  }
}
