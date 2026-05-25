import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/core/filter-data';

const API_PLAN = environment.apiBaseLink + '/api/plan-180-days/';

@Injectable({
    providedIn: 'root'
})
export class Plan180DaysService {
    private httpClient = inject(HttpClient);

    getAllPlans(filterData: FilterData, searchQuery?: string) {
        let params = new HttpParams();
        if (searchQuery) {
            params = params.set('q', searchQuery);
        }
        return this.httpClient.post<ResponsePayload>(API_PLAN + 'get-all', filterData, { params });
    }

    getPlanById(id: string) {
        return this.httpClient.get<ResponsePayload>(API_PLAN + id);
    }
}
