import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { Observable, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'pdfjs-dist';
import * as _ from 'lodash';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit, OnChanges {
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

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }
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
        const indicatorDefinition = section.indicators[j].indicator;
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          description: section.indicators[j].description,
          value: [],
          width: 360,
          total: 0
        };
        this.sectionIndicatorsValues.forEach(element => {
          const val: any = {
            location: element['location_uuid'],
            value: '-'
          };
          if (element[indicatorDefinition] || element[indicatorDefinition] === 0) {
            val.value = element[indicatorDefinition];
            sumOfValue.push(val.value);
            locations.push(element['location_uuid']);
          }

          child.value.push(val);
        });
        if (this.sectionIndicatorsValues.length > 1) {
          this.multipleLocations = true;
          this.pdfWidth = 2;
          const sum = sumOfValue.reduce((partial_sum, a) => partial_sum + a, 0);
          if (_.isString(sum)) {
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
  public setCellSelection(col, val) {
    const selectedIndicator = { headerName: col.headerName, field: col.field, location: val.location };
    this.CellSelection.emit(selectedIndicator);
  }
  public searchIndicator() {
    this.setColumns(this.sectionDefs);
    if (this.selectedResult.length > 0) {
      this.gridOptions.columnDefs.forEach(object => {
        const make = {
          headerName: '',
          children: []
        };
        object.children.forEach(object2 => {
          if (object2['headerName'].toLowerCase().match(this.selectedResult) !== null) {
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
      this.selectedIndicatorsList.forEach(indicator => {
        value.push(this.gridOptions.columnDefs[indicator]);
      });
      this.gridOptions.columnDefs = value;
    } else {
      this.setColumns(this.sectionDefs);
    }
  }
  public downloadPdf() {
    this.pdfvalue = this.bodyValues();
    this.generatePdf().pipe(take(1)).subscribe(
      (pdf) => {
        this.pdfSrc = pdf.pdfSrc;
        this.pdfMakeProxy = pdf.pdfProxy;
        this.securedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
        this.isBusy = false;
        this.downloadPdfView();
      },
      (err) => {
        this.errorFlag = true;
        this.isBusy = false;
      }
    );
  }
  public generatePdf(): Observable<any> {
    const width: any = ['*', '*'];
    this.sectionIndicatorsValues.forEach(element => {
      width.push('*');
    });
    const dd: any = {
      content: [
        { text: this.reportDetails.reportName.toUpperCase(), margin: [0, 20, 0, 8], style: 'title' },
        {
          text: this.reportDetails.year_week === undefined ?
            this.reportDetails._date : this.reportDetails.year_week, margin: [0, 8, 0, 8], style: 'title'
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 2,
            widths: width,
            body: this.pdfvalue,
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            }
          }
        },
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
      const pdfProxy = pdfMake.createPdf(x
      );
      pdfProxy.getBase64((output) => {
        const int8Array: Uint8Array =
          this._base64ToUint8Array(output);
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
    this.gridOptions.columnDefs.forEach(columnDefs => {
      const head = [];
      const part = {
        text: columnDefs.headerName, style: 'tableHeader', fillColor: '#337ab7',
        colSpan: this.sectionIndicatorsValues.length + this.pdfWidth, alignment: 'left'
      };
      head.push(part);
      body.push(head);
      columnDefs.children.forEach(col => {
        const sec = [];
        const test = {
          text: col.headerName, style: 'subheader',
          alignment: 'left'
        };
        sec.push(test);
        col.value.forEach(element => {
          const value = {
            text: element.value, style: 'subheader',
            alignment: 'center'
          };
          sec.push(value);
        });
        if (this.multipleLocations) {
          sec.push({
            text: col.total.value, style: 'title',
            alignment: 'centre'
          });
        }
        body.push(sec);
      });
    });
    return body;
  }


  public nextPage(): void {
    this.page++;
  }
  public prevPage(): void {
    this.page--;
  }
  public downloadPdfView(): void {
    this.pdfMakeProxy
      .download((this.reportDetails.reportName) + '.pdf');
  }
}




