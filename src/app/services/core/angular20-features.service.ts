import { Injectable, signal, computed, effect, DestroyRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  profileImg?: string;
  memberShipType: string;
  paymentStatus: string;
  resident: string;
  countryPermanent: string;
  cityPermanent: string;
  memberType: string;
  zipPermanent: string;
  countryCode: string;
  phone: string;
  amount: number;
  memberId: string;
  whatsAppNumber: string;
  qualification: string;
  occupation: string;
  designation: string;
  address: string;
  country: string;
  city: string;
  zip: string;
  recommender1Name: string;
  recommender1Mobile: string;
  recommender2Mobile: string;
  agree: boolean;
  spouse: string;
  age: number;
  mothersName: string;
  recommender2Designation: string;
  recommender2Name: string;
  recommender1Designation: string;
  permanentAddress: string;
  nationalId: string;
  facebookId: string;
  organizationName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class Angular20FeaturesService {
  // Angular 20 Dependency Injection
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // Signals for reactive state management
  private _userProfile = signal<UserProfile | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _lastUpdated = signal<Date | null>(null);

  // Computed signals for derived state
  userProfile = computed(() => this._userProfile());
  loading = computed(() => this._loading());
  error = computed(() => this._error());
  lastUpdated = computed(() => this._lastUpdated());
  
  // Computed signals for user properties
  isPrimaryMember = computed(() => this._userProfile()?.memberShipType === 'primary-member-fee');
  isNotPrimaryMember = computed(() => this._userProfile()?.memberShipType !== 'primary-member-fee');
  hasProfileImage = computed(() => !!this._userProfile()?.profileImg);
  userDisplayName = computed(() => this._userProfile()?.name || '');
  userDisplayPhone = computed(() => 
    this._userProfile()?.phoneNo || this._userProfile()?.phone || ''
  );
  
  // Computed signals for validation
  isProfileComplete = computed(() => {
    const profile = this._userProfile();
    return !!(
      profile?.name &&
      profile?.email &&
      profile?.phoneNo &&
      profile?.qualification &&
      profile?.occupation &&
      profile?.age &&
      profile?.address
    );
  });

  // Effects for side effects management
  constructor() {
    // Effect to log profile changes
    effect(() => {
      const profile = this._userProfile();
      if (profile) {
        console.log('User profile updated:', profile.name);
        this._lastUpdated.set(new Date());
      }
    });

    // Effect to clear error when loading starts
    effect(() => {
      if (this._loading()) {
        this._error.set(null);
      }
    });
  }

  // Methods using signals
  getUserProfile(select?: string): Observable<UserProfile> {
    this._loading.set(true);
    
    const selectFields = select || 'username email memberShipType paymentStatus resident countryPermanent cityPermanent memberType zipPermanent phoneNo countryCode phone amount name profileImg memberId whatsAppNumber qualification occupation designation address country city zip recommender1Name memberShipType recommender1Mobile recommender2Mobile agree spouse age mothersName recommender2Designation recommender2Name recommender1Designation permanentAddress nationalId facebookId organizationName';
    
    return this.http.get<ApiResponse<{ user: UserProfile }>>(`/api/user/profile?select=${selectFields}`)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(response => response.data.user),
        tap(user => {
          this._userProfile.set(user);
          this._loading.set(false);
        }),
        catchError(error => {
          this._error.set(error.message || 'Failed to load user profile');
          this._loading.set(false);
          return of(null as any);
        })
      );
  }

  updateUserProfile(data: Partial<UserProfile>): Observable<ApiResponse<any>> {
    this._loading.set(true);
    
    return this.http.put<ApiResponse<any>>('/api/user/profile', data)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(response => {
          if (response.success) {
            // Update the profile with new data
            const currentProfile = this._userProfile();
            if (currentProfile) {
              this._userProfile.set({ ...currentProfile, ...data });
            }
          }
          this._loading.set(false);
        }),
        catchError(error => {
          this._error.set(error.message || 'Failed to update user profile');
          this._loading.set(false);
          return of({ success: false, data: null, message: error.message });
        })
      );
  }

  uploadProfileImage(fileData: { fileName: string; file: Blob; folderPath: string }): Observable<ApiResponse<{ url: string }>> {
    this._loading.set(true);
    
    const formData = new FormData();
    formData.append('file', fileData.file, fileData.fileName);
    formData.append('folderPath', fileData.folderPath);
    
    return this.http.post<ApiResponse<{ url: string }>>('/api/upload/image', formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(response => {
          if (response.success) {
            // Update profile image URL
            const currentProfile = this._userProfile();
            if (currentProfile) {
              this._userProfile.set({ ...currentProfile, profileImg: response.data.url });
            }
          }
          this._loading.set(false);
        }),
        catchError(error => {
          this._error.set(error.message || 'Failed to upload image');
          this._loading.set(false);
          return of({ success: false, data: { url: '' }, message: error.message });
        })
      );
  }

  removeProfileImage(imageUrl: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`/api/upload/image?url=${encodeURIComponent(imageUrl)}`)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(response => {
          if (response.success) {
            // Remove profile image URL
            const currentProfile = this._userProfile();
            if (currentProfile) {
              this._userProfile.set({ ...currentProfile, profileImg: undefined });
            }
          }
        }),
        catchError(error => {
          this._error.set(error.message || 'Failed to remove image');
          return of({ success: false, data: null, message: error.message });
        })
      );
  }

  // Signal-based methods for state management
  setUserProfile(profile: UserProfile): void {
    this._userProfile.set(profile);
  }

  updateUserField<K extends keyof UserProfile>(field: K, value: UserProfile[K]): void {
    const currentProfile = this._userProfile();
    if (currentProfile) {
      this._userProfile.set({ ...currentProfile, [field]: value });
    }
  }

  clearError(): void {
    this._error.set(null);
  }

  resetState(): void {
    this._userProfile.set(null);
    this._loading.set(false);
    this._error.set(null);
    this._lastUpdated.set(null);
  }

  // RxJS integration with signals
  getProfileUpdates(): Observable<UserProfile | null> {
    return new BehaviorSubject(this._userProfile()).asObservable();
  }

  // Utility methods using computed signals
  getProfileCompleteness(): number {
    const profile = this._userProfile();
    if (!profile) return 0;
    
    const requiredFields = ['name', 'email', 'phoneNo', 'qualification', 'occupation', 'age', 'address'];
    const completedFields = requiredFields.filter(field => !!profile[field as keyof UserProfile]);
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  }

  canDownloadForm(): boolean {
    return this.isProfileComplete() && !this._loading();
  }

  getFormType(): 'primary' | 'monthly' | 'unknown' {
    const profile = this._userProfile();
    if (!profile) return 'unknown';
    
    switch (profile.memberShipType) {
      case 'primary-member-fee':
        return 'primary';
      case 'membership-fee':
        return 'monthly';
      default:
        return 'unknown';
    }
  }
}