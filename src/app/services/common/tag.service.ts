import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Tag} from '../../interfaces/common/tag.interface';
import {Observable, of, tap} from "rxjs";
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/tag/';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly cacheKey: string = 'tag_cache';
  private tagCache: Map<string, { data: Tag[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllTags
   */


  getAllTags(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Tag[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getAllTag(): Observable<{
    data: Tag[];
    success: boolean;
    message: string;
  }> {
    if (this.tagCache.has(this.cacheKey)) {
      return of(this.tagCache.get(this.cacheKey) as {
        data: Tag[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Tag[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.tagCache.set(this.cacheKey, response);
        })
      );
  }

}
