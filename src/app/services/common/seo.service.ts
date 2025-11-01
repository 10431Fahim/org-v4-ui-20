import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import {Seo} from '../../interfaces/common/seo.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_COURSE= environment.apiBaseLink + '/api/seo/';


@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllSeos
   */


  getAllSeos(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    // if (searchQuery) {
    //   params = params.append('q', searchQuery);
    // }
    return this.httpClient.post<{ data: Seo[], count: number, success: boolean }>(API_COURSE+ 'get-all', filterData, {params});
  }

  getSeoById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Seo, message: string, success: boolean }>(API_COURSE+ id, {params});
  }

  getSeoByPageName(pageName: string) {
    let params = new HttpParams();
    if (pageName) {
      params = params.append('page', pageName);
    }
    return this.httpClient.get<{ data: Seo, message: string, success: boolean }>(API_COURSE+ 'get-seo-by-page-name', {params});
  }


}
