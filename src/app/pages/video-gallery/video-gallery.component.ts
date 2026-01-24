import {Component, DestroyRef, OnInit, computed, inject, signal} from '@angular/core';
import { FilterData } from "../../interfaces/core/filter-data";
import {NgForOf, NgIf} from '@angular/common';
import {SafeUrlPipe} from '../../shared/pipes/safe-url.pipe';
import { ClientService } from '../../services/common/client.service';
import { Client } from '../../interfaces/common/client.interface';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from "@angular/router";

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

  private readonly clientService = inject(ClientService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  // Signals for state
  readonly latestVideo = signal<Client[]>([]);
  readonly selectedVideo = signal<Client | null>(null);
  readonly copied = signal<boolean>(false);

  readonly videoTypeFilter = signal<'all' | 'election' | 'important' | 'speech'>('all');
  readonly totalVideo = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(12);
  readonly isLoadMore = signal<boolean>(false);

  readonly filteredVideos = computed(() => {
    const type = this.videoTypeFilter();
    const videos = this.latestVideo();
    if (type === 'all') {
      return videos;
    }
    return videos.filter(video => video.videoType === type);
  });

  ngOnInit(): void {
    this.initRouteFilter();
    this.getAllLatestVideo();
  }

  selectVideo(video: any) {
    this.selectedVideo.set(video);
    this.copied.set(false);
  }

  isYouTubeVideo(url: any): boolean {
    return url && url.includes('youtube.com/embed');
  }

  getVideoUrl(): string {
    const current = this.selectedVideo();
    return current?.name || current?.url || '';
  }

  getThumbnail(video: any): string {
    return video.image || '/assets/images/default-thumbnail.png'; // fallback image
  }

  onFilterChange(type: 'all' | 'election' | 'important' | 'speech'): void {
    this.videoTypeFilter.set(type);
    const first = this.filteredVideos()[0];
    this.selectedVideo.set(first || null);
    this.copied.set(false);
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
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  private initRouteFilter(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const typeParam = params.get('type') as 'speech' | 'election' | 'important' | null;
        let type: 'all' | 'speech' | 'election' | 'important' = 'all';
        if (typeParam === 'speech' || typeParam === 'election' || typeParam === 'important') {
          type = typeParam;
        }
        this.videoTypeFilter.set(type);

        // When route type changes, update the selected video immediately
        const first = this.filteredVideos()[0];
        this.selectedVideo.set(first || null);
        this.copied.set(false);
      });
  }

  private getAllLatestVideo(loadMore: boolean = false) {
    const filterData: FilterData = {
      pagination: {
        pageSize: this.pageSize(),
        currentPage: this.currentPage() - 1
      },
      filter: null,
      select: {
        image: 1,
        url: 1,
        name: 1,
        title: 1,
        titleEn: 1,
        videoType: 1,
        createdAt: 1
      },
      sort: { createdAt: -1 }
    };

    this.clientService.getAllClients(filterData, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          if (res.success) {
            if (loadMore) {
              this.latestVideo.set([...this.latestVideo(), ...res.data]);
            } else {
              this.latestVideo.set(res.data);
            }
            if (typeof res.count === 'number') {
              this.totalVideo.set(res.count);
            }

            // Update selected video based on current filter
            const first = this.filteredVideos()[0];
            this.selectedVideo.set(first || null);
          }
          this.isLoadMore.set(false);
        },
        error: error => {
          console.log(error);
          this.isLoadMore.set(false);
        }
      });
  }

  onLoadMore(): void {
    if (this.totalVideo() > this.latestVideo().length && !this.isLoadMore()) {
      this.isLoadMore.set(true);
      this.currentPage.set(this.currentPage() + 1);
      this.getAllLatestVideo(true);
    }
  }
}
