import {CommonModule} from '@angular/common';
import {Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {VoteBnpApiService, VoteBnpCandidateProfile} from '../../services/common/vote-bnp-api.service';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent {
  private readonly api = inject(VoteBnpApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly lang = signal<string>(this.translate.currentLang || 'en');

  slug = signal<string>('');
  profile = signal<VoteBnpCandidateProfile | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  isLanguageBengali = computed(() => this.lang() === 'bn');

  seatLabel = computed(() => {
    const p = this.profile();
    if (!p) return '';
    const district = this.isLanguageBengali() ? (p.districtBn || '') : (p.districtEn || '');
    const n = this.isLanguageBengali()
      ? this.api.toBengaliNumber(p.constituencyNo)
      : String(p.constituencyNo);
    return district ? `${district}-${n}` : `-${n}`;
  });

  constructor() {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(e => this.lang.set(e.lang || 'en'));

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(pm => {
        const slug = pm.get('slug') || '';
        this.slug.set(slug);
        this.fetchProfile(slug);
      });
  }

  private fetchProfile(slug: string): void {
    if (!slug) {
      this.profile.set(null);
      this.loading.set(false);
      this.error.set('Missing slug');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.api.getCandidateProfile(slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.profile.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.profile.set(null);
          this.loading.set(false);
          this.error.set('Failed to load profile');
        }
      });
  }
}

