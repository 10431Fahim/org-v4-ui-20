import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {Moto} from '../../interfaces/common/motto.interface';
import {Observable, of, tap} from 'rxjs';


const API_PROJECT = environment.apiBaseLink + '/api/motto/';


@Injectable({
  providedIn: 'root'
})
export class MotoService {
  private readonly cacheKey: string = 'moto_cache';
  private motoCache: Map<string, { data: Moto[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addMoto
   * insertManyMoto
   * getAllMotos
   * getMotoById
   * updateMotoById
   * updateMultipleMotoById
   * deleteMotoById
   * deleteMultipleMotoById
   */

  addMoto(data: Moto) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllMotos(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Moto[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getMotosBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Moto, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateMotoByIdUser(id: string, data: Moto) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteMotoByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllMoto(): Observable<{
    data: Moto[];
    success: boolean;
    message: string;
  }> {
    if (this.motoCache.has(this.cacheKey)) {
      return of(this.motoCache.get(this.cacheKey) as {
        data: Moto[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Moto[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.motoCache.set(this.cacheKey, response);
        })
      );
  }
}
