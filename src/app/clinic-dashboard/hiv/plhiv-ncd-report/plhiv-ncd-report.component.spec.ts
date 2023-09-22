import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlhivNcdReportComponent } from './plhiv-ncd-report.component';

describe('PlhivNcdReportComponent', () => {
  let component: PlhivNcdReportComponent;
  let fixture: ComponentFixture<PlhivNcdReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlhivNcdReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlhivNcdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
