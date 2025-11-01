// src/app/services/csrf-token.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import {environment} from '../../../environments/environment';

const API_URL = environment.apiBaseLink + '/api/';

@Injectable({ providedIn: 'root' })
export class CsrfTokenService {
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadToken(): Promise<void> {
    // Only load token on browser side, not during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.http
        .get<{ csrfToken: string }>(API_URL + 'csrf-token', { withCredentials: true })
        .subscribe({
          next: (res) => {
            this.token = res.csrfToken;
            resolve();
          },
          error: (err) => reject(err)
        });
    });
  }

  getToken(): string | null {
    return this.token;
  }
}
