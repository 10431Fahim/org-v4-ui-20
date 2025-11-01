import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Client} from '../../interfaces/common/client.interface';

import {Observable, of, tap} from "rxjs";
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/client/';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly cacheKey: string = 'client_cache';
  private clientCache: Map<string, { data: Client[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addClient
   * getAllClients
   */

  getAllClients(filterData: FilterData, searchQuery?: any) {
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

    return this.httpClient.get<{ data: Client[], count: number, success: boolean }>(API_PROJECT + 'get-all-by', {params});
  }

  getClientById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Client, message: string, success: boolean }>(API_PROJECT + 'get-client/' + id, {params});
  }

  /**
   * getAllCarousel
   */

  getAllClient(): Observable<{
    data: Client[];
    success: boolean;
    message: string;
  }> {
    if (this.clientCache.has(this.cacheKey)) {
      return of(this.clientCache.get(this.cacheKey) as {
        data: Client[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Client[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.clientCache.set(this.cacheKey, response);
        })
      );
  }
}
