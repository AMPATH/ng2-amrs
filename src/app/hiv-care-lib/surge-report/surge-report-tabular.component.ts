import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject } from 'rxjs';

@Component({
  selector: 'surge-report-tabular',
  templateUrl: './surge-report-tabular.component.html',
  styleUrls: ['./surge-report-tabular.component.css']
})
export class SurgeReportTabularComponent implements OnInit {

  @Input() displayTabluarFilters: Boolean;
  public currentView = 'pdf';
  searchTerm$ = new Subject<string>();
  public test = [];
  results: Object;
  public headers = [];
  public selectedIndicatorsList = [];
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  public get surgeReportSummaryData(): Array<any> {
    return this._rowDefs;
  }
  @Input('surgeReportSummaryData')
  public set surgeReportSummaryData(v: Array<any>) {
    this._rowDefs = v;
    this.setData(v);
  }
  public locationNumber = 0;
  public selectedResult: string;
  public sectionIndicatorsValues: Array<any>;
  private _sectionDefs: Array<any>;
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }

  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    this._sectionDefs = v;
    this.setColumns(v);
  }

  @Output()
  public indicatorSelected = new EventEmitter();
  private _rowDefs: Array<any>;

  ngOnInit() {
    this.setCellSelection();
  }
  public setData(sectionsData: any) {
    this.sectionIndicatorsValues = sectionsData;

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

  public setColumns(sectionsData: Array<any>) {
    this.headers = [];
    const defs = [];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      const header = {
        label: section.sectionTitle ,
        value: i
      };
      this.headers.push(header);
      created.children = [];
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < section.indicators.length; j++) {
        const sectionIndicatorValues = [];
        let indicatorValue = '-';
        const indicatorDefinition = section.indicators[j].indicator;
        if (this.sectionIndicatorsValues[indicatorDefinition] || this.sectionIndicatorsValues[indicatorDefinition] === 0) {
          indicatorValue = this.sectionIndicatorsValues[indicatorDefinition];
        }
        sectionIndicatorValues.push([indicatorValue]);
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          description: section.indicators[j].description,
          location: this.sectionIndicatorsValues['location_uuid'],
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

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }
  public findPage(pageMove) {
    if (pageMove === 'next') {
      const i = this.locationNumber + 1;
      this.locationNumber = i;
      this.sectionIndicatorsValues = this.surgeReportSummaryData[i];
      this.setColumns(this.sectionDefs);
    } else {
      const i = this.locationNumber - 1;
      if (i >= 0) {
        this.sectionIndicatorsValues = this.surgeReportSummaryData[i];
        this.setColumns(this.sectionDefs);
      }

    }
  }

  private setCellSelection(col?) {
    if (col) {
      const selectedIndicator = { headerName: col.headerName, field: col.field , location: col.location };
      this.indicatorSelected.emit(selectedIndicator);
    } else {
      this.gridOptions.rowSelection = 'single';
      this.gridOptions.onCellClicked = e => {
        const selectedIndicator = { headerName: e.colDef.headerName, field: e.colDef.field, location: e.data.location_uuid };
        this.indicatorSelected.emit(selectedIndicator);
      };
    }
  }
  public downloadPdf() {

    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 200;
      const pageHeight = 287;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('P', 'mm', 'a4'); // A4 size page of PDF
      let position = 15;
      pdf.setFontSize(20);
      pdf.text(10, 10, 'Surge Report');
      pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('Ampath Surge Report.pdf');
    });
  }
  public selectedIndicators() {
    this.setColumns(this.sectionDefs);
    const value = [];
    if (this.selectedIndicatorsList.length) {
      this.selectedIndicatorsList.forEach( indicator => {
          value.push(this.gridOptions.columnDefs[indicator]);
      });
      this.gridOptions.columnDefs = value;
    } else {
     this.setColumns(this.sectionDefs);
    }
  }
}
