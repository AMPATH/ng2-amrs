import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DqaReportBaseComponent } from './dqa-report-base.component';

describe('DqaReportBaseComponent', () => {
  let component: DqaReportBaseComponent;
  let fixture: ComponentFixture<DqaReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DqaReportBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DqaReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
