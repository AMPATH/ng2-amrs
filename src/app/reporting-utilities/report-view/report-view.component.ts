import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import { Observable, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit, OnChanges  {
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
  public pdfSrc: string = null;
  public isBusy = false;
  public headers = [];
  public sectionIndicatorsValues: Array<any>;
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
    const locations = ['locations'];
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
          width: 360
        };
        this.sectionIndicatorsValues.forEach(element => {
          const val = {
            location: element['location_uuid'],
            value: '-'
          };
          if (element[indicatorDefinition] || element[indicatorDefinition] === 0) {
            val.value = element[indicatorDefinition];
          }
          child.value.push(val);
        });
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

    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options

      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 15;
      pdf.setFontSize(10);
      pdf.text(5, 5, this.reportDetails.reportName + ' : ' + this.reportDetails.currentView.toUpperCase());
      pdf.text(5, 10, this.reportDetails.year_week === undefined ? this.reportDetails._date : this.reportDetails.year_week);
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 16;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNyearWeekG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(this.reportDetails.reportName  + '.pdf');
    });
}
}

