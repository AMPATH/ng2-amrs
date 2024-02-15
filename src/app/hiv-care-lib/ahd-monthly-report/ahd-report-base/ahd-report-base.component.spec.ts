import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhdReportBaseComponent } from './ahd-report-base.component';

describe('AhdReportBaseComponent', () => {
  let component: AhdReportBaseComponent;
  let fixture: ComponentFixture<AhdReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AhdReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhdReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
