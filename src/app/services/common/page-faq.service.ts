import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Observable, of, tap} from "rxjs";
import {PageFaq} from '../../interfaces/common/page-faq.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/page-faq/';


@Injectable({
  providedIn: 'root'
})
export class PageFaqService {
  // Store Data For Cache
  private faqCache: Map<string, { data: PageFaq[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPageFaq
   * insertManyPageFaq
   * getAllPageFaqs
   * getPageFaqById
   * updatePageFaqById
   * updateMultiplePageFaqById
   * deletePageFaqById
   * deleteMultiplePageFaqById
   */

  addPageFaq(data: PageFaq) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllPageFaqs(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: PageFaq[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getPageFaqsBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PageFaq, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updatePageFaqByIdUser(id: string, data: PageFaq) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deletePageFaqByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  getAllPageFaqByUi(filter: any, page: number, limit: number): Observable<{
    data: PageFaq[];
    message: string;
    success: boolean;
  }> {
    // Generate a unique cache key based on filterData
    const cacheKey = JSON.stringify({filter});

    // Check if data is already cached
    if (this.faqCache.has(cacheKey)) {
      return of(this.faqCache.get(cacheKey) as {
        data: PageFaq[];
        message: string;
        success: boolean;
      });
    }

    let params = new HttpParams();
    if (filter) {
      // Dynamically add filters to query parameters
      Object.keys(filter).forEach(key => {
        if (filter[key] !== undefined && filter[key] !== null) {
          params = params.set(key, filter[key]);
        }
      });
    }

    if (page) {
      params = params.set('page', page);
    }

    if (limit) {
      params = params.set('limit', limit);
    }

    return this.httpClient
      .get<{
        data: PageFaq[];
        message: string;
        success: boolean;
      }>(API_PROJECT + 'get-all-data', {params})
      .pipe(
        tap((response) => {
          // Cache the response
          this.faqCache.set(cacheKey, response);
        })
      );
  }
}
