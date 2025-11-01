import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCarOneLoaderComponent } from './product-car-one-loader.component';

describe('ProductCarOneLoaderComponent', () => {
  let component: ProductCarOneLoaderComponent;
  let fixture: ComponentFixture<ProductCarOneLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCarOneLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCarOneLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
