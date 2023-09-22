import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlhivNcdReportBaseComponent } from './plhiv-ncd-report-base.component';

describe('PlhivNcdReportBaseComponent', () => {
  let component: PlhivNcdReportBaseComponent;
  let fixture: ComponentFixture<PlhivNcdReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlhivNcdReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlhivNcdReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
