import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Faq} from '../../interfaces/common/faq.interface';
import {FaqSubCategory} from '../../interfaces/common/faq-sub-category.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_COURSE= environment.apiBaseLink + '/api/faq/';


@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addFaq
   * insertManyFaq
   * getAllFaqs
   * getFaqById
   * updateFaqById
   * updateMultipleFaqById
   * deleteFaqById
   * deleteMultipleFaqById
   */

  addFaq(data: Faq) {
    return this.httpClient.post<ResponsePayload>
    (API_COURSE+ 'add', data);
  }

  insertManyFaq(data: Faq, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_COURSE+ 'insert-many', mData);
  }

  cloneSingleFaq(id: string) {
    return this.httpClient.post<ResponsePayload>
    (API_COURSE + 'clone', {id});
  }

  getAllFaqs(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Faq[], count: number, success: boolean }>(API_COURSE+ 'get-all', filterData, {params});
  }

  getFaqById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Faq, message: string, success: boolean }>(API_COURSE+ id, {params});
  }

  updateFaqById(id: string, data: Faq) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_COURSE+ 'update/' + id, data);
  }

  updateMultipleFaqById(ids: string[], data: Faq) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_COURSE+ 'update-multiple', mData);
  }

  deleteFaqById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_COURSE+ 'delete-data/' + id, {params});
  }

  deleteMultipleFaqById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_COURSE+ 'delete-multiple', {ids: ids}, {params});
  }


  getFaqsBySubCategoryId(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: FaqSubCategory[], message: string, success: boolean }>(API_COURSE + 'get-faqs-by-sub-category/' + id, {params});
  }




}
