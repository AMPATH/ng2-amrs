import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlhivNcdV2ReportComponent } from './plhiv-ncd-v2-report.component';

describe('PlhivNcdV2ReportComponent', () => {
  let component: PlhivNcdV2ReportComponent;
  let fixture: ComponentFixture<PlhivNcdV2ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlhivNcdV2ReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlhivNcdV2ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
