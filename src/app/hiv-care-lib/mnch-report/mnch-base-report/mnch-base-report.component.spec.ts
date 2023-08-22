import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnchBaseReportComponent } from './mnch-base-report.component';

describe('MnchBaseReportComponent', () => {
  let component: MnchBaseReportComponent;
  let fixture: ComponentFixture<MnchBaseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MnchBaseReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnchBaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
