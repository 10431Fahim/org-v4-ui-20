import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-voter-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './voter-list.component.html',
    styleUrls: ['./voter-list.component.scss']
})
export class VoterListComponent implements OnInit, OnDestroy {
    searchQuery: string = '';

    // Countdown state
    targetDate = new Date('2026-02-12T00:00:00');

    // Separate signals for animation styling if needed
    days = signal<number>(0);
    hours = signal<number>(0);
    minutes = signal<number>(0);
    seconds = signal<number>(0);

    private intervalId: any;

    ngOnInit() {
        this.updateTimer();
        this.intervalId = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private updateTimer() {
        const now = new Date();
        const diff = this.targetDate.getTime() - now.getTime();

        if (diff <= 0) {
            return;
        }

        this.days.set(Math.floor(diff / (1000 * 60 * 60 * 24)));
        this.hours.set(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        this.minutes.set(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        this.seconds.set(Math.floor((diff % (1000 * 60)) / 1000));
    }

    onSearch() {
        console.log('Search Query:', this.searchQuery);
        // Here you would typically call an API
    }
}
