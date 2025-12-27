import {Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AdditionalPageService} from "../../../services/core/additional-page.service";
import {TranslateService} from "@ngx-translate/core";
import {SafeHtmlCustomPipe} from '../../../shared/pipes/safe-html.pipe';
import {NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  imports: [
    SafeHtmlCustomPipe
  ],
  standalone:true,
  styleUrls: ['./declaration.component.scss'],

})
export class DeclarationComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  slug = signal<any>(null);
  pageInfo = signal<any>(null);
  msg = signal<any>('');
  msgEn = signal<any>('');
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');

  // Computed signals for derived state
  hasPageInfo = computed(() => !!this.pageInfo());
  showComingSoon = computed(() => !this.hasPageInfo() && this.msg().includes('Coming Soon'));
  isLanguageBengali = computed(() => this.translateService.currentLang === 'bn');

  // Subscriptions
  private subRouteOne!: Subscription;
  private subDataOne!: Subscription;

  // Services injected using inject() function for Angular 20
  private activatedRoute = inject(ActivatedRoute);
  private additionalPageService = inject(AdditionalPageService);
  public translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Check if slug is not set initially
    if (!this.slug()) {
      this.additionalPageService.getAdditionalPageBySlug('declaration')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res => {
            this.pageInfo.set(res.data);
            if (!res.data) {
              this.msg.set('<h2>Coming Soon!</h2>');
            }
          }),
          error: (error => {
            console.error('Error fetching declaration page:', error);
          })
        });
    }

    // Subscribe to route parameters
    this.activatedRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(param => {
      this.slug.set(param.get('pageSlug'));
      this.getPageInfo();
    });
  }

  /**
   * HTTP REQ HANDLE
   * getPageInfo()
   */

  private getPageInfo(): void {
    this.additionalPageService.getAdditionalPageBySlug(this.slug())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res => {
          this.pageInfo.set(res.data);
          if (!res.data) {
            this.msg.set('<h2>Coming Soon!</h2>');
          }
        }),
        error: (error => {
          console.error('Error fetching page info:', error);
        })
      });
  }

  ngOnDestroy(): void {
    // Subscriptions are automatically cleaned up by takeUntilDestroyed
    // No need to manually unsubscribe
  }

  onChangeLanguage(language: string): void {
    this.isChangeLanguage.set(language === 'en');
    this.translateService.use(language);
  }

  onChangeLanguageToggle(language: string): void {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(this.isChangeLanguageToggle());
    } else {
      this.isChangeLanguageToggle.set('bn');
      this.isChangeLanguage.set(false);
      this.translateService.use(this.isChangeLanguageToggle());
    }
  }

}

