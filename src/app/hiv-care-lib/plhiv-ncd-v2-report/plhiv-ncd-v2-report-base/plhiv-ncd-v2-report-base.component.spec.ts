import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlhivNcdV2ReportBaseComponent } from './plhiv-ncd-v2-report-base.component';

describe('PlhivNcdV2ReportBaseComponent', () => {
  let component: PlhivNcdV2ReportBaseComponent;
  let fixture: ComponentFixture<PlhivNcdV2ReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlhivNcdV2ReportBaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlhivNcdV2ReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
