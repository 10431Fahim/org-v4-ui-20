import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {LatestVideo} from '../../interfaces/common/latest-video.interface';
import {Observable} from "rxjs";
import {FilterData} from '../../interfaces/core/filter-data';

const API_BRAND = environment.apiBaseLink + '/api/latestVideo/';


@Injectable({
  providedIn: 'root'
})
export class LatestVideoService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addLatestVideo
   * getAllLatestVideos
   * getLatestVideoById
   * updateLatestVideoById
   * deleteLatestVideoById
   * deleteMultipleLatestVideoById
   */

  addLatestVideo(data: LatestVideo):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }

  getAllLatestVideos(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: LatestVideo[], count: number, success: boolean }>(API_BRAND + 'get-all', filterData, {params});
  }

  getLatestVideoById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: LatestVideo, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateLatestVideoById(id: string, data: LatestVideo) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteLatestVideoById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleLatestVideoById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }

  // latestVideoGroupByField<T>(dataArray: T[], field: string): LatestVideoGroup[] {
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
  //   return final as LatestVideoGroup[];

  // }



}
