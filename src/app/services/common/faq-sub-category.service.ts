import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FaqSubCategory} from '../../interfaces/common/faq-sub-category.interface';
import {Category} from '../../interfaces/common/category.interface';
import {Observable, of, tap} from "rxjs";
import {About} from "../../interfaces/common/about.interface";
import {FilterData} from '../../interfaces/core/filter-data';

const API_SUB_CATEGORY = environment.apiBaseLink + '/api/faq-sub-category/';


@Injectable({
  providedIn: 'root'
})
export class FaqSubCategoryService {
  private readonly cacheKey: string = 'faqSub_cache';
  private faqSubCache: Map<string, { data: FaqSubCategory[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addFaqSubCategory
   * insertManyFaqSubCategory
   * getAllCategories
   * getFaqSubCategoryById
   * updateFaqSubCategoryById
   * updateMultipleFaqSubCategoryById
   * deleteFaqSubCategoryById
   * deleteMultipleFaqSubCategoryById
   */

  addFaqSubCategory(data: FaqSubCategory) {
    return this.httpClient.post<ResponsePayload>
    (API_SUB_CATEGORY + 'add', data);
  }

  insertManyFaqSubCategory(data: FaqSubCategory, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_SUB_CATEGORY + 'insert-many', mData);
  }

  getAllFaqSubCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: FaqSubCategory[], count: number, success: boolean }>(API_SUB_CATEGORY + 'get-all', filterData, {params});
  }

  getFaqSubCategoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: FaqSubCategory, message: string, success: boolean }>(API_SUB_CATEGORY + id, {params});
  }

  getSubCategoriesByCategoryId(categoryId: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: FaqSubCategory[], message: string, success: boolean }>(API_SUB_CATEGORY + 'get-all-by-parent/' + categoryId, {params});
  }


  updateFaqSubCategoryById(id: string, data: FaqSubCategory) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_SUB_CATEGORY + 'update/' + id, data);
  }

  updateMultipleFaqSubCategoryById(ids: string[], data: FaqSubCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_SUB_CATEGORY + 'update-multiple', mData);
  }

  changeMultipleFaqSubCategoryStatus(ids: string[], data: Category) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_SUB_CATEGORY + 'change-multiple-faq-sub-category-status', mData);
  }

  deleteFaqSubCategoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_SUB_CATEGORY + 'delete/' + id, {params});
  }

  deleteMultipleFaqSubCategoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_SUB_CATEGORY + 'delete-multiple', {ids: ids}, {params});
  }

  /**
   * getAllCarousel
   */

  getAllFaqSubCategory(): Observable<{
    data: FaqSubCategory[];
    success: boolean;
    message: string;
  }> {
    if (this.faqSubCache.has(this.cacheKey)) {
      return of(this.faqSubCache.get(this.cacheKey) as {
        data: FaqSubCategory[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: FaqSubCategory[];
        success: boolean;
        message: string;
      }>(API_SUB_CATEGORY + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.faqSubCache.set(this.cacheKey, response);
        })
      );
  }
}
