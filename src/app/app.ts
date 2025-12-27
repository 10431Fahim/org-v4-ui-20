import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/components/header/header.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {CsrfTokenService} from './services/core/csrf-token.service';
import {UserService} from './services/common/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('bnp-bd');
  @ViewChild('scroll') scroll!: ElementRef;
  constructor(
    private userService: UserService,
    private csrf: CsrfTokenService
  ) {
    this.userService.autoUserLoggedIn();
  }

  async ngOnInit() {
    try {
      await this.csrf.loadToken();
      // console.log('✅ CSRF token loaded');
    } catch (error) {
      // console.error('❌ Failed to load CSRF token', error);
    }
  }

  /**
   * scrollTop();
   */
  scrollTop() {
    window.scrollTo(0, 0);
  }

  onHelpClick = () => {
    // আপনার কাস্টম লজিক
    alert('Help clicked!');
  };


  // @HostListener('window:scroll')
  // hideShowScrollBtn() {
  //   if (window.scrollY > 400) {
  //     this.scroll.nativeElement.style.display = 'flex';
  //   } else {
  //     this.scroll.nativeElement.style.display = 'none';
  //   }
  // }
}
