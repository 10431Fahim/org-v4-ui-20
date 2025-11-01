import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramLoaderComponent } from './program-loader.component';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    ProgramLoaderComponent
  ],
  exports:[
    ProgramLoaderComponent
  ]
})
export class ProgramLoaderModule { }
