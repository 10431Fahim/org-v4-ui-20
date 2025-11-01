import {Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, effect, DestroyRef, inject} from '@angular/core';
import {map, Observable, shareReplay, Subscription} from "rxjs";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UserDataService} from "../../../services/common/user-data.service";
import {UserService} from "../../../services/common/user.service";
import {ReloadService} from "../../../services/core/reload.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {UiService} from "../../../services/core/ui.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {FileData} from "../../../interfaces/gallery/file-data";
import {ImageCropComponent} from "./image-crop/image-crop.component";
import {ContactService} from "../../../services/common/contact.service";
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit, OnDestroy {
  // Angular 20 Signals for reactive state management
  user = signal<any>(null);
  language = signal<string>('en');
  memberType = signal<string>('membership-fee');
  isLoading = signal<boolean>(false);

  // Image Upload Signals
  imageChangedEvent = signal<any>(null);
  imgPlaceHolder = signal<string>('/svg/user.svg');
  pickedImage = signal<any>(null);
  file = signal<any>(null);
  newFileName = signal<string | null>(null);
  imgBlob = signal<any>(null);

  // Computed signals for derived state
  isPrimaryMember = computed(() => this.user()?.memberShipType === 'primary-member-fee');
  isNotPrimaryMember = computed(() => this.user()?.memberShipType !== 'primary-member-fee');
  userDisplayName = computed(() => this.user()?.name || '');
  userDisplayPhone = computed(() => this.user()?.phoneNo || this.user()?.username || '');
  isImageLoading = computed(() => this.isLoading());

  // BREAKPOINTS
  isHandset$!: Observable<boolean>;

  // Angular 20 Dependency Injection
  private destroyRef = inject(DestroyRef);

  // Subscriptions (keeping for backward compatibility, will migrate to signals)
  private subReloadOne!: Subscription;
  private subDataOne!: Subscription;
  private subDataTwo!: Subscription;
  private subDataThree!: Subscription;
  private subDataFour!: Subscription;


  constructor(
    protected userDataService: UserDataService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private router: Router,
    private fileUploadService: FileUploadService,
    private uiService: UiService,
    private breakpointObserver: BreakpointObserver,
    private contactService: ContactService
  ) {
    // Initialize breakpoint observer
    this.isHandset$ = this.breakpointObserver.observe(['(max-width: 599px)'])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    // Angular 20 Effects for side effects management
    effect(() => {
      const user = this.user();
      if (user?.profileImg) {
        this.imgPlaceHolder.set(user.profileImg);
      }
    });
  }

  ngOnInit(): void {
    // Query parameters handling with signals
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(qParam => {
        const language = qParam.get('language') || 'en';
        const memberType = qParam.get('type') || 'membership-fee';
        this.language.set(language);
        this.memberType.set(memberType);
      });

    // Get logged in user with modern subscription handling
    this.subReloadOne = this.reloadService.refreshData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getLoggedInUserInfo();
      });

    this.getLoggedInUserInfo();
  }

  /**
   * HTTP REQ HANDLE
   * getLoggedInUserInfo()
   * updateLoggedInUserInfo()
   * imageUploadOnServer()
   * removeOldImageFromServer()
   */
  private getLoggedInUserInfo() {
    const select = 'username email memberShipType paymentStatus resident countryPermanent cityPermanent memberType zipPermanent phoneNo countryCode phone amount name profileImg memberId whatsAppNumber qualification occupation designation address country city zip recommender1Name memberShipType recommender1Mobile recommender2Mobile agree spouse age mothersName recommender2Designation recommender2Name recommender1Designation permanentAddress nationalId facebookId organizationName';
    this.subDataOne = this.userDataService.getLoggedInUserData(select)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.user.set(res.data?.user);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  updateLoggedInUserInfo(data: any) {
    this.subDataTwo = this.userDataService.updateLoggedInUserInfo(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  private imageUploadOnServer() {
    const fileName = this.newFileName();
    const imgBlob = this.imgBlob();

    if (!fileName || !imgBlob) {
      console.error('Missing file data for upload');
      return;
    }

    const data: FileData = {
      fileName,
      file: imgBlob,
      folderPath: 'admins'
    };
    this.subDataThree = this.fileUploadService.uploadSingleImage(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.removeImageFiles();
          const currentUser = this.user();
          if (currentUser?.profileImg) {
            this.removeOldImageFromServer(currentUser.profileImg);
          }
          this.updateLoggedInUserInfo({ profileImg: res.url });
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  private removeOldImageFromServer(imgUrl: string) {
    this.subDataFour = this.fileUploadService.removeSingleFile(imgUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          // Image removed successfully
        },
        error: (error) => {
          console.log(error);
        }
      });
  }


  /**
   * ON IMAGE PICK
   * fileChangeEvent()
   * removeImageFiles()
   */
  fileChangeEvent(event: any) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.file.set(file);

    // File Name Modify...
    const originalNameWithoutExt = file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = file.name.split('.').pop();
    // Generate new File Name..
    const newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;
    this.newFileName.set(newFileName);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.imgPlaceHolder.set(reader.result as string);
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      this.openComponentDialog(event);
    }

    // NGX Image Cropper Event..
    this.imageChangedEvent.set(event);
  }

  private removeImageFiles() {
    this.file.set(null);
    this.newFileName.set(null);
    this.pickedImage.set(null);
    this.imgBlob.set(null);
  }
  /**
   * Dialog View
   * openDialog()
   */
  openDialog() {
    this.router.navigate([], { queryParams: { dialogOpen: true }, queryParamsHandling: 'merge' });

  }

  /**
   * OPEN COMPONENT DIALOG
   * openComponentDialog()
   */
  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ImageCropComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true,
      width: '680px',
      minHeight: '400px',
      maxHeight: '600px'
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(dialogResult => {
        if (dialogResult) {
          if (dialogResult.imgBlob) {
            this.imgBlob.set(dialogResult.imgBlob);
          }
          if (dialogResult.croppedImage) {
            this.pickedImage.set(dialogResult.croppedImage);
            this.imgPlaceHolder.set(dialogResult.croppedImage);

            if (dialogResult.croppedImage) {
              this.imageUploadOnServer();
            }
          }
        }
      });
  }

  onLogout() {
    this.userService.userLogOut();

  }

  onLinkChange() {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        const element:any = document.getElementById('main-sidebar-container-area');
        setTimeout(() => {
          window.scrollTo({
            left: 0,
            top: element.scrollHeight,
            behavior: 'smooth'
          });
        }, 150);
      }
    });
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }

    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }

    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
  }


  downloadForm(): void {
    // Build HTML content based on sodosso-form design and registration form data
    const formData = this.user();
    let htmlContent : any;
    this.isLoading.set(true);

    if(this.isPrimaryMember()){
      if(this.language() === 'bn'){
        htmlContent = `
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 140px;" src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px;  line-height: 18px; text-align: center;margin-bottom: 0!important;">বিসমিল্লাহির রহমানির রহিম</h1>
    <h2 style="font-size: 30px;text-align: center; line-height: 20px">বাংলাদেশ জাতীয়তাবাদী দল</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -30px">
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0">কেন্দ্রীয় কার্যালয়</h3>
<!--       <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px;color: #ff5292;">(${formData?.memberType ==='New Member'? 'নতুন প্রাথমিক সদস্য নবায়ন ফরম' : 'প্রাথমিক সদস্য নবায়ন ফরম'})</h3>-->

    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px;color: #ff5292;">(${formData?.memberType ==='New Member'? 'নতুন প্রাথমিক সদস্য /প্রাথমিক সদস্য নবায়ন নবায়ন ফরম' : 'নতুন প্রাথমিক সদস্য /প্রাথমিক সদস্য নবায়ন নবায়ন ফরম'})</h3>
     <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px; color: #ff5292;">সদস্য আইডি ${formData?.memberId}</h3>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span>নাম:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.name} </span>
  </div>

  <div style="display: grid;grid-template-columns: 100%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">শিক্ষাগত যোগ্যতা:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">পেশা:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.occupation}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">বয়স:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.age}</span>
    </div>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">বাসিন্দার অবস্থান:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.resident}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">ফোন/মোবাইল নাম্বার:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryCode}${formData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">ইমেইল:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.email}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">হোয়াটসঅ্যাপ নাম্বার:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.whatsAppNumber}</span>
    </div>
  </div>

<!--  <div style="display: grid;grid-template-columns: 50% 50%">-->
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">বর্তমান বসবাসের দেশ:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.country}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">শহর:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.city}</span>
    </div>
<!--  </div>-->

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">জিপ/পোস্টাল কোড:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zip}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">স্থায়ী ঠিকানা (দেশ):</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">শহর:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.cityPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">জিপ/পোস্টাল কোড:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zipPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">ফেসবুক প্রোফাইল লিংক:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.facebook ?? 'N/A'}</span>
  </div>

  <div><h3 style="line-height: 20px;margin-bottom: 0;">প্রস্তাবক ১</h3></div>
  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">নাম:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Name}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">মোবাইল:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Mobile}</span>
    </div>
  </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">পদবী:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Designation}</span>
  </div>

  <div><h3 style="line-height: 20px;margin-bottom: 0;">প্রস্তাবক ২</h3></div>
  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">নাম:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Name}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">মোবাইল:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Mobile}</span>
    </div>
  </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">পদবী:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Designation}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 19px">
    <p style="line-height: 24px">আমি solemnly ঘোষণা করছি যে আমি বাংলাদেশ জাতীয়তাবাদী দলের সংবিধান, ঘোষণা ও নীতি-আদর্শের প্রতি শ্রদ্ধাশীল। ১৯৭৭ সালে জনগণ কর্তৃক অনুমোদিত ১৯ দফা কর্মসূচির বাস্তবায়নের মাধ্যমে বাংলাদেশের জাতীয়তাবাদ, উৎপাদনের রাজনীতি, গণতন্ত্র, জাতীয় ঐক্য ও শান্তি-সমৃদ্ধি অর্জনের প্রতি অঙ্গীকারাবদ্ধ। দুর্নীতি সহ্য করবো না এবং সদস্যপদ গ্রহণ করতে আবেদন করছি।</p>
  </div>

  <div style="display: flex;justify-content: space-between;">
    <div>
    <img style="max-width: 100px" src="https://api.bnpbd.org/api/upload/images/sign.png" alt="">
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">চেয়ারপার্সন</span>
    </div>
   </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
<!--      <span style="text-wrap: nowrap;">সদস্যের স্বাক্ষর</span>-->
    </div>
     <div>
    <p>Digitally Signed</p>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">সংগ্রাহকের স্বাক্ষর</span>
    </div>
    </div>
  </div>

  <div style="display: grid;grid-template-columns: 33.33% 33.33% 33.33%;margin-top: 8px">
    <div></div>
    <div style="display:flex;margin-top: 10px;font-size: 20px;margin-right: 25px">
<!--      <span style="text-wrap: nowrap;">তারিখ</span>-->
<!--      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>-->
    </div>
    <div style="display:flex;justify-content: flex-end; margin-top: 10px;font-size: 20px;width: 100%">
      <span style="text-wrap: nowrap;">তারিখ</span>
      <p style="border-top: 1px solid #000000!important;width: 50%;"></p>
    </div>
  </div>

</div>

`;

      }else{
        htmlContent = `
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">
<!--  <div style="display:flex;justify-content: center;margin-bottom: 10px">-->
<!--    <h1 style="font-size: 16px">Bismillahir Rahmanir Rahim</h1>-->
<!--  </div>-->

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 140px;" src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px;  line-height: 18px; text-align: center;margin-bottom: 0!important;">Bismillahir Rahmanir Rahim</h1>
    <h2 style="font-size: 30px;text-align: center; line-height: 20px">Bangladesh Nationalist Party</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -30px">
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0;">Central office</h3>
<!--    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px;color: #ff5292;">(${formData?.memberType ==='New Member'? 'New Primary Member Renewal Form' : 'Primary Member Renewal Form'})</h3>-->
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px;color: #ff5292;">(${formData?.memberType ==='New Member'? 'New Primary Member / Renewal Primary Member Renewal Form' : 'New Primary Member / Renewal Primary Member Renewal Form'})</h3>
    <h3 style="line-height: 18px;font-size: 16px;margin-top: 0.2px; margin-bottom: 0">MEMBER ID: ${formData?.memberId}</h3>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span>Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.name} </span>
  </div>

  <div style="display: grid;grid-template-columns: 100%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Educational Qualification:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>
    <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display: grid;grid-template-columns: 100%">
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Occupation:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.occupation}</span>
    </div>
  </div>


  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Age:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.age}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Resident Status:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.resident}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Phone / Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryCode}${formData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Email:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.email}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">WhatsApp Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.whatsAppNumber}</span>
  </div>
  </div>

<!--  <div style="display: grid;grid-template-columns: 50% 50%">-->
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Present Resident Country:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.country}</span>
    </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">City:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.city}</span>
    </div>
<!--  </div>-->

<!--<div style="display: grid;grid-template-columns: 50% 50%">-->
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zip}</span>
    </div>

    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Permanent Resident Country:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;"> City:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.cityPermanent}</span>
  </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zipPermanent}</span>
    </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Facebook Profile Link:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.facebook ?? 'N/A'}</span>
  </div>
<!--  </div>-->

  <div><h3  style="line-height: 20px;margin-bottom: 0;">Recommend Person 1</h3></div>
  <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Name}</span>
  </div>


  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Mobile}</span>
  </div>
</div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Designation:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender1Designation}</span>
  </div>


  <div><h3 style="line-height: 20px;margin-bottom: 0;">Recommend Person 2</h3></div>
    <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Name}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Mobile}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Designation:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.recommender2Designation}</span>
  </div>

  <div style="display:flex;margin-top: 5px;font-size: 19px">
   <p style="line-height: 24px">I solemnly declare that I hold deep respect for the constitution, declaration, and ideals and objectives of the Bangladesh Nationalist Party. I further declare my firm commitment to uphold Bangladeshi nationalism, the politics of production, people's democracy, national unity, and the achievement of peace and prosperity through the implementation of the 19-point program endorsed by the people in 1977. I pledge never to tolerate corruption. I hereby apply to be accepted as a member of the Bangladesh Nationalist Party.</p>
  </div>

  <div style="display: flex;justify-content: space-between;">
    <div>
    <img style="max-width: 140px" src="https://api.bnpbd.org/api/upload/images/sign.png" alt="">
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Chairperson</span>
    </div>
</div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
<!--      <span style="text-wrap: nowrap;">Member's signature</span>-->
    </div>
   <div>
    <p>Digitally Signed</p>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Collector's signature</span>
    </div>
</div>
  </div>


  <div style="display: grid;grid-template-columns: 33.33% 33.33% 33.33%;margin-top: 8px">
    <div style="display:flex;margin-top: 10px;font-size: 20px">
    </div>
    <div style="display:flex;margin-top: 10px;font-size: 20px;margin-right: 25px">
<!--      <span style="text-wrap: nowrap;">Date</span>-->
<!--      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>-->
    </div>
    <div style="display:flex;justify-content: flex-end; margin-top: 10px;font-size: 20px;width: 100%">
      <span style="text-wrap: nowrap;">Date</span>
      <p style="border-top: 1px solid #000000!important;width: 50%;"></p>
    </div>
  </div>

</div>
</div>
    `;
      }
    }else{
      if(this.language() === 'bn'){
        htmlContent = `
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 140px;" src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px;  line-height: 18px; text-align: center;margin-bottom: 0!important;">বিসমিল্লাহির রহমানির রহিম</h1>
      <h2 style="font-size: 30px;text-align: center; line-height: 20px">বাংলাদেশ জাতীয়তাবাদী দল</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -30px">
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0">কেন্দ্রীয় কার্যালয়</h3>
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px; color: #ff5292;">মাসিক সদস্য ফি সাইন আপ ফরম</h3>
     <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px; color: #ff5292;">সদস্য আইডি ${formData?.memberId}</h3>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span>নাম:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.name} </span>
  </div>

  <div style="display: grid;grid-template-columns: 100%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">শিক্ষাগত যোগ্যতা:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">পেশা:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.occupation}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">বয়স:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.age}</span>
    </div>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">বাসিন্দার অবস্থান:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.resident}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">ফোন/মোবাইল নাম্বার:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryCode}${formData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">ইমেইল:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.email}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">হোয়াটসঅ্যাপ নাম্বার:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.whatsAppNumber}</span>
    </div>
  </div>

<!--  <div style="display: grid;grid-template-columns: 50% 50%">-->
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">বর্তমান বসবাসের দেশ:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.country}</span>
    </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">শহর:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.city}</span>
    </div>
<!--  </div>-->

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">জিপ/পোস্টাল কোড:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zip}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">স্থায়ী ঠিকানা (দেশ):</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">শহর:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.cityPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">জিপ/পোস্টাল কোড:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zipPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">ফেসবুক প্রোফাইল লিংক:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.facebook ?? 'N/A'}</span>
  </div>


  <div style="display:flex;margin-top: 5px;font-size: 19px">
    <p style="line-height: 24px">আমি solemnly ঘোষণা করছি যে আমি বাংলাদেশ জাতীয়তাবাদী দলের সংবিধান, ঘোষণা ও নীতি-আদর্শের প্রতি শ্রদ্ধাশীল। ১৯৭৭ সালে জনগণ কর্তৃক অনুমোদিত ১৯ দফা কর্মসূচির বাস্তবায়নের মাধ্যমে বাংলাদেশের জাতীয়তাবাদ, উৎপাদনের রাজনীতি, গণতন্ত্র, জাতীয় ঐক্য ও শান্তি-সমৃদ্ধি অর্জনের প্রতি অঙ্গীকারাবদ্ধ। দুর্নীতি সহ্য করবো না এবং সদস্যপদ গ্রহণ করতে আবেদন করছি।</p>
  </div>

  <div style="display: flex;justify-content: space-between; margin-top: 50px">
     <div>
    <img style="max-width: 140px" src="https://api.bnpbd.org/api/upload/images/sign.png" alt="">
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">চেয়ারপার্সন</span>
    </div>
   </div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
<!--      <span style="text-wrap: nowrap;">সদস্যের স্বাক্ষর</span>-->
    </div>
    <div>
    <p style="line-height: 18px">Digitally Signed</p>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">সংগ্রাহকের স্বাক্ষর</span>
    </div>
</div>
  </div>

  <div style="display: grid;grid-template-columns: 33.33% 33.33% 33.33%;margin-top: 8px">
    <div></div>
    <div style="display:flex;margin-top: 10px;font-size: 20px;margin-right: 25px">
<!--      <span style="text-wrap: nowrap;">তারিখ</span>-->
<!--      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>-->
    </div>

    <div style="display:flex;justify-content: flex-end; margin-top: 40px;font-size: 20px;width: 100%">
      <span style="text-wrap: nowrap;">তারিখ</span>
      <p style="border-top: 1px solid #000000!important;width: 50%;"></p>
    </div>
  </div>

</div>

`;

      }else{
        htmlContent = `
<div #pdfContent id="pdf-content" class="pdf-style" style="position: relative; margin: 0 auto; width: 100%; height: auto;">
  <div style="position: absolute; z-index: 0; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;height: 1070px;">
    <img src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
         style="width: 100%; height: 100%; object-fit: cover; opacity: 0.1;"
         alt="Background Image">
  </div>
  <div style="padding: 10px;">
<!--  <div style="display:flex;justify-content: center;margin-bottom: 10px">-->
<!--    <h1 style="font-size: 16px">Bismillahir Rahmanir Rahim</h1>-->
<!--  </div>-->

  <div style="display:flex;gap: 10px;align-items: center;margin-bottom: 0">
    <img style="width: 140px;" src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png" alt="">
     <div>
      <h1 style="font-size: 20px;  line-height: 18px; text-align: center;margin-bottom: 0!important;">Bismillahir Rahmanir Rahim</h1>
    <h2 style="font-size: 30px;text-align: center; line-height: 20px">Bangladesh Nationalist Party</h2>
</div>

  </div>

  <div style="display:flex;justify-content: center;align-items: center;flex-direction: column;margin-top: -30px">
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0">Central office</h3>
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px;color: #ff5292;">(Monthly Membership Fee Sign Up Form)</h3>
    <h3 style="line-height: 18px;font-size: 16px;margin-bottom: 0; margin-top: 0.2px;">MEMBER ID: ${formData?.memberId}</h3>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span>Name:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.name} </span>
  </div>

  <div style="display: grid;grid-template-columns: 100%">
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Educational Qualification:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.qualification}</span>
    </div>
  </div>
    <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display: grid;grid-template-columns: 100%">
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Occupation:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.occupation}</span>
    </div>
  </div>


  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Age:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.age}</span>
  </div>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Resident Status:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.resident}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Phone / Mobile Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryCode}${formData?.phoneNo}</span>
  </div>

  <div style="display: grid;grid-template-columns: 50% 50%">
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Email:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.email}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">WhatsApp Number:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.whatsAppNumber}</span>
  </div>
  </div>

<!--  <div style="display: grid;grid-template-columns: 50% 50%">-->
    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Present Resident Country:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.country}</span>
    </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">City:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.city}</span>
    </div>
<!--  </div>-->

<!--<div style="display: grid;grid-template-columns: 50% 50%">-->
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zip}</span>
    </div>

    <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Permanent Resident Country:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.countryPermanent}</span>
  </div>

  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;"> City:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.cityPermanent}</span>
  </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
      <span style="text-wrap: nowrap;">Zip/Postal Code:</span>
      <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.zipPermanent}</span>
    </div>
  <div style="display:flex;margin-top: 7px;font-size: 18px;align-content: center;">
    <span style="text-wrap: nowrap;">Facebook Profile Link:</span>
    <span style=" padding-left: 8px; border-bottom: 1px solid #000000!important;width: 100%;"> ${formData?.facebook ?? 'N/A'}</span>
  </div>
<!--  </div>-->

  <div style="display:flex;margin-top: 5px;font-size: 19px">
   <p style="line-height: 24px">I solemnly declare that I hold deep respect for the constitution, declaration, and ideals and objectives of the Bangladesh Nationalist Party. I further declare my firm commitment to uphold Bangladeshi nationalism, the politics of production, people's democracy, national unity, and the achievement of peace and prosperity through the implementation of the 19-point program endorsed by the people in 1977. I pledge never to tolerate corruption. I hereby apply to be accepted as a member of the Bangladesh Nationalist Party.</p>
  </div>

  <div style="display: flex;justify-content: space-between;margin-top: 50px;">
    <div>
    <img style="max-width: 140px" src="https://api.bnpbd.org/api/upload/images/sign.png" alt="">
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Chairperson</span>
    </div>
</div>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
<!--      <span style="text-wrap: nowrap;">Member's signature</span>-->
    </div>
    <div>
    <p style="line-height: 18px">Digitally Signed</p>
    <div style="display:flex;margin-top: 7px;font-size: 18px;border-top: 1px solid #000000;">
      <span style="text-wrap: nowrap;">Collector's signature</span>
    </div>
</div>
  </div>


  <div style="display: grid;grid-template-columns: 33.33% 33.33% 33.33%;margin-top: 8px">
    <div style="display:flex;margin-top: 10px;font-size: 20px">
    </div>
    <div style="display:flex;margin-top: 10px;font-size: 20px;margin-right: 25px">
<!--      <span style="text-wrap: nowrap;">Date</span>-->
<!--      <p style="border-top: 1px solid #000000!important;width: 100%;"></p>-->
    </div>
    <div style="display:flex;justify-content: flex-end; margin-top: 40px;font-size: 20px;width: 100%">
      <span style="text-wrap: nowrap;">Date</span>
      <p style="border-top: 1px solid #000000!important;width: 50%;"></p>
    </div>
  </div>

</div>
</div>
    `;
      }
    }



    this.contactService.generatePDF(htmlContent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Membership_Registration_Form.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isLoading.set(false);
      });
  }
}
