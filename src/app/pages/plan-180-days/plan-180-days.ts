import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Plan180DaysService } from '../../services/common/plan-180-days.service';
import { FilterData } from '../../interfaces/core/filter-data';

@Component({
  selector: 'app-plan-180-days',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, TranslateModule],
  templateUrl: './plan-180-days.html',
  styleUrl: './plan-180-days.scss'
})
export class Plan180Days implements OnInit {
  private planService = inject(Plan180DaysService);
  public translate = inject(TranslateService);

  plans = signal<any[]>([]);

  ngOnInit(): void {
    this.getAllPlans();
  }

  getAllPlans() {
    const filterData: FilterData = {
      filter: { status: true },
      pagination: null,
      select: 'title titleBn description descriptionBn serial',
      sort: { serial: 1 }
    };

    this.planService.getAllPlans(filterData).subscribe({
      next: (res) => {
        if (res.success) {
          this.plans.set(res.data);
        }
      }
    });
  }
}
