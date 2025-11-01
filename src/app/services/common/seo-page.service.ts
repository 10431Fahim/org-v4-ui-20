import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SeoPage} from '../../interfaces/common/seo-page.interface';
import {SEO_PAGE_TYPES} from '../../core/utils/app-data';
import {Observable} from 'rxjs';

const API_BASE = environment.apiBaseLink + '/api/seo-page/';


@Injectable({
  providedIn: 'root'
})
export class SeoPageService {

  private seoPageData: SeoPage[] = [];

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getSeoPageByPage()
   * getSeoPageByPageWithCache()
   */
  getSeoPageByPage(pageName: SEO_PAGE_TYPES, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: SeoPage, message: string, success: boolean }>(API_BASE + 'get-by/' + pageName, {params});
  }

  getSeoPageByPageWithCache(pageName: SEO_PAGE_TYPES, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return new Observable<SeoPage>((observer) => {
      const fData = this.seoPageData.find(f => f.pageName === pageName);
      if (fData) {
        observer.next(fData);
        observer.complete();
      } else {
        this.httpClient.get<{ data: SeoPage, message: string, success: boolean }>(API_BASE + 'get-by/' + pageName, {params})
          .subscribe({
            next: res => {
              if (res.data) {
                this.seoPageData.push(res.data);
                const fData = this.seoPageData.find(f => f.pageName === pageName);
                if (!fData) {
                  this.seoPageData.push(res.data);
                }
              }
              observer.next(res.data);
              observer.complete();
            },
            error: err => {
              console.log(err);
            }
          })
      }
    })
  }

}
