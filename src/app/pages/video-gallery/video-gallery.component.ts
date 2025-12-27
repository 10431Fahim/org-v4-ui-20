import {Component, OnInit} from '@angular/core';
import { Subscription } from "rxjs";
import { FilterData } from "../../interfaces/gallery/filter-data";
import { LatestVideoService } from "../../services/common/latest-video.service";
import {NgForOf, NgIf} from '@angular/common';
import {SafeUrlPipe} from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-video-gallery',
  templateUrl: './video-gallery.component.html',
  imports: [
    NgIf,
    SafeUrlPipe,
    NgForOf
  ],
  standalone:true,
  styleUrls: ['./video-gallery.component.scss']})
export class VideoGalleryComponent implements OnInit {

  latestVideo: any[] = [];
  selectedVideo: any = null;
  copied = false;


  private subDataOne!: Subscription;

  constructor(

    private latestVideoService: LatestVideoService) {
  }

  ngOnInit(): void {
    this.getAllLatestVideo();
  }

  selectVideo(video: any) {
    this.selectedVideo = video;
    this.copied = false;
  }

  isYouTubeVideo(url: any): boolean {
    return url && url.includes('youtube.com/embed');
  }

  getVideoUrl(): string {
    return this.selectedVideo?.url || '';
  }

  getThumbnail(video: any): string {
    return video.image || '/assets/images/default-thumbnail.png'; // fallback image
  }

  copyLink() {
    const url = this.getVideoUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  private getAllLatestVideo() {
    // Select
    const mSelect = {
      image: 1,
      url: 1,
      name: 1,
      nameBn: 1}

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: { createdAt: -1 }
    }

    this.subDataOne = this.latestVideoService.getAllLatestVideos(filterData, null)
      .subscribe({
        next: res => {
          if (res.success) {
            this.latestVideo = res.data;
            // Select first video by default if available
            if (this.latestVideo.length > 0) {
              this.selectedVideo = this.latestVideo[0];
            }
          }
        },
        error: error => {
          console.log(error);
        }
      });
  }


  ngOnDestroy() {
    this.subDataOne?.unsubscribe();
  }

}
