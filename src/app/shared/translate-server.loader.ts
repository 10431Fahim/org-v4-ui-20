import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {TranslateLoader} from '@ngx-translate/core';
import {makeStateKey, StateKey, TransferState} from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TranslationData {
  _version: string;
  [key: string]: any;
}

export const TRANSLATION_VERSION = 'v1.0.3'; // প্রতিবার নতুন করলে version change করো

export class TranslateServerLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private http: HttpClient,
    private prefix: string = 'i18n',
    private suffix: string = '.json'
  ) {}

  public getTranslation(lang: string): Observable<any> {
    const key: StateKey<TranslationData> = makeStateKey<TranslationData>(
      `transfer-translate-${lang}-${TRANSLATION_VERSION}`
    );

    const data = this.transferState.get<TranslationData>(key, {} as TranslationData);

    if (data && data._version === TRANSLATION_VERSION) {
      return new Observable((observer) => {
        observer.next(data);
        observer.complete();
      });
    }

    // HTTP request to get translation file
    return this.http.get(`/i18n/${lang}.json`).pipe(
      tap((jsonData: any) => {
        // Inject version tag
        jsonData._version = TRANSLATION_VERSION;

        // TransferState-এ version সহ key সংরক্ষণ
        this.transferState.set(key, jsonData);
      })
    );
  }
}

export function translateServerLoaderFactory(transferState: TransferState, http: HttpClient) {
  return new TranslateServerLoader(transferState, http);
}
