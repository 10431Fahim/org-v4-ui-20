import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Why} from '../../interfaces/common/why.interface';
import {FilterData} from '../../interfaces/core/filter-data';


const API_PROJECT = environment.apiBaseLink + '/api/why/';


@Injectable({
  providedIn: 'root'
})
export class WhyService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAllWhys
   */

  getAllWhys(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Why[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }

}
