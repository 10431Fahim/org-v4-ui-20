import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable, of, tap} from "rxjs";
import {About} from '../../interfaces/common/about.interface';

const API_PROJECT = environment.apiBaseLink + '/api/about/';


@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private readonly cacheKey: string = 'about_cache';
  private aboutCache: Map<string, { data: About[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addAbout
   * insertManyAbout
   * getAllAbouts
   * getAboutById
   * updateAboutById
   * updateMultipleAboutById
   * deleteAboutById
   * deleteMultipleAboutById
   */

  addAbout(data: About) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllAbouts(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: About[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getAboutsBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: About, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updateAboutByIdUser(id: string, data: About) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteAboutByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllAbout(): Observable<{
    data: About[];
    success: boolean;
    message: string;
  }> {
    if (this.aboutCache.has(this.cacheKey)) {
      return of(this.aboutCache.get(this.cacheKey) as {
        data: About[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: About[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.aboutCache.set(this.cacheKey, response);
        })
      );
  }
}
