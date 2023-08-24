import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { Observable, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'pdfjs-dist';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-tx-ml-report-view',
  templateUrl: './tx-ml-report-view.component.html',
  styleUrls: ['./tx-ml-report-view.component.css']
})
export class TxMlReportViewComponent implements OnInit, OnChanges {
  @Input() SummaryData = [];
  @Input() sectionDefs: any;
  @Input() reportDetails: any = [];

  @Output()
  public indicatorSelected = new EventEmitter();
  private _rowDefs: Array<any>;
  public test = [];
  public gridOptions: any = {
    columnDefs: []
  };
  public pdfvalue: any;
  public pdfSrc: string = null;
  public isBusy = false;
  public multipleLocations = false;
  public headers = [];
  public sectionIndicatorsValues: Array<any>;
  public pdfWidth = 1;
  public page = 1;
  public selectedResult: string;
  public selectedIndicatorsList = [];
  public errorFlag = false;
  public securedUrl: SafeResourceUrl;
  public pdfProxy: PDFDocumentProxy = null;
  public pdfMakeProxy: any = null;

  @Output()
  public CellSelection = new EventEmitter();

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit() {}
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.SummaryData) {
      this.sectionIndicatorsValues = this.SummaryData;
      this.setColumns(this.sectionDefs);
    }
  }

  public setColumns(sectionsData: Array<any>) {
    this.headers = [];
    const defs = [];
    let sumOfValue = [];
    let locations = [];

    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      const header = {
        label: section.sectionTitle,
        value: i
      };
      this.headers.push(header);
      created.children = [];

      for (let j = 0; j < section.indicators.length; j++) {
        const indicator = section.indicators[j];
        const isArrayIndicator = Array.isArray(indicator.indicator);

        let m_indicatorDefinition, f_indicatorDefinition, indicatorDefinition;

        if (isArrayIndicator) {
          m_indicatorDefinition = indicator.indicator[0];
          f_indicatorDefinition = indicator.indicator[1];
        } else {
          indicatorDefinition = indicator.indicator;
        }

        const child: any = {
          headerName: indicator.label,
          field: indicator.indicator,
          description: indicator.description,
          value: [],
          width: 360,
          total: 0
        };

        this.sectionIndicatorsValues.forEach((element) => {
          const val = {
            location: element['location_uuid'],
            value: [['-'], ['-']]
          };
          if (isArrayIndicator) {
            if (
              (element[m_indicatorDefinition] ||
                element[m_indicatorDefinition] === 0) &&
              (element[f_indicatorDefinition] ||
                element[f_indicatorDefinition] === 0)
            ) {
              val.value[0] = element[m_indicatorDefinition];
              val.value[1] = element[f_indicatorDefinition];
              sumOfValue.push(val.value[0]);
              sumOfValue.push(val.value[1]);
              locations.push(element['location_uuid']);
            }

            child.value.push(val);
          } else {
            if (
              element[indicatorDefinition] ||
              element[indicatorDefinition] === 0
            ) {
              val.value[0] = element[indicatorDefinition];
              sumOfValue.push(val.value[0]);
              locations.push(element['location_uuid']);
            }

            child.value.push(val);
          }
        });

        if (this.sectionIndicatorsValues.length > 1) {
          this.multipleLocations = true;
          this.pdfWidth = 2;

          const sum = sumOfValue.reduce((partial_sum, a) => partial_sum + a, 0);

          if (typeof sum === 'string') {
            child.total = {
              location: locations,
              value: 'Total'
            };
          } else {
            child.total = {
              location: locations,
              value: sum
            };
          }

          sumOfValue = [];
          locations = [];
        }

        created.children.push(child);
      }

      defs.push(created);
    }

    this.gridOptions.columnDefs = defs;
  }
  public setCellSelection(col, val, arrayPosition, grid) {
    const gender = `${grid.headerName} - ${this.checkGender(arrayPosition)}`;
    const arraypos = arrayPosition === 3 ? 0 : arrayPosition;
    const selectedIndicator = {
      headerName: col.headerName,
      field: col.field[arraypos],
      gender: gender,
      location: val.location
    };
    this.CellSelection.emit(selectedIndicator);
  }
  public checkGender(arrayPosition) {
    if (arrayPosition === 0) {
      return 'Female';
    } else if (arrayPosition === 1) {
      return 'Male';
    } else if (arrayPosition === 3) {
      return 'Facility';
    } else {
      return 'Cummulative';
    }
  }
  public searchIndicator() {
    this.setColumns(this.sectionDefs);
    if (this.selectedResult.length > 0) {
      this.gridOptions.columnDefs.forEach((object) => {
        const make = {
          headerName: '',
          children: []
        };
        object.children.forEach((object2) => {
          if (
            object2['headerName'].toLowerCase().match(this.selectedResult) !==
            null
          ) {
            make.headerName = object['headerName'];
            make.children.push(object2);
          }
        });
        if (make.headerName !== '') {
          this.test.push(make);
        }
      });
      this.gridOptions.columnDefs = [];
      this.gridOptions.columnDefs = this.test;
      this.test = [];
    } else {
      this.setColumns(this.sectionDefs);
    }
  }
  public selectedIndicators() {
    this.setColumns(this.sectionDefs);
    const value = [];
    if (this.selectedIndicatorsList.length) {
      this.selectedIndicatorsList.forEach((indicator) => {
        value.push(this.gridOptions.columnDefs[indicator]);
      });
      this.gridOptions.columnDefs = value;
    } else {
      this.setColumns(this.sectionDefs);
    }
  }
  public downloadPdf() {
    const csvHeader = [
      [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      [
        'TX_CURR May 2023',
        '',
        '',
        '',
        '',
        '',
        '0_to_1',
        '',
        '1_to_4',
        '',
        '5_to_9',
        '',
        '10_to_14',
        '',
        '15_to_19',
        '',
        '20_to_24',
        '',
        '25_to_29',
        '',
        '30_to_34',
        '',
        '35_to_39',
        '',
        '40_to_44',
        '',
        '45_to_49',
        '',
        '50_to_54',
        '',
        '55_to_59',
        '',
        '60_to_64',
        '',
        '65 +',
        ''
      ],
      [
        'clinic_county_1',
        'Sub County',
        'clinic',
        'Facility',
        'MFL_Code',
        'Indicator',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'F',
        'M',
        'Grand Total'
      ]
    ];

    const data = [
      {
        clinic_county: 'Bungoma',
        sub_county: 'Mt Elgon Sub County',
        clinic: 'Kaborom',
        facility: 'Kaborom Dispensary',
        mfl_code: '15910',
        indicator: 'Active',
        female_0_to_1: '8',
        male_0_to_1: '1',
        female_1_to_4: '68',
        male_1_to_4: '86',
        female_5_to_9: '1',
        male_5_to_9: '6',
        female_10_to_14: '6',
        male_10_to_14: '1',
        female_15_to_19: '6',
        male_15_to_19: '6',
        female_20_to_24: '6',
        male_20_to_24: '2',
        female_25_to_29: '8',
        male_25_to_29: '88',
        female_30_to_34: '66',
        male_30_to_34: '68',
        female_35_to_39: '3',
        male_35_to_39: '1',
        female_40_to_44: '3',
        male_40_to_44: '36',
        female_45_to_49: '4',
        male_45_to_49: '63',
        female_50_to_54: '552',
        male_50_to_54: '22',
        female_55_to_59: '5',
        male_55_to_59: '3',
        female_60_to_64: '',
        male_60_to_64: '',
        female_65_plus: '1',
        male_65_plus: '',
        grand_total: '36'
      },
      {
        clinic_county: 'Bungoma',
        sub_county: 'Mt Elgon Sub County',
        clinic: 'Kaborom',
        facility: 'Kaborom Dispensary',
        mfl_code: '15910',
        indicator: '28 Day Defaulter',
        female_0_to_1: '2',
        male_0_to_1: '3',
        female_1_to_4: '4',
        male_1_to_4: '1',
        female_5_to_9: '1',
        male_5_to_9: '5',
        female_10_to_14: '6',
        male_10_to_14: '4',
        female_15_to_19: '6',
        male_15_to_19: '6',
        female_20_to_24: '4',
        male_20_to_24: '',
        female_25_to_29: '7',
        male_25_to_29: '454',
        female_30_to_34: '45',
        male_30_to_34: '32',
        female_35_to_39: '67',
        male_35_to_39: '46',
        female_40_to_44: '45',
        male_40_to_44: '67',
        female_45_to_49: '5',
        male_45_to_49: '4',
        female_50_to_54: '3',
        male_50_to_54: '3',
        female_55_to_59: '3',
        male_55_to_59: '3',
        female_60_to_64: '3',
        male_60_to_64: '',
        female_65_plus: '4',
        male_65_plus: '4',
        grand_total: '5'
      }
    ];

    const csvData = [csvHeader[0], csvHeader[1], csvHeader[2]];
    data.forEach((item) => {
      const row = Object.values(item);
      csvData.push(row);
    });

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Save the file
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Comming soon. Development in progress.......');
    // this.pdfvalue = this.bodyValues();
    // this.generatePdf()
    //   .pipe(take(1))
    //   .subscribe(
    //     (pdf) => {
    //       this.pdfSrc = pdf.pdfSrc;
    //       this.pdfMakeProxy = pdf.pdfProxy;
    //       this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
    //         this.pdfSrc
    //       );
    //       this.isBusy = false;
    //       this.downloadPdfView();
    //     },
    //     (err) => {
    //       this.errorFlag = true;
    //       this.isBusy = false;
    //     }
    //   );
  }
  public generatePdf(): Observable<any> {
    const width: any = ['*', '*'];
    this.sectionIndicatorsValues.forEach((element) => {
      width.push('*');
    });
    const dd: any = {
      content: [
        {
          text: this.reportDetails.reportName.toUpperCase(),
          margin: [0, 20, 0, 8],
          style: 'title'
        },
        {
          text:
            this.reportDetails.year_week === undefined
              ? this.reportDetails._date
              : this.reportDetails.year_week,
          margin: [0, 8, 0, 8],
          style: 'title'
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 2,
            widths: width,
            body: this.pdfvalue
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 0 ? '#CCCCCC' : null;
            }
          }
        }
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        total: {
          fontSize: 9,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        title: {
          fontSize: 8,
          bold: true
        },
        subheader: {
          fontSize: 7,
          bold: true,
          margin: [0, 1, 0, 1]
        },
        tableExample: {
          fontSize: 9,
          margin: [5, 0, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    };
    if (this.sectionIndicatorsValues.length >= 10) {
      dd.pageOrientation = 'landscape';
    }
    const pdfStructure = dd;
    return Observable.create((observer: Subject<any>) => {
      // JSON stringify and parse was done to handle a potential bug in pdfMake
      const p = JSON.stringify(pdfStructure);
      const x = JSON.parse(p);
      const pdfProxy = pdfMake.createPdf(x);
      pdfProxy.getBase64((output) => {
        const int8Array: Uint8Array = this._base64ToUint8Array(output);
        const blob = new Blob([int8Array], {
          type: 'application/pdf'
        });
        observer.next({
          pdfSrc: URL.createObjectURL(blob),
          pdfDefinition: pdfStructure,
          pdfProxy: pdfProxy
        });
      });
    }).pipe(first());
  }
  private _base64ToUint8Array(base64: any): Uint8Array {
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }
  public bodyValues() {
    const body = [];
    // let span = 0;
    this.gridOptions.columnDefs.forEach((columnDefs) => {
      const head = [];
      const part = {
        text: columnDefs.headerName,
        style: 'tableHeader',
        fillColor: '#337ab7',
        colSpan: this.sectionIndicatorsValues.length + this.pdfWidth,
        alignment: 'left'
      };
      head.push(part);
      body.push(head);
      columnDefs.children.forEach((col) => {
        const sec = [];
        const test = {
          text: col.headerName,
          style: 'subheader',
          alignment: 'left'
        };
        sec.push(test);
        col.value.forEach((element) => {
          const value = {
            text: element.value,
            style: 'subheader',
            alignment: 'center'
          };
          sec.push(value);
        });
        if (this.multipleLocations) {
          sec.push({
            text: col.total.value,
            style: 'title',
            alignment: 'centre'
          });
        }
        body.push(sec);
      });
    });
    console.log(body);
    return body;
  }

  public nextPage(): void {
    this.page++;
  }
  public prevPage(): void {
    this.page--;
  }
  public downloadPdfView(): void {
    this.pdfMakeProxy.download(this.reportDetails.reportName + '.pdf');
  }
}
