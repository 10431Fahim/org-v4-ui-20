import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {MembershipFee} from "../../interfaces/common/membership-fee.interface";


const API_MEMBERSHIP_FEE = environment.apiBaseLink + '/api/membership-fee/';


@Injectable({
  providedIn: 'root'
})
export class MembershipFeeService {

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

  addMembershipFee(data: MembershipFee) {
    return this.httpClient.post<ResponsePayload>
    (API_MEMBERSHIP_FEE + 'add', data);
  }

}
