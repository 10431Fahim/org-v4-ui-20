import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { GalleryPopupComponent } from './gallery-popup/gallery-popup.component';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GalleryComponent,
    GalleryPopupComponent
  ]
})
export class GalleryModule { }
