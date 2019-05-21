import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OncologyReportPdfViewComponent } from './oncology-report-pdf-view.component';

xdescribe('OncologyReportPdfViewComponent', () => {
  let component: OncologyReportPdfViewComponent;
  let fixture: ComponentFixture<OncologyReportPdfViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OncologyReportPdfViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OncologyReportPdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
