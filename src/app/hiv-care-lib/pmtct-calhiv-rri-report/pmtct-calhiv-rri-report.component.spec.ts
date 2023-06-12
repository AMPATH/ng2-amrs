import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmtctCalhivRriReportComponent } from './pmtct-calhiv-rri-report.component';

describe('PmtctCalhivRriReportComponent', () => {
  let component: PmtctCalhivRriReportComponent;
  let fixture: ComponentFixture<PmtctCalhivRriReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmtctCalhivRriReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmtctCalhivRriReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
