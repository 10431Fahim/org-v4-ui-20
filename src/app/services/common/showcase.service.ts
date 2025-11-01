import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Showcase} from '../../interfaces/common/showcase.interface';
import {Observable, of, tap} from 'rxjs';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/showcase/';


@Injectable({
  providedIn: 'root'
})
export class ShowcaseService {
  private readonly cacheKey: string = 'carousel_cache';
  private carouselCache: Map<string, { data: Showcase[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }
  /**
   * getAllShowcases
   */
  getAllShowcases(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Showcase[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params, withCredentials: true});
  }

  /**
   * getAllCarousel
   */

  getAllCarousel(): Observable<{
    data: Showcase[];
    success: boolean;
    message: string;
  }> {
    if (this.carouselCache.has(this.cacheKey)) {
      return of(this.carouselCache.get(this.cacheKey) as {
        data: Showcase[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Showcase[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.carouselCache.set(this.cacheKey, response);
        })
      );
  }

}
