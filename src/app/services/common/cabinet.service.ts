import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/core/filter-data';

const API_CABINET = environment.apiBaseLink + '/api/cabinet/';

@Injectable({
    providedIn: 'root'
})
export class CabinetService {
    private httpClient = inject(HttpClient);

    /**
     * getAllCabinet
     * @param filterData
     * @param searchQuery
     */
    getAllCabinet(filterData: FilterData, searchQuery?: string) {
        let params = new HttpParams();
        if (searchQuery) {
            params = params.set('q', searchQuery);
        }
        return this.httpClient.post<ResponsePayload>(API_CABINET + 'get-all', filterData, { params });
    }

    /**
     * getCabinetById
     * @param id
     * @param select
     */
    getCabinetById(id: string, select?: string) {
        let params = new HttpParams();
        if (select) {
            params = params.set('select', select);
        }
        return this.httpClient.get<ResponsePayload>(API_CABINET + id, { params });
    }
}
