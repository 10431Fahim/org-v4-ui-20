import {Injectable} from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Certificate} from '../../interfaces/common/certificate.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/certificate/';


@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addCertificate
   * insertManyCertificate
   * getAllCertificates
   * getCertificateById
   * updateCertificateById
   * updateMultipleCertificateById
   * deleteCertificateById
   * deleteMultipleCertificateById
   */

  addCertificate(data: Certificate) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }

  validateCertificateById(data: Certificate) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'validate', data);
  }


  getAllCertificates(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Certificate[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }

  updateCertificateByIdUser(id: string, data: Certificate) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deleteCertificateByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }
  getCertificateById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Certificate, message: string, success: boolean }>(API_PROJECT+ id, {params});
  }


}
