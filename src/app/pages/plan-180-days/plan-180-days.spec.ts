import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plan180Days } from './plan-180-days';

describe('Plan180Days', () => {
  let component: Plan180Days;
  let fixture: ComponentFixture<Plan180Days>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plan180Days]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plan180Days);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
