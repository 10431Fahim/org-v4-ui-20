
import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of, tap} from "rxjs";
import {Story} from '../../interfaces/common/story.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/story/';


@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private readonly cacheKey: string = 'stores_cache';
  private storesCache: Map<string, { data: Story[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllStorys
   */

  getAllStorys(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Story[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }
  getStoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Story, message: string, success: boolean }>(API_PROJECT + 'get-story/' + id, {params});
  }
  getStorysBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Story, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }
  /**
   * getAllCarousel
   */

  getAllStory(): Observable<{
    data: Story[];
    success: boolean;
    message: string;
  }> {
    if (this.storesCache.has(this.cacheKey)) {
      return of(this.storesCache.get(this.cacheKey) as {
        data: Story[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Story[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.storesCache.set(this.cacheKey, response);
        })
      );
  }
}
