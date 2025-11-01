import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Reports} from '../../interfaces/common/reports.interface';
import {Observable, of, tap} from "rxjs";
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/reports/';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly cacheKey: string = 'reports_cache';
  private reportsCache: Map<string, { data: Reports[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllReportss
   */
  getAllReportss(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Reports[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }
  getReportsById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Reports, message: string, success: boolean }>(API_PROJECT + 'get-reports/' + id, {params});
  }

  /**
   * getAllCarousel
   */

  getAllReports(): Observable<{
    data: Reports[];
    success: boolean;
    message: string;
  }> {
    if (this.reportsCache.has(this.cacheKey)) {
      return of(this.reportsCache.get(this.cacheKey) as {
        data: Reports[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Reports[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.reportsCache.set(this.cacheKey, response);
        })
      );
  }
}
