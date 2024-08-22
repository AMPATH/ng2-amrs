import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { ColDef, ColGroupDef } from 'ag-grid';
import { AgGridNg2 } from 'ag-grid-angular';
import { KhisAirModuleResourceService } from 'src/app/etl-api/khis-air-resource.service';
// import {KhisAirModuleResourceService} from ""
@Component({
  selector: 'moh-731-tabular',
  templateUrl: 'moh-731-tabular.component.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class Moh731TabularComponent implements OnInit {
  public gridOptions: any = {
    columnDefs: []
  };
  public headerTitles = [];

  @Output() public indicatorSelected = new EventEmitter<any>();

  // tslint:disable-next-line:no-input-rename
  @Input('rowData')
  public data: Array<any> = [];

  @Input('startDate')
  public startDate: any;

  @Input('endDate')
  public endDate: any;

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;

  private _sectionDefs: Array<any>;
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }
  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    // console.log('changing section def', v);
    this._sectionDefs = v;
    this.setColumns(v);
  }

  @Input() public isReleased: boolean;

  constructor(
    private khisAirModuleResourceService: KhisAirModuleResourceService
  ) {}

  public ngOnInit() {
    this.setCellSelection();
  }

  public setColumns(sectionsData: Array<any>) {
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
      this.headerTitles.push(section.sectionTitle);
    }

    this.gridOptions.columnDefs = defs;
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }

  private setCellSelection() {
    this.gridOptions.rowSelection = 'single';
    this.gridOptions.onCellClicked = (e: any) => {
      const selectedIndicator = {
        indicator: e.colDef.field,
        value: e.value,
        location: e.data.location_uuid
      };
      this.indicatorSelected.emit(selectedIndicator);
    };
  }

  public cleanHeaderTitles(titles: string[]): string[] {
    return titles.map((title) => title.replace(/^\d+\.\s*/, '').trim());
  }

  public getCombinedData() {
    const headerTitles = this.cleanHeaderTitles(this.headerTitles);
    const month = new Date(this.startDate).toLocaleString('default', {
      month: 'long'
    });

    if (this.agGrid && this.agGrid.api && this.agGrid.columnApi) {
      // Get all rows data
      const rowData: any[] = [];
      this.agGrid.api.forEachNode((node: any) => rowData.push(node.data));

      // Get column definitions
      const allColumns = this.agGrid.columnApi.getAllColumns();
      const columnDefs = allColumns.map((col) => col.getColDef());

      // Combine data and columns
      const combinedData = rowData.map((row) => {
        const rowDataWithColumns = {};
        columnDefs.forEach((colDef: ColDef) => {
          rowDataWithColumns[colDef.headerName] = row[colDef.field];
        });
        return {
          month: month,
          // headerTitles,
          Location: row.location,
          ...rowDataWithColumns
          // rowDataWithColumns: {
          //   ...rowDataWithColumns
          // }
        };
      });

      this.khisAirModuleResourceService
        .postMOH731ExtractedData(combinedData)
        .subscribe(
          (response: any) => {
            console.log('API Response:', response);
            // Handle successful response here
          },
          (error: any) => {
            console.error('API Error:', error);
          }
        );
    }
  }
}
