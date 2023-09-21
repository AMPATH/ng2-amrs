import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcdReportBaseComponent } from './ncd-report-base.component';

describe('NcdReportBaseComponent', () => {
  let component: NcdReportBaseComponent;
  let fixture: ComponentFixture<NcdReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NcdReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcdReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
