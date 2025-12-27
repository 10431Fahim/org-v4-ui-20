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

    const issueDate = new Date().toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const approvedDate = formData?.updatedAt
      ? new Date(formData.updatedAt).toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : issueDate;
    const currency =
      formData?.country === 'BD' || formData?.country === 'Bangladesh'
        ? 'টাকা'
        : ' USD';
    const amount = formData?.amount || '২০';
    const mongoId = formData?._id || formData?.id || '';
    const qrCodeUrl = mongoId
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mongoId.toString())}`
      : '';

    htmlContent = `
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.maateen.me/kalpurush/font.css" rel="stylesheet">
<div #pdfContent id="pdf-content" class="pdf-style" style="
    width:1000px;
    font-family:'Kalpurush','Noto Sans Bengali','Century','Times New Roman',Times,Georgia,serif;
    font-weight:400;
    font-style:normal;
    margin:0 auto;
    background:#fff;
    padding:15px;
    border-radius:10px;
    box-shadow:0 15px 45px rgba(0,0,0,0.25);
    border:12px solid #b89c5d;
    outline:10px solid #006A4E;
    position:relative;
">
            <div style="
                border:4px solid #d5bc79;
                padding:30px 30px 20px;
                position:relative;
                background:#fafaf7;
                overflow:hidden;
            ">
                <div style="
                    position:absolute;
                    inset:0;
                    background:url('https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png') center no-repeat;
                    background-size:cover;
                    opacity:.07;
                    pointer-events:none;
                    z-index:1;
                "></div>
                <img src="https://www.bnpbd.org/images/logo/bangladesh-flag-independent-victory-day_551555-340%20(2).png"
                   
                    style="
                        width:100px;
                        opacity:.96;
                        position:absolute;
                        top:60px;
                        left:30px;
                        z-index:200;
                    ">
                <div style="
                    text-align:center;
                    position:relative;
                    z-index:30;
                ">
                    <div style="font-size:14px;color:#444;margin-bottom:4px;">
                        বিসমিল্লাহির রহমানির রাহীম
                    </div>
                    <div style="font-size:28px;font-weight:400;color:#006A4E;letter-spacing:1px;">
                        বাংলাদেশ জাতীয়তাবাদী দল – বিএনপি
                    </div>
                    <div style="font-size:16px;color:#333;margin-top:3px;font-style:normal;">
                        কেন্দ্রীয় দফতর
                    </div>
                    <div style="font-size:20px;color:#333;margin-top:4px;font-weight:400;">
                        সদস্য সংগ্রহ / নবায়ন ফরম
                    </div>
                </div>
                <div style="text-align:center;margin-top:15px;position:relative;z-index:30;">
                    <span style="
                        display:inline-block;
                        background:linear-gradient(90deg,#006A4E,#D60000);
                        color:#fff;
                        padding:6px 30px;
                        border-radius:35px;
                        font-size:14px;
                        font-weight:400;
                        border:2px solid #fff;
                        box-shadow:0 0 12px rgba(0,0,0,0.25);
                    ">
                        সদস্যপদ রশিদ
                    </span>
                    <br>
                    <span style="
                        font-size:24px;
                        font-weight:400;
                        color:#006A4E;
                        border-bottom:3px solid #d6c386;
                        padding:3px 20px;
                        display:inline-block;
                        margin-top:6px;
                    ">
                        ${formData?.name || ''}
                    </span>
                </div>
                <table style="
                    width:100%;
                    border-collapse:collapse;
                    margin-top:18px;
                    font-size:16px;
                    color:#222;
                    position:relative;
                    z-index:30;
                ">
                    <tr>
                        <td style="padding:4px 2px 4px 0;">সদস্য আইডি</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.memberId || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">বয়স</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.age || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">বর্তমান বসবাসের দেশ</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.country || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">শহর</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.city || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">জিপ/পোস্টাল কোড</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.zip || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">স্থায়ী ঠিকানা (দেশ)</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.countryPermanent || ''}</span></td>
                    </tr>
                    <tr>
                        <td style="padding:4px 2px 4px 0px;">শহর</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.cityPermanent || ''}</span></td>
                        <td style="padding:4px 2px 4px 0px;">জিপ/পোস্টাল কোড</td><td style="padding:4px 0px;">:</td><td style="padding:4px 0px 4px 2px;"><span style="font-weight:400;">${formData?.zipPermanent || ''}</span></td>
                    </tr>
                </table>
                <div style="
                    margin-top:18px;
                    text-align:center;
                    font-size:16px;
                    font-weight:400;
                    padding:10px 18px;
                    border-radius:10px;
                    border:2px solid #d3bb76;
                    background:linear-gradient(90deg,rgba(0,106,78,.08),rgba(214,0,0,.08));
                    color:#574f3a;
                    position:relative;
                    z-index:30;
                ">
                    সদস্য ফি: <b style="color:#D60000;font-weight:400;">${amount}${currency}</b> ·
                    ইস্যুর তারিখ: <b style="font-weight:400;">${issueDate}</b> ·
                    মেয়াদ: <b style="font-weight:400;">১ বছর</b>
                </div>
                <div style="
                    margin-top:18px;
                    display:flex;
                    justify-content:space-between;
                    font-size:15px;
                    text-align:center;
                    position:relative;
                    z-index:30;
                ">
                    <div style="margin-top:15px;flex:1;text-align:center;">
                        <img src="https://api.bnpbd.org/api/upload/images/sign.png"
                             crossorigin="anonymous"
                             referrerpolicy="no-referrer"
                             alt="Chairman Signature"
                             style="max-width:90px;height:30px;display:block;margin:0 auto 6px auto;">
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #006A4E;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">চেয়ারপার্সন</span>
                    </div>
                    <div style="flex:1;text-align:center;">
                        <div style="margin-top:25px;height:18px;margin-bottom:6px;font-size:13px;color:#333;">
                            ${approvedDate}
                        </div>
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #444;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">তারিখ</span>
                    </div>
                    <div style="flex:1;text-align:center;">
                        ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR Code" crossorigin="anonymous" referrerpolicy="no-referrer" style="max-width:45px;height:45px;display:block;margin:0 auto 6px auto;object-fit:contain;">` : ''}
                        <div style="
                            width:220px;
                            height:0;
                            border-top:3px solid #D60000;
                            margin:0 auto 5px auto;
                        "></div>
                        <span style="font-weight:400;">আদায়কারীর স্বাক্ষর</span>
                    </div>
                </div>
            </div>
</div>
`;



    this.contactService.generatePDF(htmlContent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pdfBlob) => {
          const url = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Membership_Registration_Form.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.isLoading.set(false);
        },
        error: () => {
          // If the PDF (and its images) cannot be generated/downloaded, notify the user and stop the loader
          this.isLoading.set(false);
          this.uiService.wrong('Unable to download. Please try again.');
        }
      });
  }
}
