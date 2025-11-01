import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Donate} from "../../interfaces/common/donate.interface";
import {Observable} from "rxjs";


const API_DONATE = environment.apiBaseLink + '/api/donate/';


@Injectable({
  providedIn: 'root'
})
export class DonateService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addMembershipFee
   * insertManyMembershipFee
   * getAllMembershipFees
   * getMembershipFeeById
   * updateMembershipFeeById
   * updateMultipleMembershipFeeById
   * deleteMembershipFeeById
   * deleteMultipleMembershipFeeById
   */

  addDonate(data: Donate) {
    return this.httpClient.post<ResponsePayload>
    (API_DONATE + 'add', data);
  }


  checkDonation(data: Donate) {
    return this.httpClient.post<ResponsePayload>
    (API_DONATE + 'check-donation', data);
  }



}
