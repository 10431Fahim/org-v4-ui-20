import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Observable, of, tap} from "rxjs";
import {Photo} from '../../interfaces/common/photo.interface';
import {FilterData} from '../../interfaces/core/filter-data';

const API_PROJECT = environment.apiBaseLink + '/api/photo/';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly cacheKey: string = 'photo_cache';
  private photoCache: Map<string, { data: Photo[]; message: string; success: boolean }> = new Map();

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPhoto
   * insertManyPhoto
   * getAllPhotos
   * getPhotoById
   * updatePhotoById
   * updateMultiplePhotoById
   * deletePhotoById
   * deleteMultiplePhotoById
   */

  addPhoto(data: Photo) {
    return this.httpClient.post<ResponsePayload>
    (API_PROJECT + 'add', data);
  }


  getAllPhotos(filterData: FilterData, searchQuery?: any) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Photo[], count: number, success: boolean }>(API_PROJECT + 'get-all', filterData, {params});
  }


  getPhotosBySlug(slug: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Photo, message: string, success: boolean }>(API_PROJECT + slug, {params});
  }

  updatePhotoByIdUser(id: string, data: Photo) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PROJECT + 'update/' + id, data);
  }


  deletePhotoByIdUser(id: string) {
    return this.httpClient.delete<ResponsePayload>(API_PROJECT + 'delete/' + id);
  }

  /**
   * getAllCarousel
   */

  getAllPhoto(): Observable<{
    data: Photo[];
    success: boolean;
    message: string;
  }> {
    if (this.photoCache.has(this.cacheKey)) {
      return of(this.photoCache.get(this.cacheKey) as {
        data: Photo[];
        success: boolean;
        message: string;
      });
    }

    return this.httpClient
      .get<{
        data: Photo[];
        success: boolean;
        message: string;
      }>(API_PROJECT + 'get-all-data')
      .pipe(
        tap((response) => {
          // Cache the response
          this.photoCache.set(this.cacheKey, response);
        })
      );
  }
}
