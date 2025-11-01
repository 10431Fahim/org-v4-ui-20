import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from "../../interfaces/gallery/filter-data";
import {FoundingHistoric} from '../../interfaces/common/founding-historic.interface';
import {Observable, of, tap} from 'rxjs';

const API_PROJECT = environment.apiBaseLink + '/api/founding-historic/';


@Injectable({
  providedIn: 'root'
})
export class FoundingHistoricService {
  private readonly cacheKey: string = 'founding_cache';
  private foundingCache: Map<string, { data: FoundingHistoric[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addFoundingHistoric
   * insertManyFoundingHistoric
   * getAllFoundingHistorics
   * getFoundingHistoricById
   * updateFoundingHistoricById
   * updateMultipleFoundingHistoricById
   * deleteFoundingHistoricById
   * deleteMultipleFoundingHistoricById
   */

  addFoundingHistoric(data: FoundingHistoric) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllFoundingHistorics(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: FoundingHistoric[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getFoundingHistoricsBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: FoundingHistoric, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateFoundingHistoricByIdUser(id: string, data: FoundingHistoric) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteFoundingHistoricByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllFoundingHistoric(): Observable<{
    data: FoundingHistoric[];
    success: boolean;
    message: string;
  }> {
    if (this.foundingCache.has(this.cacheKey)) {
      return of(this.foundingCache.get(this.cacheKey) as {
        data: FoundingHistoric[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: FoundingHistoric[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.foundingCache.set(this.cacheKey, response);
        })
      );
  }

}
