import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-otz-register-tabular-table',
  templateUrl: 'otz-register-tabular.component.html',
  styleUrls: ['./otz-register-tabular.component.css']
})
export class OTZRegisterTabularComponent implements OnInit, OnChanges {
  public startDate: any;
  public endDate: any;
  public locationUuids: any;
  public indicator = '';
  @Input() public reportDef = [];

  public gridOptions: any = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    onGridSizeChanged: () => {},
    onGridReady: () => {}
  };

  public moh412SummaryColdef = [];
  public data = [];
  @Input() public moh412Data: Array<any> = [];
  @Input() public totalsData: Array<any> = [];
  @Input() public params: any;
  public pinnedBottomRowData = [];

  constructor(private router: Router, public route: ActivatedRoute) {}

  public ngOnInit() {}
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.reportDef) {
      if (changes.reportDef.currentValue.length > 0) {
        this.generateColDefs();
      }
    }
    if (changes.moh412Data) {
      if (changes.moh412Data.currentValue.length > 0) {
        this.data = [];
        this.data = changes.moh412Data.currentValue;
        this.generateRowData();
        this.generatePinnedBottomRowDataRow(changes.totalsData.currentValue);
      }
    }
  }

  public generateColDefs() {
    const cols = [];
    cols.push({
      headerName:
        this.params.locationType === 'primary_care_facility'
          ? 'PrimaryCare Facility'
          : 'Serial Counter',
      width: 100,
      field: 'location',
      pinned: true
    });
    this.reportDef.forEach((col: any) => {
      const page = col.page;
      const pageBody = col.pageBody;
      cols.push({
        headerName: page,
        width: 140,
        field: 'screening_method',
        children: pageBody.map((b: any) => {
          return {
            headerName: b.sectionTitle,
            field: b.sectionTitle,
            width: 100,
            children: b.sections.map((s: any) => {
              return {
                headerName: s.name,
                field: s.name,
                width: 100,
                children: s.body.map((body: any) => {
                  return {
                    headerName: body.title,
                    field: body.title,
                    width: 100,
                    children: body.indicators.map((i: any) => {
                      return {
                        headerName: i.label,
                        field: i.indicator,
                        width: 100,
                        cellRenderer: (column: any) => {
                          if (typeof column.value === 'undefined') {
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
          };
        })
      });
    });
    this.moh412SummaryColdef = cols;
  }

  public generateRowData() {}
  public onCellClick($event: any) {
    const indicator = $event.colDef.field;
    this.locationUuids = $event.data.location_uuid;
    this.indicator = indicator;
    const params = this.generateUrlParams();
    this.navigateToPatientList(params);
  }
  public generateUrlParams() {
    return {
      startDate: this.params.startDate,
      endDate: this.params.endDate,
      locationUuids: this.locationUuids,
      locationType: this.params.locationType,
      indicators: this.indicator
    };
  }

  public navigateToPatientList(params: any) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: params
    });
  }
  public generatePinnedBottomRowDataRow(totalsData: Array<any>) {
    this.pinnedBottomRowData = totalsData;
  }
}
