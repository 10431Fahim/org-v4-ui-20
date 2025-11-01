import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Observable, of, tap} from "rxjs";
import {About} from "../../interfaces/common/about.interface";
import {FaqCategory} from '../../interfaces/common/faqCategory.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_CATEGORY = environment.apiBaseLink + '/api/faq-category/';


@Injectable({
  providedIn: 'root'
})
export class FaqCategoryService {
  private readonly cacheKey: string = 'faqCategory_cache';
  private faqCategoryCache: Map<string, { data: FaqCategory[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addFaqCategory
   * insertManyFaqCategory
   * getAllCategories
   * getFaqCategoryById
   * updateFaqCategoryById
   * updateMultipleFaqCategoryById
   * deleteFaqCategoryById
   * deleteMultipleFaqCategoryById
   */

  addFaqCategory(data: FaqCategory) {
    return this.httpClient.post<ResponsePayload>
    (API_CATEGORY + 'add', data);
  }

  insertManyFaqCategory(data: FaqCategory, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_CATEGORY + 'insert-many', mData);
  }

  getAllFaqCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: FaqCategory[], count: number, success: boolean }>(API_CATEGORY + 'get-all', filterData, {params});
  }

  getFaqCategoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: FaqCategory, message: string, success: boolean }>(API_CATEGORY + id, {params});
  }

  updateFaqCategoryById(id: string, data: FaqCategory) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CATEGORY + 'update/' + id, data);
  }

  changeMultipleFaqCategoryStatus(ids: string[], data: FaqCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_CATEGORY + 'change-multiple-category-status', mData);
  }

  updateMultipleFaqCategoryById(ids: string[], data: FaqCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_CATEGORY + 'update-multiple', mData);
  }

  deleteFaqCategoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_CATEGORY + 'delete/' + id, {params});
  }

  deleteMultipleFaqCategoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_CATEGORY + 'delete-multiple', {ids: ids}, {params});
  }

  /**
   * getAllCarousel
   */

  getAllAbout(): Observable<{
    data: FaqCategory[];
    success: boolean;
    message: string;
  }> {
    if (this.faqCategoryCache.has(this.cacheKey)) {
      return of(this.faqCategoryCache.get(this.cacheKey) as {
        data: FaqCategory[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: FaqCategory[];
        success: boolean;
        message: string;
      }>(API_CATEGORY + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.faqCategoryCache.set(this.cacheKey, response);
        })
      );
  }
}
