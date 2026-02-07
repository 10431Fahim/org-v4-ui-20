import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay } from 'rxjs';

export type VoteBnpDivision = {
  id: number;
  name: string;
  bn_name: string;
};

export type VoteBnpDistrict = {
  id: number;
  division_id: number;
  name: string;
  bn_name: string;
};

export type VoteBnpCandidateSummary = {
  id: number;
  fullNameEn: string;
  fullNameBn: string;
  photoUrl: string;
  designation: string;
  slug: string;
  districtBn: string;
  divisionBn: string;
  constituencyNo: number;

  // Local-only helpers (enriched while generating local JSON)
  districtName?: string;
  districtId?: number;
  divisionId?: number;
};

export type VoteBnpCandidateProfile = {
  id: number;
  fullNameEn: string;
  fullNameBn: string;
  slug: string;
  divisionId: number;
  districtId: number;
  constituencyNo: number;
  photoUrl: string;
  designation: string;
  briefIntro?: string;
  introBn?: string;
  politicalJourney?: string;
  politicalJourneyBn?: string;
  personalProfile?: string;
  personalProfileBn?: string;
  vision?: string;
  visionBn?: string;
  facebookLink?: string;
  responsiblePerson?: string;
  email?: string;
  districtBn?: string;
  districtEn?: string;
  divisionBn?: string;
  divisionEn?: string;
  team?: any[];
  gallery?: any[];
};

@Injectable({ providedIn: 'root' })
export class VoteBnpApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://api.vote-bnp.com/api';
  private readonly localBaseUrl = '/data/vote-bnp';

  private readonly localDivisions$ = this.http
    .get<VoteBnpDivision[]>(`${this.localBaseUrl}/divisions.json`)
    .pipe(shareReplay(1));

  private readonly localDistricts$ = this.http
    .get<VoteBnpDistrict[]>(`${this.localBaseUrl}/districts.json`)
    .pipe(shareReplay(1));

  private readonly localCandidates$ = this.http
    .get<VoteBnpCandidateSummary[]>(`${this.localBaseUrl}/candidates.json`)
    .pipe(shareReplay(1));

  private readonly localProfiles$ = this.http
    .get<Record<string, VoteBnpCandidateProfile>>(`${this.localBaseUrl}/candidate-profiles.json`)
    .pipe(shareReplay(1));

  getDivisions(): Observable<VoteBnpDivision[]> {
    return this.localDivisions$;
  }

  getDistricts(divisionId: number): Observable<VoteBnpDistrict[]> {
    return this.localDistricts$.pipe(
      map(all => all.filter(d => d.division_id === divisionId))
    );
  }

  getCandidatesByDistrictName(districtName: string): Observable<VoteBnpCandidateSummary[]> {
    const norm = (districtName || '').trim().toLowerCase();

    return this.localCandidates$.pipe(
      map((all: VoteBnpCandidateSummary[]) => {
        const filtered = all.filter((c: VoteBnpCandidateSummary) => (c.districtName || '').trim().toLowerCase() === norm);
        // keep a stable order in UI (seat number)
        filtered.sort((a: VoteBnpCandidateSummary, b: VoteBnpCandidateSummary) => (a.constituencyNo ?? 0) - (b.constituencyNo ?? 0));
        return filtered;
      })
    );
  }

  getCandidateProfile(slug: string): Observable<VoteBnpCandidateProfile> {
    return this.localProfiles$.pipe(
      map(profiles => {
        const profile = profiles[slug];
        if (!profile) {
          throw new Error('Profile not found');
        }
        return profile;
      })
    );
  }

  toBengaliNumber(input: number | string | null | undefined): string {
    if (input === null || input === undefined) return '';
    const map = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return input.toString().replace(/\d/g, d => map[Number(d)] ?? d);
  }
}

