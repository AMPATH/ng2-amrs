import { dataAnalyticsDashboardRouting } from './../../../data-analytics-dashboard/data-analytics-dashboard-routes';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-ncd-report-table',
  templateUrl: './ncd-report-table.component.html',
  styleUrls: ['./ncd-report-table.component.css']
})
export class NcdReportTableComponent implements OnInit, OnChanges {
  @Input() public patientGainAndLoseData = [];
  @Input() public sections: any;
  @Input() public params = {
    startingMonth: '',
    endingMonth: ''
  };
  @Output() public indicatorSelected = new EventEmitter();
  @Input() public totalsRow = [];
  public patientGainAndLoseSummaryData = [];
  public gainsLossesColdef = [];
  public data = [];
  public gainsLossesGridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    groupDefaultExpanded: -1,
    onGridSizeChanged: () => {},
    onGridReady: () => {}
  };
  public reportTitle = 'Analysis of Gains and Losses';
  public pinnedBottomRowData = [];

  constructor() {}

  public ngOnInit() {}
  public ngOnChanges(changes: SimpleChanges): void {
    this.data = [];
    if (changes.patientGainAndLoseData) {
      if (!Array.isArray(changes.patientGainAndLoseData.currentValue)) {
        this.data.push(changes.patientGainAndLoseData.currentValue);
      } else {
        this.data = changes.patientGainAndLoseData.currentValue;
      }
      this.generatePinnedBottomRowDataRow(changes.totalsRow.currentValue);
    }

    if (changes.sections) {
      if (Array.isArray(changes.sections.currentValue)) {
        this.generateReportColDefs(changes.sections.currentValue);
      }
    }
  }

  public generateReportColDefs(sectionDef: any): void {
    const cols: any = [
      {
        headerName: 'Location',
        width: 150,
        field: 'location',
        pinned: true
      },
      {
        headerName: 'Month',
        width: 150,
        field: 'end_date',
        pinned: true
      }
    ];
    sectionDef.forEach((c: any) => {
      cols.push({
        headerName: c.page,
        field: c.page,
        children: c.pageBody.map((b: any) => {
          return {
            headerName: b.sectionTitle,
            field: b.sectionTitle,
            width: 100,
            children: b.sections.map((s: any) => {
              return {
                headerName: s.name,
                field: s.name,
                children: s.body.map((i: any) => {
                  return {
                    headerName: '',
                    width: 100,
                    field: i.indicator,
                    cellRenderer: (column: any) => {
                      if (
                        typeof column.value === 'undefined' ||
                        column.value === null
                      ) {
                        return 0;
                      } else {
                        return `<a>${column.value}</a>`;
                      }
                    }
                  };
                })
              };
            })
          };
        })
      });
    });
    this.gainsLossesColdef = cols;
  }

  public onCellClicked($event: any) {
    const indicator = $event.colDef.field;
    const title = this.translateIndicator(indicator);
    const location = $event.data.location_uuid;
    const payload = {
      value: indicator,
      header: title,
      location: location
    };
    this.indicatorSelected.emit(payload);
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

  public generatePinnedBottomRowDataRow(totalsRowData: any): void {
    this.pinnedBottomRowData = totalsRowData;
  }
}
