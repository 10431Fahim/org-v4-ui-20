import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Executive} from '../../interfaces/common/executive.interface';
import {Observable} from "rxjs";
import {FilterData} from '../../interfaces/core/filter-data';

const API_BRAND = environment.apiBaseLink + '/api/executive/';


@Injectable({
  providedIn: 'root'
})
export class ExecutiveService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addExecutive
   * getAllExecutives
   * getExecutiveById
   * updateExecutiveById
   * deleteExecutiveById
   * deleteMultipleExecutiveById
   */

  addExecutive(data: Executive):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }

  getAllExecutives(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Executive[], count: number, success: boolean }>(API_BRAND + 'get-all', filterData, {params});
  }

  getExecutiveById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Executive, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateExecutiveById(id: string, data: Executive) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteExecutiveById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleExecutiveById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }

  // executiveGroupByField<T>(dataArray: T[], field: string): ExecutiveGroup[] {
  //   const data = dataArray.reduce((group, product) => {
  //     const uniqueField = product[field]
  //     group[uniqueField] = group[uniqueField] ?? [];
  //     group[uniqueField].push(product);
  //     return group;
  //   }, {});
  //
  //   const final = [];
  //
  //   for (const key in data) {
  //     final.push({
  //       _id: key,
  //       data: data[key]
  //     })
  //   }
  //
  //   return final as ExecutiveGroup[];

  // }



}
