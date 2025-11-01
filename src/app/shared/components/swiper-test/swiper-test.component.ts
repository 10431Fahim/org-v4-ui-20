import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from '../swiper/swiper.component';

@Component({
  selector: 'app-swiper-test',
  standalone: true,
  imports: [CommonModule, SwiperComponent],
  template: `
    <div style="padding: 20px;">
      <h3>Swiper Test</h3>
      <app-swiper 
        [visibleSlides]="3" 
        [gap]="20" 
        [autoplay]="false" 
        [loop]="false"
        [navigation]="true" 
        [pagination]="true"
        class="test-swiper">
        <div #sliderItem *ngFor="let item of testItems; let i = index" 
             style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px;">
          <h4>Slide {{ i + 1 }}</h4>
          <p>Content for slide {{ i + 1 }}</p>
        </div>
      </app-swiper>
    </div>
  `,
  styles: [`
    .test-swiper {
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class SwiperTestComponent {
  testItems = [
    { id: 1, title: 'Slide 1' },
    { id: 2, title: 'Slide 2' },
    { id: 3, title: 'Slide 3' },
    { id: 4, title: 'Slide 4' },
    { id: 5, title: 'Slide 5' },
    { id: 6, title: 'Slide 6' }
  ];
}
