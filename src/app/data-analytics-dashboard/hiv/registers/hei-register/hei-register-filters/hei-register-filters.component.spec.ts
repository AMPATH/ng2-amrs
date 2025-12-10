import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeiRegisterFiltersComponent } from './hei-register-filters.component';

describe('HeiRegisterFiltersComponent', () => {
  let component: HeiRegisterFiltersComponent;
  let fixture: ComponentFixture<HeiRegisterFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeiRegisterFiltersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeiRegisterFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
