import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {UserService} from '../../../services/common/user.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ReloadService} from '../../../services/core/reload.service';
import {User} from '../../../interfaces/common/user.interface';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule, NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    NgIf
  ],
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Angular 20: Using inject() function instead of constructor injection
  private readonly userService = inject(UserService);
  public readonly translateService = inject(TranslateService); // Made public for template access
  private readonly reloadService = inject(ReloadService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // ViewChild references
  @ViewChild('services') services!: ElementRef;
  @ViewChild('why') whyUs!: ElementRef;

  // Angular 20 Signals for reactive state management
  headerFixed = signal<boolean>(false);
  user = signal<User | null>(null);
  sideNav = signal<boolean>(true);
  isUser = signal<boolean>(false);
  userMenu = signal<boolean>(false);
  closeBtn = signal<boolean>(true);

  // Sub menu states
  openSubSubMenu1 = signal<boolean>(false);
  openSubSubMenu2 = signal<boolean>(false);
  openSubSubMenu3 = signal<boolean>(false);
  openSubSubMenu4 = signal<boolean>(false);
  openSubSubMenu5 = signal<boolean>(false);

  // Language states
  isChangeLanguage = signal<boolean>(false);
  isChangeLanguageToggle = signal<string>('en');
  currentLang = signal<string>('en'); // Local signal for reactive language tracking

  // Payment dropdown state (mobile)
  paymentDropdownOpen = signal<boolean>(false);

  // UI states
  slide = signal<boolean>(false);
  searchBar = signal<boolean>(false);
  searchQuery = signal<string | null>(null);
  subMenu = signal<number>(0);

  // Search area states
  overlay = signal<boolean>(false);
  isOpen = signal<boolean>(false);
  isFocused = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSelect = signal<boolean>(false);
  query = signal<string | null>(null);

  // Computed signals for derived state
  currentLanguage = computed(() => this.currentLang());
  isLanguageBengali = computed(() => this.currentLang() === 'bn');
  isLanguageEnglish = computed(() => this.currentLang() === 'en');

  // User profile computed signals
  userProfileImage = computed(() => {
    const user = this.user();
    return user?.profileImg || '/svg/user.svg';
  });

  // Menu state computed signals
  isAnySubMenuOpen = computed(() =>
    this.openSubSubMenu1() ||
    this.openSubSubMenu2() ||
    this.openSubSubMenu3() ||
    this.openSubSubMenu4() ||
    this.openSubSubMenu5()
  );

  // Effects for side effects
  constructor() {
    // Effect for language changes from reload service
    effect(() => {
      // This will be handled in ngOnInit with subscription
    });

    // Effect for user status changes
    effect(() => {
      const userStatus = this.isUser();
    });
  }

  ngOnInit(): void {
    // Initialize language from translateService
    this.currentLang.set(this.translateService.currentLang || 'en');

    // Subscribe to reload service for language changes
    (this.reloadService as any).refreshLang$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: string) => {
        if (res === 'bn') {
          this.isChangeLanguageToggle.set('bn');
          this.isChangeLanguage.set(true);
          this.currentLang.set('bn');
        } else {
          this.currentLang.set('en');
        }
      });

    // Subscribe to query parameters
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        const language = qParam.get('language');
        if (language === 'bn') {
          this.onChangeLanguage('bn');
        } else if (language === 'en') {
          this.onChangeLanguage('en');
        }
      });

    // Subscribe to user status changes
    (this.userService as any).userStatusListener
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isUser.set((this.userService as any).getUserStatus());
      });

    // Set initial user status
    this.isUser.set((this.userService as any).getUserStatus());
  }

  public getRibbonText(): string {
    return this.currentLang() === 'bn' ? 'আমরা<br>গভীরভাবে<br>শোকাহত' : 'We Are<br>Deeply Mourning';
  }
  

  @HostListener('window:scroll')
  headerFixedControl(): void {
    this.headerFixed.set(window.scrollY > 300);
  }

  onChangeLanguage(language: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.currentLang.set(language); // Update local signal first for immediate reactivity
    this.router.navigate([], { queryParams: { language: language } });
    this.isChangeLanguage.set(language === 'bn');
    this.translateService.use(language);
    (this.reloadService as any).needRefreshLang$(language);
  }

  onChangeLanguageToggle(language: string): void {
    if (this.isChangeLanguageToggle() !== language) {
      this.isChangeLanguageToggle.set(language);
      this.isChangeLanguage.set(true);
      this.translateService.use(language);
    } else {
      this.isChangeLanguageToggle.set('en');
      this.isChangeLanguage.set(false);
      this.translateService.use('en');
    }
  }

  /**
   * User Profile Methods
   */
  ownUserProfile(): void {
    this.userMenu.update(current => !current);
  }

  ownCloseBtn(): void {
    this.userMenu.set(false);
  }

  onLogout(): void {
    (this.userService as any).userLogOut();
  }

  /**
   * Scroll Methods
   */
  servicesScroll(): void {
    this.services.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  whyUsScroll(): void {
    this.whyUs.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * UI Control Methods
   */
  slideToggle(): void {
    this.slide.update(current => !current);
  }

  slideClose(): void {
    this.slide.set(false);
  }

  handleCloseAndClear(): void {
    if (!this.isOpen()) {
      this.isFocused.set(false);
      return;
    }
    this.isOpen.set(false);
    this.overlay.set(false);
    this.isFocused.set(false);
  }

  /**
   * Sub Menu Control Methods
   */
  onClickOpenSubSubMenu1(): void {
    this.openSubSubMenu1.update(current => !current);
    this.closeOtherSubMenus(1);
  }

  onClickOpenSubSubMenu2(): void {
    this.openSubSubMenu2.update(current => !current);
    this.closeOtherSubMenus(2);
  }

  onClickOpenSubSubMenu3(): void {
    this.openSubSubMenu3.update(current => !current);
    this.closeOtherSubMenus(3);
  }

  onClickOpenSubSubMenu4(): void {
    this.openSubSubMenu4.update(current => !current);
    this.closeOtherSubMenus(4);
  }

  onClickOpenSubSubMenu5(): void {
    this.openSubSubMenu5.update(current => !current);
    this.closeOtherSubMenus(5);
  }

  private closeOtherSubMenus(except: number): void {
    if (except !== 1) this.openSubSubMenu1.set(false);
    if (except !== 2) this.openSubSubMenu2.set(false);
    if (except !== 3) this.openSubSubMenu3.set(false);
    if (except !== 4) this.openSubSubMenu4.set(false);
    if (except !== 5) this.openSubSubMenu5.set(false);
  }

  onSubMenuControll(index: number): void {
    if (index && this.subMenu() !== index) {
      this.subMenu.set(index);
    } else {
      this.subMenu.set(0);
    }
  }

  /**
   * Payment Dropdown Control Methods
   */
  togglePaymentDropdown(): void {
    this.paymentDropdownOpen.update(current => !current);
  }

  closePaymentDropdown(): void {
    this.paymentDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Check if click is outside the payment dropdown (only for mobile, in logo section)
    const paymentDropdown = target.closest('.logo .dropdown');
    if (this.paymentDropdownOpen() && !paymentDropdown) {
      this.paymentDropdownOpen.set(false);
    }
  }

  ngOnDestroy(): void {
    // All subscriptions are automatically cleaned up with takeUntilDestroyed
  }
}
