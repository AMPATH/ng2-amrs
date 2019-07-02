import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { OncologyReportPdfService } from './oncology-report-pdf.service';

const mockParams = {
  data: [
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

describe('OncologyReportPdfService: ', () => {
  let service: OncologyReportPdfService;
  let indicators;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OncologyReportPdfService]
    });

    service = TestBed.get(OncologyReportPdfService);
    indicators = [
      { section: 'total_breast_screened', report_indicators: ['total_breast_screened'] },
      { section: 'normal_breast_call_rate%', report_indicators: ['normal_breast_call_rate%'] },
      { section: 'abnormal_breast_call_rate%', report_indicators: ['abnormal_breast_call_rate%'] },
      { section: 'normal_breast_screening_findings',
        report_indicators: [
          'normal_breast_screening_findings',
          'normal_breast_screening_findings_below_30yrs',
          'normal_breast_screening_findings_30_to_40yrs',
          'normal_breast_screening_findings_41_to_50yrs',
          'normal_breast_screening_findings_51_to_69yrs',
          'normal_breast_screening_findings_above_70yrs'
        ]
      },
      { section: 'abnormal_breast_screening_findings',
        report_indicators: [
          'abnormal_breast_screening_findings',
          'abnormal_breast_screening_findings_below_30yrs',
          'abnormal_breast_screening_findings_30_to_40yrs',
          'abnormal_breast_screening_findings_41_to_50yrs',
          'abnormal_breast_screening_findings_51_to_69yrs',
          'abnormal_breast_screening_findings_above_70yrs'
        ]
      }
    ];

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('constructPdfStructure returns the observable result of creating the PDF document', (done: DoneFn) => {
    service.constructPdfStructure(mockParams.data, mockParams.params, mockParams.title).subscribe(
      (pdfStructure) => {
        console.log('res:' , pdfStructure);
        expect(pdfStructure.pageSize).toEqual('LETTER');
        expect(pdfStructure.pageMargins).toEqual(42);
        expect(pdfStructure.content[0].stack.length).toEqual(2);
        expect(pdfStructure.content[0].stack[1].alignment).toEqual('center');
        expect(pdfStructure.content[0].stack[1].style).toEqual('mainHeader');
        expect(pdfStructure.content[0].stack[1].text).toEqual('B1 Breast Cancer Screening Numbers Report');
        expect(pdfStructure.footer.margin).toEqual([42, 20]);
        expect(pdfStructure.footer.stack[0].text).toEqual(jasmine.stringMatching('Generated On: '));
        expect(pdfStructure.footer.stack[0].style.alignment).toEqual('center');
        expect(pdfStructure.footer.stack[0].style.fontSize).toEqual(8);
      },
      (err) => {
        console.error('Err: ', err);
      });
      done();
  });

  it('constructAggregatePdfStructure returns the observable result of creating an aggregated PDF document', () => {
    const result = service.constructAggregatePdfStructure(mockParams.data, mockParams.params, mockParams.title);
    expect(result).toBeTruthy();
    expect(result).toEqual(jasmine.any(Observable));
  });

  it('constructAggregateOuterLayout returns an array containg the outer layout of the PDF document', () => {
    const result = service.constructAggregateOuterLayout(mockParams.data, mockParams.params);
    expect(result).toBeTruthy();
    expect(result[0][0][0].table.body[0]).toEqual(
      jasmine.objectContaining(
        [
          {
            text: 'Normal breast call rate%',
            style: 'headerstyle'
          },
          {
            text: '97.53',
            style: 'headerstyle'
          }
        ]
      )
    );
    expect(result[0][0][1].table.body[0][0].text).toEqual('Normal breast screening findings');
    expect(result[0][0][1].table.body[0][1].text).toEqual(117);
    expect((result[0][0][1].table.body).length).toEqual(6);
    expect(result[0][0][1].table.body[1]).toContain('Normal breast screening findings below 30yrs');
    expect(result[0][0][1].table.body[2]).toContain('Normal breast screening findings 30 to 40yrs');
    expect(result[0][0][1].table.body[3]).toContain('Normal breast screening findings 41 to 50yrs');
    expect(result[0][0][1].table.body[4]).toContain('Normal breast screening findings 51 to 69yrs');
    expect(result[0][0][1].table.body[5]).toContain('Normal breast screening findings above 70yrs');
  });

  it('constructBodySection returns an array containing the sections that make up the body of the PDF document', () => {
    const result = service.constructBodySection(mockParams.data[0], mockParams.params, 'pdf');
    expect(result.length).toEqual(5, '5 sections');
    expect(result[0][0].style).toEqual('defaultTable');
    expect(result[0][0].table.body[0][0].text).toEqual('Total breast screened');
    expect(result[0][0].table.body[0][1].text).toEqual(42);
    expect(result[1][0].table.body[0][0].text).toEqual('Normal breast call rate%');
    expect(result[1][0].table.body[0][1].text).toEqual(97.62);
    expect(result[2][0].table.body[0][0].text).toEqual('Abnormal breast call rate%');
    expect(result[2][0].table.body[0][1].text).toEqual(2.38);
    expect(result[3][0].table.body[0][0].text).toEqual('Normal breast screening findings');
    expect(result[3][0].table.body[0][1].text).toEqual(41);
    expect(result[3][0].table.body[1][0]).toEqual('Normal breast screening findings 30 to 40yrs');
    expect(result[3][0].table.body[1][1]).toEqual(13);
    expect(result[3][0].table.body[2][0]).toEqual('Normal breast screening findings 41 to 50yrs');
    expect(result[3][0].table.body[2][1]).toEqual(9);
    expect(result[3][0].table.body[3][0]).toEqual('Normal breast screening findings 51 to 69yrs');
    expect(result[3][0].table.body[3][1]).toEqual(9);
    expect(result[3][0].table.body[4][0]).toEqual('Normal breast screening findings above 70yrs');
    expect(result[3][0].table.body[4][1]).toEqual(2);
    expect(result[3][0].table.body[5][0]).toEqual('Normal breast screening findings below 30yrs');
    expect(result[3][0].table.body[5][1]).toEqual(7);
  });

  it('constructPdfSections returns an array containing the headers that make up the sections of the PDF document', () => {
    let result = [];

    result = result.concat(service.constructPdfSections(mockParams.data, mockParams.params));
    expect(result.length).toBe(3);
    expect(result[1][0].style).toEqual('subheader');
    expect(result[1][0].table.body[0]).toEqual(
      jasmine.objectContaining(
        [
          {
            text: 'Facility Name: Turbo',
            style: 'headerStyle'
          },
          {
            text: 'Date: 02-2019',
            style: 'headerStyle'
          }
        ]
      )
    );
    expect(result[1][0].table.widths).toEqual(jasmine.objectContaining(['*', 'auto']));
    expect(result[2][0].style).toEqual('subheader');
    expect(result[2][0].table.body[0]).toEqual(
      jasmine.objectContaining(
        [
          {
            text: 'Facility Name: Chulaimbo',
            style: 'headerStyle'
          },
          {
            text: 'Date: 01-2019',
            style: 'headerStyle'
          }
        ]
      )
    );
  });

  it('constructTableLayout returns an array of containing the tables of the PDF document', () => {
    let result = [];

    for (const indicator of indicators) {
      result = result.concat(service.constructTableLayout(indicator, mockParams.data[0]));
    }

    expect(result.length).toEqual(5);
    expect(result[0].style).toEqual('defaultTable');
    expect(result[0].table.body[0][0].text).toEqual('Total breast screened');
    expect(result[0].table.body[0][1].text).toEqual(42);
    expect(result[1].table.body[0][0].text).toEqual('Normal breast call rate%');
    expect(result[1].table.body[0][1].text).toEqual(97.62);
    expect(result[2].table.body[0][0].text).toEqual('Abnormal breast call rate%');
    expect(result[2].table.body[0][1].text).toEqual(2.38);
    expect(result[3].table.body[0][0].text).toEqual('Normal breast screening findings');
    expect(result[3].table.body[0][1].text).toEqual(41);
    expect(result[3].table.body[1][0]).toEqual('Normal breast screening findings 30 to 40yrs');
    expect(result[3].table.body[1][1]).toEqual(13);
    expect(result[3].table.body[2][0]).toEqual('Normal breast screening findings 41 to 50yrs');
    expect(result[3].table.body[2][1]).toEqual(9);
    expect(result[3].table.body[3][0]).toEqual('Normal breast screening findings 51 to 69yrs');
    expect(result[3].table.body[3][1]).toEqual(9);
    expect(result[3].table.body[4][0]).toEqual('Normal breast screening findings above 70yrs');
    expect(result[3].table.body[4][1]).toEqual(2);
    expect(result[3].table.body[5][0]).toEqual('Normal breast screening findings below 30yrs');
    expect(result[3].table.body[5][1]).toEqual(7);
  });

  it('constructTableSection returns an array of rows that make up the table layout', () => {
    let result = [];

    for (const indicator of indicators) {
      result = result.concat(service.constructTableSection(indicator, mockParams.data[0]));
    }

    expect(result.length).toEqual(10);
    expect(result[0][0].text).toEqual('Total breast screened');
    expect(result[0][1].text).toEqual(42);
    expect(result[1][0].text).toEqual('Normal breast call rate%');
    expect(result[1][1].text).toEqual(97.62);
    expect(result[2][0].text).toEqual('Abnormal breast call rate%');
    expect(result[2][1].text).toEqual(2.38);
    expect(result[3][0].text).toEqual('Normal breast screening findings');
    expect(result[3][1].text).toEqual(41);
    expect(result[4][0]).toEqual('Normal breast screening findings 30 to 40yrs');
    expect(result[4][1]).toEqual(13);
    expect(result[5][0]).toEqual('Normal breast screening findings 41 to 50yrs');
    expect(result[5][1]).toEqual(9);
    expect(result[6][0]).toEqual('Normal breast screening findings 51 to 69yrs');
    expect(result[6][1]).toEqual(9);
    expect(result[7][0]).toEqual('Normal breast screening findings above 70yrs');
    expect(result[7][1]).toEqual(2);
    expect(result[8][0]).toEqual('Normal breast screening findings below 30yrs');
    expect(result[8][1]).toEqual(7);
  });

  it('generatePdf returns the observable result of creating the PDF document or an error when passed the wrong properties',
    (done: DoneFn) => {
    service.generatePdf(mockParams.data, mockParams.params, mockParams.title)
      .subscribe((pdfStructure) => {
        expect(pdfStructure).toBeDefined();
        expect(pdfStructure.pdfSrc).toBeDefined();
        expect(pdfStructure.pdfProxy).toBeDefined();
        expect(pdfStructure.pdfDefinition).toBeDefined();
        // pdfSrc
        expect(pdfStructure.pdfSrc).toEqual(jasmine.stringMatching(/blob\:http\:\/\/localhost\:9876/));
        // pdfProxy
        expect(pdfStructure.pdfProxy.docDefinition).toEqual(
          jasmine.objectContaining(
            {
              pageSize: 'LETTER',
              pageMargins: 42
            }
          )
        );
        expect(pdfStructure.pdfProxy.docDefinition.content.length).toEqual(2);
        expect(pdfStructure.pdfProxy.docDefinition.content[0].stack[0]).toEqual(
          jasmine.objectContaining(
            {
              alignment: 'center',
              image: '$$pdfmake$$1'
            }
          )
        );
        expect(pdfStructure.pdfProxy.docDefinition.content[0].stack[1]).toEqual(
          jasmine.objectContaining(
            {
              alignment: 'center',
              text: 'B1 Breast Cancer Screening Numbers Report',
              style: 'mainHeader'
            }
          )
        );
        expect(pdfStructure.pdfProxy.docDefinition.content[1].stack.length).toEqual(3);
        expect(pdfStructure.pdfProxy.docDefinition.content[1].stack[1].stack[0].table.body[0][0]).toEqual(
          jasmine.objectContaining(
            {
              text: 'Facility Name: Turbo',
              style: 'headerStyle'
            }
          )
        );
        expect(pdfStructure.pdfProxy.docDefinition.content[1].stack[1].stack[0].table.body[0][1]).toEqual(
          jasmine.objectContaining(
            {
              text: 'Date: 02-2019',
              style: 'headerStyle'
            }
          )
        );
        expect(pdfStructure.pdfProxy.docDefinition.content[1].stack[1].stack[1].stack[0].stack[0]).toEqual(
          jasmine.objectContaining(
            {
              headerRows: 1,
              style: 'defaultTable'
            }
          )
        );
        expect(pdfStructure.pdfProxy.docDefinition.content[1].stack[1].stack[1].stack[0].stack[0].table.body[0][0]).toEqual(
          jasmine.objectContaining(
            {
              text: 'Total breast screened',
              style: 'headerstyle'
            }
          )
        );
        expect(pdfStructure.pdfProxy.docDefinition.content[1].stack[1].stack[1].stack[0].stack[0].table.body[0][1]).toEqual(
          jasmine.objectContaining(
            {
              text: 42,
              style: 'headerstyle'
            }
          )
        );
        // pdfDefinition
        expect(pdfStructure.pdfDefinition.content.length).toEqual(2);
        expect(pdfStructure.pdfDefinition.footer.stack[0].text).toEqual(jasmine.stringMatching('Generated On:'));
        expect(pdfStructure.pdfDefinition.footer.stack[0].style).toEqual(
          jasmine.objectContaining(
            {
              alignment: 'center',
              fontSize: 8
            }
          )
        );
        done();
      }, (err) => {
        console.error('Err: ', err);
      });
  });

  it('format indicators returns strips the given indicator of underscores and transforms it into sentence case', () => {
    const testIndicators = [
      'abnormal_breast_screening_findings',
      'abnormal_breast_screening_findings_below_30yrs'
    ];

    const processedIndicators = testIndicators.map(indicator => service.formatReportIndicators(indicator));
    expect(processedIndicators[0]).toEqual('Abnormal breast screening findings');
    expect(processedIndicators[1]).toEqual('Abnormal breast screening findings below 30yrs');
  });
});
