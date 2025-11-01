import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Review} from '../../interfaces/common/review.interface';
import {Observable, of, tap} from "rxjs";
import {About} from "../../interfaces/common/about.interface";
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/review/';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly cacheKey: string = 'news_cache';
  private newsCache: Map<string, { data: About[]; message: string; success: boolean }> = new Map();

  private readonly cacheAllKey: string = 'allNews_cache';
  private allNewsCache: Map<string, { data: About[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllReviews
   */
  getAllReviews(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Review[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }

  getReviewById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Review, message: string, success: boolean }>(API_PROJECT + 'get-review/' + id, {params});
  }

  getReviewByIdSsr(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Review, message: string, success: boolean }>(API_PROJECT + 'get-review-by/' + id, {params});
  }
  /**
   * getAllCarousel
   */

  getAllNews(): Observable<{
    data: Review[];
    success: boolean;
    message: string;
  }> {
    if (this.newsCache.has(this.cacheKey)) {
      return of(this.newsCache.get(this.cacheKey) as {
        data: Review[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Review[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.newsCache.set(this.cacheKey, response);
        })
      );
  }

  getAllNewsData(): Observable<{
    data: Review[];
    success: boolean;
    message: string;
  }> {
    if (this.allNewsCache.has(this.cacheAllKey)) {
      return of(this.allNewsCache.get(this.cacheAllKey) as {
        data: Review[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Review[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-news-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.allNewsCache.set(this.cacheAllKey, response);
        })
      );
  }
}
