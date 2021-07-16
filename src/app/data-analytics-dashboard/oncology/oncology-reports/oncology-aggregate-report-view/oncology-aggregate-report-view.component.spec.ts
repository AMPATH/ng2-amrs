import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { OncologyAggregateReportViewComponent } from "./oncology-aggregate-report-view.component";
import { OncologyReportPdfService } from "../oncology-report-pdf-view/oncology-report-pdf.service";

describe("OncologyAggregateReportViewComponent", () => {
  let component: OncologyAggregateReportViewComponent;
  let fixture: ComponentFixture<OncologyAggregateReportViewComponent>;
  const oncologyReportPdfService = jasmine.createSpyObj(
    "OncologyReportPdfService",
    ["generatePdf"]
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OncologyAggregateReportViewComponent],
      providers: [
        {
          provide: OncologyReportPdfService,
          useValue: oncologyReportPdfService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OncologyAggregateReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
