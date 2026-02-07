import {CommonModule} from '@angular/common';
import {Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  VoteBnpApiService,
  VoteBnpCandidateSummary,
  VoteBnpDistrict,
  VoteBnpDivision
} from '../../services/common/vote-bnp-api.service';

type ViewStep = 'division' | 'district' | 'candidates';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent {
  private readonly api = inject(VoteBnpApiService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly lang = signal<string>(this.translate.currentLang || 'en');

  // Step state
  step = signal<ViewStep>('division');
  selectedDivision = signal<VoteBnpDivision | null>(null);
  selectedDistrict = signal<VoteBnpDistrict | null>(null);

  // Search (district list)
  districtSearch = signal<string>('');

  isLanguageBengali = computed(() => this.lang() === 'bn');

  loadingDivisions = signal<boolean>(true);
  loadingDistricts = signal<boolean>(false);
  loadingCandidates = signal<boolean>(false);
  error = signal<string | null>(null);

  divisions = signal<VoteBnpDivision[]>([]);
  districts = signal<VoteBnpDistrict[]>([]);
  candidates = signal<VoteBnpCandidateSummary[]>([]);

  filteredDistricts = computed(() => {
    const list = this.districts();
    const q = this.districtSearch().trim().toLowerCase();
    if (!q) return list;
    return list.filter(d =>
      d.name.toLowerCase().includes(q) || d.bn_name.toLowerCase().includes(q)
    );
  });

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => {
        this.lang.set(e.lang || 'en');
      });

    // Load divisions and apply query params selection if any
    this.loadDivisions();

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(q => {
        const divisionId = Number(q.get('divisionId') || '');
        const districtId = Number(q.get('districtId') || '');
        const districtName = q.get('districtName') || '';
        const districtBnName = q.get('districtBnName') || '';

        if (divisionId && this.divisions().length) {
          const div = this.divisions().find(d => d.id === divisionId) || null;
          if (div && this.selectedDivision()?.id !== div.id) {
            this.selectedDivision.set(div);
            this.loadDistricts(div.id, { selectDistrictId: districtId, selectDistrictName: districtName });
            this.step.set('district');
          }
        }

        // If districtName is present, go directly to candidates step
        if (districtName) {
          // Support shareable URL like vote-bnp.com (even without divisionId)
          if (!divisionId) {
            this.selectedDivision.set(null);
            this.selectedDistrict.set({
              id: districtId || 0,
              division_id: 0,
              name: districtName,
              bn_name: districtBnName || districtName
            });
            this.step.set('candidates');
            this.loadCandidates(districtName);
            return;
          }

          if (this.selectedDistrict() && this.selectedDistrict()!.name === districtName) {
            this.step.set('candidates');
          } else if (districtId && this.districts().length) {
            const dist = this.districts().find(d => d.id === districtId) || null;
            if (dist) {
              this.selectedDistrict.set(dist);
              this.step.set('candidates');
              this.loadCandidates(dist.name);
            }
          }
        }
      });
  }

  onSelectDivision(div: VoteBnpDivision): void {
    this.selectedDivision.set(div);
    this.selectedDistrict.set(null);
    this.districtSearch.set('');
    this.candidates.set([]);
    this.error.set(null);
    this.step.set('district');
    this.loadDistricts(div.id);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        divisionId: div.id,
        divisionName: div.bn_name,
        candidateSlug: null,
        districtId: null,
        districtName: null,
        districtBnName: null
      }
    });
  }

  onSelectDistrict(dist: VoteBnpDistrict): void {
    this.selectedDistrict.set(dist);
    this.step.set('candidates');
    this.error.set(null);
    this.loadCandidates(dist.name);

    const div = this.selectedDivision();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        divisionId: div?.id ?? null,
        divisionName: div?.bn_name ?? null,
        candidateSlug: null,
        districtId: dist.id,
        districtName: dist.name,
        districtBnName: dist.bn_name
      }
    });
  }

  goBack(): void {
    const s = this.step();
    if (s === 'candidates') {
      const hasDivision = !!this.selectedDivision();
      this.step.set(hasDivision ? 'district' : 'division');
      this.selectedDistrict.set(null);
      this.candidates.set([]);
      if (!hasDivision) {
        this.districtSearch.set('');
        this.districts.set([]);
        this.selectedDivision.set(null);
      }

      // Keep URL in sync (remove district + candidate selection)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams: {
          ...(hasDivision ? {} : { divisionId: null, divisionName: null }),
          candidateSlug: null,
          districtId: null,
          districtName: null,
          districtBnName: null
        }
      });
      return;
    }
    if (s === 'district') {
      this.step.set('division');
      this.selectedDivision.set(null);
      this.selectedDistrict.set(null);
      this.districtSearch.set('');
      this.districts.set([]);
      this.candidates.set([]);

      // Keep URL in sync (remove division + district + candidate selection)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams: {
          divisionId: null,
          divisionName: null,
          candidateSlug: null,
          districtId: null,
          districtName: null,
          districtBnName: null
        }
      });
    }
  }

  resetAll(): void {
    this.step.set('division');
    this.selectedDivision.set(null);
    this.selectedDistrict.set(null);
    this.districtSearch.set('');
    this.districts.set([]);
    this.candidates.set([]);
    this.error.set(null);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        divisionId: null,
        divisionName: null,
        candidateSlug: null,
        districtId: null,
        districtName: null,
        districtBnName: null
      }
    });
  }

  constituencyLabel(candidate: VoteBnpCandidateSummary): string {
    const district = this.isLanguageBengali()
      ? (this.selectedDistrict()?.bn_name || candidate.districtBn || '')
      : (this.selectedDistrict()?.name || '');
    const n = this.isLanguageBengali()
      ? this.api.toBengaliNumber(candidate.constituencyNo)
      : String(candidate.constituencyNo);
    return district ? `${district}-${n}` : `-${n}`;
  }

  private loadDivisions(): void {
    this.loadingDivisions.set(true);
    this.error.set(null);
    this.api.getDivisions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: divisions => {
          this.divisions.set(divisions);
          this.loadingDivisions.set(false);

          // If URL already has a divisionId, apply it now
          const divisionId = Number(this.route.snapshot.queryParamMap.get('divisionId') || '');
          if (divisionId) {
            const div = divisions.find(d => d.id === divisionId) || null;
            if (div) {
              this.selectedDivision.set(div);
              this.step.set('district');
              const districtId = Number(this.route.snapshot.queryParamMap.get('districtId') || '');
              const districtName = this.route.snapshot.queryParamMap.get('districtName') || '';
              this.loadDistricts(div.id, { selectDistrictId: districtId, selectDistrictName: districtName });
            }
          }
        },
        error: () => {
          this.loadingDivisions.set(false);
          this.error.set('Failed to load divisions');
        }
      });
  }

  private loadDistricts(divisionId: number, opts?: { selectDistrictId?: number; selectDistrictName?: string }): void {
    this.loadingDistricts.set(true);
    this.error.set(null);
    this.districts.set([]);
    this.api.getDistricts(divisionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: districts => {
          this.districts.set(districts);
          this.loadingDistricts.set(false);

          const districtId = opts?.selectDistrictId || 0;
          const districtName = (opts?.selectDistrictName || '').trim();

          const match =
            (districtId ? districts.find(d => d.id === districtId) : null) ||
            (districtName ? districts.find(d => d.name === districtName) : null) ||
            null;

          if (match && districtName) {
            this.selectedDistrict.set(match);
            this.step.set('candidates');
            this.loadCandidates(match.name);
          }
        },
        error: () => {
          this.loadingDistricts.set(false);
          this.error.set('Failed to load districts');
        }
      });
  }

  private loadCandidates(districtName: string): void {
    if (!districtName) return;
    this.loadingCandidates.set(true);
    this.error.set(null);
    this.candidates.set([]);
    this.api.getCandidatesByDistrictName(districtName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: candidates => {
          this.candidates.set(candidates || []);
          this.loadingCandidates.set(false);
        },
        error: () => {
          this.loadingCandidates.set(false);
          this.error.set('Failed to load candidates');
        }
      });
  }
}

