import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Observable, of, tap} from "rxjs";
import {Portfolio} from '../../interfaces/common/portfolio.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/portfolio/';


@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly cacheKey: string = 'portfolio_cache';
  private portfolioCache: Map<string, { data: Portfolio[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPortfolio
   * insertManyPortfolio
   * getAllPortfolios
   * getPortfolioById
   * updatePortfolioById
   * updateMultiplePortfolioById
   * deletePortfolioById
   * deleteMultiplePortfolioById
   */

  addPortfolio(data: Portfolio) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllPortfolios(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Portfolio[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getPortfoliosBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Portfolio, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updatePortfolioByIdUser(id: string, data: Portfolio) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deletePortfolioByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  getAllPortfolio(): Observable<{
    data: Portfolio[];
    success: boolean;
    message: string;
  }> {
    if (this.portfolioCache.has(this.cacheKey)) {
      return of(this.portfolioCache.get(this.cacheKey) as {
        data: Portfolio[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Portfolio[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.portfolioCache.set(this.cacheKey, response);
        })
      );
  }

}
