import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {environment} from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import {SecretKeyTypeEnum} from '../../enum/secret-key-type.enum';
import {isPlatformBrowser} from "@angular/common";


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  get storedProductInput(): any {
    const data = sessionStorage.getItem(DATABASE_KEY.productFormData);
    return data ? JSON.parse(data) : null;
  }

  get storedCouponData(): any {
    const data = sessionStorage.getItem(DATABASE_KEY.userCoupon);
    return data ? JSON.parse(data) : null;
  }

  /**
   * SESSION STORAGE
   */

  // storeDataToSessionStorage(key: string, data: any) {
  //   sessionStorage.setItem(key, JSON.stringify(data));
  // }
  //
  // getDataFromSessionStorage(key: string): any {
  //   const data = sessionStorage.getItem(key);
  //   return JSON.parse(data);
  // }

  storeDataToSessionStorage(key: string, data: any) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(key, JSON.stringify(data));
    } else {
      // console.warn('SessionStorage is not available on the server side.');
    }
  }

  getDataFromSessionStorage(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } else {
      // console.warn('SessionStorage is not available on the server side.');
      return null;
    }
  }

  removeSessionData(key: string) {
    sessionStorage.removeItem(key);
  }

  /**
   * LOCAL STORAGE
   */

  storeDataToLocalStorage(data: any, key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      // console.warn('LocalStorage is not available on the server side.');
    }
  }

  getDataFromLocalStorage(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } else {
      // console.warn('LocalStorage is not available on the server side.');
      return null;
    }
  }

  removeLocalData(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    } else {
      // console.warn('LocalStorage is not available on the server side.');
    }
  }

  /**
   * SESSION STORAGE
   */

  storeProductInputData(data: any) {
    sessionStorage.setItem(DATABASE_KEY.productFormData, JSON.stringify(data));
  }

  storeCouponData(data: any) {
    sessionStorage.setItem(DATABASE_KEY.userCoupon, JSON.stringify(data));
  }

  /**
   * DYNAMIC SESSION DATA
   */
  storeInputData(data: any, key: string) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getStoredInput(key: string): any {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }


  /**
   * ENCRYPT STORAGE
   */

  addDataToEncryptLocal(data: object, key: string) {
    const encryptedData = this.encryptWithCrypto(data, SecretKeyTypeEnum.STORAGE_TOKEN);
    localStorage.setItem(key, encryptedData);
  }

  getDataFromEncryptLocal(key: string) {
    const encryptString = localStorage.getItem(key);
    if (encryptString) {
      return this.decryptWithCrypto(encryptString, SecretKeyTypeEnum.STORAGE_TOKEN);
    } else {
      return null;
    }

  }

  removeDataFromEncryptLocal(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * ENCRYPT CRYPTO JS
   */
  encryptWithCrypto(data: object, secretKey: string) {
    const cryptToSecretKey = this.getSecretKey(secretKey);
    return CryptoJS.AES.encrypt(JSON.stringify(data), cryptToSecretKey).toString();
  }

  encryptStringWithCrypto(str: string, secretKey: string) {
    const cryptToSecretKey = this.getSecretKey(secretKey);
    return CryptoJS.AES.encrypt(str, cryptToSecretKey).toString();
  }

  decryptWithCrypto(encryptString: string, secretKey: string) {
    const cryptToSecretKey = this.getSecretKey(secretKey);
    const bytes = CryptoJS.AES.decrypt(encryptString, cryptToSecretKey);
    try {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      return null;
    }
  }

  decryptStringWithCrypto(encryptString: string, secretKey: string) {
    const cryptToSecretKey = this.getSecretKey(secretKey);
    const bytes = CryptoJS.AES.decrypt(encryptString, cryptToSecretKey);
    try {
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  }

  // Get Secret Key
  protected getSecretKey(secretKey: string): string {
    switch (secretKey) {
      case SecretKeyTypeEnum.ADMIN_TOKEN: {
        return environment.adminTokenSecret;
      }
      case SecretKeyTypeEnum.USER_TOKEN: {
        return environment.userTokenSecret;
      }
      case SecretKeyTypeEnum.API_TOKEN: {
        return environment.apiTokenSecret;
      }
      case SecretKeyTypeEnum.STORAGE_TOKEN: {
        return environment.storageSecret;
      }
      default: {
        return environment.storageSecret;
      }
    }
  }


}
