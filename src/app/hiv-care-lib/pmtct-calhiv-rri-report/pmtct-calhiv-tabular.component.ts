import { take } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'pmtct-calhiv-tabular',
  templateUrl: './pmtct-calhiv-tabular.component.html',
  styleUrls: []
})
export class PmtctCalhivRriTabularComponent implements OnInit, OnChanges {
  @Input() rriMonthlySummary = [];
  @Input() params: any;
  @Input() sectionDefs: any;
  @Input() reportTitle = '';
  @Input() reportType = '';
  public rriSummaryColdef = [];
  public data = [];
  public rrisummaryGridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    groupDefaultExpanded: -1,
    onGridSizeChanged: () => {},
    onGridReady: () => {}
  };

  constructor(private _router: Router, private _route: ActivatedRoute) {}

  public ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.rriMonthlySummary) {
      this.processSummaryData(this.rriMonthlySummary);
    }
    if (changes.sectionDefs) {
      this.generateColumns(this.sectionDefs);
    }
  }

  public processSummaryData(results) {
    this.data = results;
    this.setRowData(results);
  }
  public onCellClicked(event) {
    this.goToPatientList(event);
  }

  public generateColumns(sectionsData) {
    const defs = [];
    defs.push({
      headerName: 'Location',
      field: 'location',
      pinned: 'left'
    });
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      created.children = [];
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < section.indicators.length; j++) {
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator
        };
        created.children.push(child);
      }
      defs.push(created);
    }

    this.rriSummaryColdef = defs;
  }

  public translateIndicator(indicator: string) {
    return indicator
      .toLowerCase()
      .split('_')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  public setRowData(allRowsData) {
    const finalRows = [];
    _.each(allRowsData, (rowData) => {
      const rowObj = {};
      _.each(rowData, (data, index) => {
        rowObj[index] = data;
      });
      finalRows.push(rowObj);
    });

    this.data = finalRows;
  }

  public goToPatientList(data) {
    // let queryParams = this.route.snapshot.params;
    const params: any = {
      locationUuids: data.data.location_uuid,
      indicators: data.colDef.field,
      startDate: this.params.startDate,
      endDate: this.params.endDate
    };

    this._router.navigate(['./patient-list'], {
      relativeTo: this._route,
      queryParams: params
    });
  }
}
