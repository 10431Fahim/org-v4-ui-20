import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {PortfolioCategory} from '../../interfaces/common/portfolio-category.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_CATEGORY = environment.apiBaseLink + '/api/portfolioCategory/';


@Injectable({
  providedIn: 'root'
})
export class PortfolioCategoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPortfolioCategory
   * insertManyPortfolioCategory
   * getAllCategories
   * getPortfolioCategoryById
   * updatePortfolioCategoryById
   * updateMultiplePortfolioCategoryById
   * deletePortfolioCategoryById
   * deleteMultiplePortfolioCategoryById
   */

  addPortfolioCategory(data: PortfolioCategory) {
    return this.httpClient.post<ResponsePayload>
    (API_CATEGORY + 'add', data);
  }

  insertManyPortfolioCategory(data: PortfolioCategory, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_CATEGORY + 'insert-many', mData);
  }

  getAllCategories(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: PortfolioCategory[], count: number, success: boolean }>(API_CATEGORY + 'get-all', filterData, {params});
  }

  getPortfolioCategoryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PortfolioCategory, message: string, success: boolean }>(API_CATEGORY + id, {params});
  }

  updatePortfolioCategoryById(id: string, data: PortfolioCategory) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CATEGORY + 'update/' + id, data);
  }

  changeMultiplePortfolioCategoryStatus(ids: string[], data: PortfolioCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_CATEGORY + 'change-multiple-portfolioCategory-status', mData);
  }

  updateMultiplePortfolioCategoryById(ids: string[], data: PortfolioCategory) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_CATEGORY + 'update-multiple', mData);
  }

  deletePortfolioCategoryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_CATEGORY + 'delete/' + id, {params});
  }

  deleteMultiplePortfolioCategoryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_CATEGORY + 'delete-multiple', {ids: ids}, {params});
  }


}
