import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdReportBaseFiltersComponent } from './ncd-report-base-filters.component';

describe('NcdReportBaseFiltersComponent', () => {
  let component: NcdReportBaseFiltersComponent;
  let fixture: ComponentFixture<NcdReportBaseFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NcdReportBaseFiltersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdReportBaseFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
