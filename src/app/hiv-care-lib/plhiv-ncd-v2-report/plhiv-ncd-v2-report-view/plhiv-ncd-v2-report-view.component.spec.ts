import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlhivNcdV2ReportViewComponent } from './plhiv-ncd-v2-report-view.component';

describe('PlhivNcdV2ReportViewComponent', () => {
  let component: PlhivNcdV2ReportViewComponent;
  let fixture: ComponentFixture<PlhivNcdV2ReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlhivNcdV2ReportViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlhivNcdV2ReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
