import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { OncologyReportPdfViewComponent } from './oncology-report-pdf-view.component';
import { OncologyReportPdfService } from './oncology-report-pdf.service';

const mockParams = {
  monthlySummary: [
    {
      'abnormal_breast_call_rate%': 2.38,
      'abnormal_breast_screening_findings': 1,
      'abnormal_breast_screening_findings_30_to_40_yrs': 0,
      'abnormal_breast_screening_findings_41_to_50_yrs': 0,
      'abnormal_breast_screening_findings_51_to_69_yrs': 1,
      'abnormal_breast_screening_findings_above_70_yrs': 0,
      'abnormal_breast_screening_findings_below_30_yrs': 0,
      'encounter_datetime': '02-2019',
      'location_name': 'Turbo',
      'location_uuid': '08feb2dc-1352-11df-a1f1-0026b9348838',
      'normal_breast_call_rate%': 97.62,
      'normal_breast_screening_findings': 41,
      'normal_breast_screening_findings_30_to_40yrs': 13,
      'normal_breast_screening_findings_41_to_50yrs': 9,
      'normal_breast_screening_findings_51_to_69yrs': 9,
      'normal_breast_screening_findings_above_70yrs': 2,
      'normal_breast_screening_findings_below_30yrs': 7,
      'total_breast_screened': 42
    },
    {
      'abnormal_breast_call_rate%': 2.56,
      'abnormal_breast_screening_findings': 2,
      'abnormal_breast_screening_findings_30_to_40_yrs': 0,
      'abnormal_breast_screening_findings_41_to_50_yrs': 0,
      'abnormal_breast_screening_findings_51_to_69_yrs': 0,
      'abnormal_breast_screening_findings_above_70_yrs': 0,
      'abnormal_breast_screening_findings_below_30_yrs': 2,
      'encounter_datetime': '01-2019',
      'location_name': 'Chulaimbo',
      'location_uuid': '08feb7b4-1352-11df-a1f1-0026b9348838',
      'normal_breast_call_rate%': 97.44,
      'normal_breast_screening_findings': 76,
      'normal_breast_screening_findings_30_to_40yrs': 24,
      'normal_breast_screening_findings_41_to_50yrs': 14,
      'normal_breast_screening_findings_51_to_69yrs': 15,
      'normal_breast_screening_findings_above_70yrs': 1,
      'normal_breast_screening_findings_below_30yrs': 19,
      'total_breast_screened': 78
    },
    {
      'abnormal_breast_call_rate%': 0,
      'abnormal_breast_screening_findings': 0,
      'abnormal_breast_screening_findings_30_to_40_yrs': 0,
      'abnormal_breast_screening_findings_41_to_50_yrs': 0,
      'abnormal_breast_screening_findings_51_to_69_yrs': 0,
      'abnormal_breast_screening_findings_above_70_yrs': 0,
      'abnormal_breast_screening_findings_below_30_yrs': 0,
      'encounter_datetime': '01-2019',
      'location_name': 'Webuye',
      'location_uuid': '08feb8ae-1352-11df-a1f1-0026b9348838',
      'normal_breast_call_rate%': 100,
      'normal_breast_screening_findings': 42,
      'normal_breast_screening_findings_30_to_40yrs': 15,
      'normal_breast_screening_findings_41_to_50yrs': 17,
      'normal_breast_screening_findings_51_to_69yrs': 5,
      'normal_breast_screening_findings_above_70yrs': 1,
      'normal_breast_screening_findings_below_30yrs': 4,
      'total_breast_screened': 42
    }
  ],
  params: {
    endAge: '120',
    endDate: '2019-05-31',
    gender: [],
    locationUuids: '',
    period: 'monthly',
    reportIndex: 0,
    reportUuid: '',
    startAge: '0',
    startDate: '2019-01-01',
    type: 'breast-cancer-screening-numbers'
  },
  title: 'B1 Breast cancer screening numbers'
};

const mockPdfResult = {
  pdfSrc: 'blob:http://localhost:3000/778c5e1b-cf5a-426c-b9ea-889b2e0b0423',
  pdfDefinition: {
    content: [
      {
        stack: [
          {
            alignment: 'center',
            image: '$$pdfmake$$1',
          },
          {
            alignment: 'center',
            style: 'mainHeader',
            text: 'B1. Breast Cancer Screening Numbers Report'
          }
        ]
      },
      {
        stack: [
          {
            stack: [
              {
                style: 'subHeader',
                table: {
                  body: [
                    {
                      text: 'Facility Name: Turbo',
                      style: 'headerStyle',
                      fillColor: '#979799',
                    },
                    {
                      text: 'Date: 01-2019',
                      style: 'headerStyle',
                      fillColor: '#979799'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    defaultStyle: {
      fontSize: 8
    },
    footer: {
      stack: [
        {
          bold: true,
          color: 'black',
          style: {
            alignment: 'center',
            fontSize: 8
          },
          text: 'Generated Using: POC v2.12.0-SNAPSHOTga0e5573f | Generated On: Fri May 24 2019 15:59:29 GMT+0300 (East Africa Time)'
        }
      ]
    },
    pageMargins: 42,
    pageSize: 'LETTER',
    styles: {
      columns: {
        fontSize: 11,
        margin: [5, 2, 10, 20]
      },
      defaultStyle: {
        fontSize: 10,
        margin: [0, 0, 0, 5]
      },
      header: {
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 10]
      },
      headerStyle: {
        bold: true,
        color: '#2a2a2a',
        fillColor: '#d3d3d3',
        fontSize: 10
      },
      indicatorTitle: {
        bold: true,
        fontSize: 12,
        margin: [0, 5, 0, 5]
      },
      mainHeader: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 10]
      },
      subHeader: {
        fontSize: 10,
        bold: true,
        fillColor: '#979799',
        margin: [0, 10, 0, 0]
      },
      tableHeader: {
        bold: true,
        color: 'black',
        fontSize: 10
      }
    }
  },
  pdfProxy: {
    docDefinition: {
      content: [
        {
          stack: [
            {
              alignment: 'center',
              image: '$$pdfmake$$1',
            },
            {
              alignment: 'center',
              style: 'mainHeader',
              text: 'B1. Breast Cancer Screening Numbers Report'
            }
          ]
        },
        {
          stack: [
            {
              stack: [
                {
                  style: 'subHeader',
                  table: {
                    body: [
                      {
                        text: 'Facility Name: Turbo',
                        style: 'headerStyle',
                        fillColor: '#979799',
                      },
                      {
                        text: 'Date: 01-2019',
                        style: 'headerStyle',
                        fillColor: '#979799'
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ],
      defaultStyle: {
        fontSize: 8
      },
      footer: {
        margin: [42, 20],
        stack: [
          {
            bold: true,
            color: 'black',
            style: {
              alignment: 'center',
              fontSize: 8
            },
            text: 'Generated Using: POC v2.12.0-SNAPSHOTga0e5573f | Generated On: Fri May 24 2019 15:59:29 GMT+0300 (East Africa Time)'
          }
        ]
      }
    }
  }
};

describe('OncologyReportPdfViewComponent', () => {
  let component: OncologyReportPdfViewComponent;
  let fixture: ComponentFixture<OncologyReportPdfViewComponent>;
  const oncologyReportPdfService = jasmine.createSpyObj('OncologyReportPdfService', ['generatePdf']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OncologyReportPdfViewComponent],
      providers: [
        {
          provide: OncologyReportPdfService,
          useValue: oncologyReportPdfService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OncologyReportPdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have all its methods defined', () => {
    expect(component.generatePdf).toBeDefined();
    expect(component.afterLoadCompletes).toBeDefined();
    expect(component.fetchReport).toBeDefined();
    expect(component.printReport).toBeDefined();
    expect(component.downloadPdf).toBeDefined();
    expect(component.nextPage).toBeDefined();
    expect(component.prevPage).toBeDefined();
  });

  it('should generate a PDF document when passed the correct parameters', () => {
    fixture.detectChanges();
    const generatePdfSpy = oncologyReportPdfService.generatePdf.and.returnValue(of(mockPdfResult));
    component.monthlySummary = mockParams.monthlySummary;
    component.params = mockParams.params;
    component.title = mockParams.title;
    component.generatePdf();
    expect(component.pdfSrc).toEqual(mockPdfResult.pdfSrc);
    expect(component.pdfMakeProxy).toEqual(mockPdfResult.pdfProxy);
    component.nextPage();
    expect(component.page).toEqual(2);
  });

  it('should be able to navigate to either the previous page or the next page of the generated PDF document', () => {
    fixture.detectChanges();
    const generatePdfSpy = oncologyReportPdfService.generatePdf.and.returnValue(of(mockPdfResult));
    component.monthlySummary = mockParams.monthlySummary;
    component.params = mockParams.params;
    component.title = mockParams.title;
    component.generatePdf();
    console.log('component: ', component);
    expect(component.page).toEqual(1);
    component.nextPage();
    // nextPage()
    expect(component.page).toEqual(2);
    // prevPage()
    component.prevPage();
    expect(component.page).toEqual(1);
  });

  it('should have the download PDF button enabled only when a PDF document is available', () => {
    fixture.detectChanges();
    const divDe: DebugElement = fixture.debugElement;
    const divEl: HTMLElement = divDe.nativeElement;
    const downloadBtn = divEl.querySelector('.btn-primary');
    // download button disabled
    expect(downloadBtn.outerHTML).toMatch(/disabled/);
    const generatePdfSpy = oncologyReportPdfService.generatePdf.and.returnValue(of(mockPdfResult));
    component.monthlySummary = mockParams.monthlySummary;
    component.params = mockParams.params;
    component.title = mockParams.title;
    component.generatePdf();
    fixture.detectChanges();
    // download button enabled
    expect(downloadBtn.outerHTML).not.toMatch(/disabled/);
  });

  it('should download the PDF document when the download button is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'downloadPdf');
    const debugEl: DebugElement = fixture.debugElement;
    const btnDe = debugEl.query(By.css('.btn.btn-primary'));
    const generatePdfSpy = oncologyReportPdfService.generatePdf.and.returnValue(of(mockPdfResult));
    component.monthlySummary = mockParams.monthlySummary;
    component.params = mockParams.params;
    component.title = mockParams.title;
    component.generatePdf();
    fixture.detectChanges();
    // Click the Download Pdf button
    btnDe.triggerEventHandler('click', null);
    expect(component.downloadPdf).toHaveBeenCalled();
    expect(component.downloadPdf).toHaveBeenCalledTimes(1);
  });

});
