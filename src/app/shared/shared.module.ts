import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SnackbarNotificationComponent} from './components/ui/snackbar-notification/snackbar-notification.component';
import {ConfirmDialogComponent} from './components/ui/confirm-dialog/confirm-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SocialShareComponent } from './components/ui/social-share/social-share.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    SnackbarNotificationComponent,
    ConfirmDialogComponent,
    SocialShareComponent,
    TranslateModule,
  ],
  exports: [
    SnackbarNotificationComponent,
    ConfirmDialogComponent,
    TranslateModule,
  ],
  providers: []
})
export class SharedModule {
}
