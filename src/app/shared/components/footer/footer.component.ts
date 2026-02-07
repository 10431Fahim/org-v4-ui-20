import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { EngBnNumPipe } from '../../pipes/eng-bn-num.pipe';
import { ReloadService } from '../../../services/core/reload.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    RouterLink,
    NgIf,
    EngBnNumPipe,
    TranslatePipe
  ],
  standalone: true,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  // Inject services
  public readonly translateService = inject(TranslateService);
  private readonly reloadService = inject(ReloadService);
  private readonly destroyRef = inject(DestroyRef);

  currentYear: number;
  language = signal<string>(this.translateService.currentLang || 'bn');
  isChangeLanguage = signal(false);
  isChangeLanguageToggle = signal('en');

  isLanguageBengali = computed(() => this.language() === 'bn');

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    // Subscribe to reload service for language changes
    this.reloadService.refreshLang$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang: string) => {
        if (lang) {
          this.language.set(lang);
        }
      });
  }

}
