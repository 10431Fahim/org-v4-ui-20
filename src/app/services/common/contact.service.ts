import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Observable} from "rxjs";
import {Contact} from '../../interfaces/common/contact-us.interface';

const API_CONTACT = environment.apiBaseLink + '/api/contact-us/';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addContact
   * insertManyContact
   * getAllContacts
   * getContactById
   * updateContactById
   * updateMultipleContactById
   * deleteContactById
   * deleteMultipleContactById
   */

  addContact(data: Contact) {
    return this.httpClient.post<ResponsePayload>
    (API_CONTACT + 'add', data);
  }
  generatePDF(htmlContent: string): Observable<Blob> {
    return this.httpClient.post(API_CONTACT + 'generate', { htmlContent }, { responseType: 'blob' });
  }
}
