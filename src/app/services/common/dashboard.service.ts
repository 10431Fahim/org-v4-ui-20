import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserDashboard} from '../../interfaces/common/dashboard.interface';

const API_DASHBOARD = environment.apiBaseLink + '/api/dashboard/';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getUserDashboard() {
    return this.httpClient.get<{ data: UserDashboard, message: string, success: boolean }>(API_DASHBOARD + 'user-dashboard-new');
  }

}
