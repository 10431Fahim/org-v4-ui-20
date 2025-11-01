import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {UiService} from '../core/ui.service';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {StorageService} from '../core/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {User, UserAuthResponse} from '../../interfaces/common/user.interface';
import {isPlatformBrowser} from '@angular/common';

const API_URL_USER = environment.apiBaseLink + '/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token!: any;
  private isUser = false;
  private userId: any;
  public userStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private uiService: UiService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  // For New User Registration..
  userRegistration(data: User) {
    return this.httpClient.post<{
      success: boolean;
      message: string;
      data: any
    }>
    (API_URL_USER + 'signup', data);
  }

  // For Login User..
  userLogin(data: { username: string, password: string }, navigateFrom?: string) {
    this.httpClient.post<UserAuthResponse>
    (API_URL_USER + 'login', data)
      .subscribe(async res => {
        if (res.success) {
          this.token = res.token || '';
          // When Role & Permissions
          if (res.data) {
            this.userId = res.data._id;
          }
          // When Token
          if (res.token) {
            this.isUser = true;
            this.userStatusListener.next(true);
            // For Token Expired Time..
            const expiredInDuration = res.tokenExpiredIn;
            if (expiredInDuration) {
              this.setSessionTimer(expiredInDuration);
              // Save Login Time & Expiration Time & Token to Local Storage..
              const now = new Date();
              const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
            // Store to Local
            this.saveUserData(res.token, expirationDate, this.userId);

            this.spinner.hide();
            // Snack bar..
            this.uiService.success(res.message);
            // Navigate..
            if (navigateFrom) {
              this.router.navigate([navigateFrom]);
            } else {
              this.router.navigate([environment.userBaseUrl]);
            }
          }
        } else {
          this.uiService.wrong(res.message);
          this.spinner.hide();
          this.userStatusListener.next(false);
        }
      }
      }, error => {
        this.spinner.hide();
        this.userStatusListener.next(false);
        // console.log(error);
      });
  }

  userSignupAndLogin(data: User, navigateFrom?: string) {

    this.httpClient.post<UserAuthResponse>
    (API_URL_USER + 'signup-and-login', data).subscribe(async res => {
      if (res.success) {
        this.token = res.token || '';
        // When Role & Permissions
        if (res.data) {
          this.userId = res.data._id;
        }
        // When Token
        if (res.token) {
          this.isUser = true;
          this.userStatusListener.next(true);
          // For Token Expired Time..
          const expiredInDuration = res.tokenExpiredIn;
          if (expiredInDuration) {
            this.setSessionTimer(expiredInDuration);
            // Save Login Time & Expiration Time & Token to Local Storage..
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
          // Store to Local
          this.saveUserData(res.token, expirationDate, this.userId);
          // Snack bar..
          this.uiService.success(res.message);
          // Navigate..
          if (navigateFrom) {
            await this.router.navigate([navigateFrom]);
          } else {
            await this.router.navigate([environment.userBaseUrl]);
          }
        }
      }
      } else {
        this.uiService.wrong(res.message);
        this.userStatusListener.next(false);
      }

    }, error => {
      console.log(error)
      this.userStatusListener.next(false);
      // console.log(error);
    });
  }

  // That will Be Call First on Main App Component For Auto Login..
  autoUserLoggedIn() {
    // Only run auto-login on browser side, not during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const authInformation = this.getUserData();
    if (!authInformation) {
      this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
      return;
    }
    const now = new Date();
    const expDate = new Date(authInformation.expiredDate);
    const expiresIn = expDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userStatusListener.next(true);
      this.isUser = true;
      this.userId = authInformation.userId;
      this.setSessionTimer(expiresIn / 1000);
    }
  }


  // User LogOut..
  userLogOut() {
    this.token = '';
    this.isUser = false;
    this.userStatusListener.next(false);
    // Clear Token from Storage..
    this.clearUserData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    this.router.navigate([environment.userLoginUrl]);
  }

  /**
   * MAIN METHODS
   * checkUserForRegistration()
   * userSignupAndLogin()
   * userLogin()
   */

  checkUserForRegistration(email: string) {
    return this.httpClient.post<{ data: { otp: boolean }, message: string, success: boolean }>(API_URL_USER + 'check-user-for-registration', {email});
  }

  resetUserPassword(data: string) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL_USER + 'reset-user-password', data);
  }
  /**
   * GET ADMIN BASE DATA
   */

  getUserStatus() {
    return this.isUser;
  }

  getUserToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }


  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }


  /**
   * Get Logged In User Data
   */
  getLoggedInUserData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: User }>(API_URL_USER + 'logged-in-user-data', {params});
  }

  /**
   * Save User Info Encrypt to Local
   * Clear User Info From Local
   * Get User Info Encrypt from Local
   * Set Session Timer
   */
  protected saveUserData(token: string, expiredDate: Date, userId: string) {
    const data = {
      token,
      expiredDate,
      userId,
    };
    this.storageService.addDataToEncryptLocal(data, DATABASE_KEY.encryptUserLogin);
  }

  // For Clear Token on Browser Storage..
  protected clearUserData() {
    this.storageService.removeDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
  }

  // Get User Data from Browser Storage..
  protected getUserData() {
    return this.storageService.getDataFromEncryptLocal(DATABASE_KEY.encryptUserLogin);
  }

  // For Set Time Duration in ms..
  private setSessionTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.userLogOut();
    }, duration * 1000); // 1s = 1000ms
    // console.log('Setting Time: ' + duration);
  }


}
