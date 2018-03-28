import {
    Component, OnInit, ChangeDetectionStrategy,
    Input, Output, ViewChild, EventEmitter
} from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
@Component({
    selector: 'moh-731-tabular',
    templateUrl: 'moh-731-tabular.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class Moh731TabularComponent implements OnInit {
    public gridOptions: any = {
        columnDefs: []
    };

    @Output() public indicatorSelected = new EventEmitter<any>();

    @Input('rowData')
    public data: Array<any> = [];

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

    constructor() {

    }

    public ngOnInit() {
        this.setCellSelection();
    }

    public setColumns(sectionsData: Array<any>) {
        let defs = [];
        defs.push({
            headerName: 'Location',
            field: 'location',
            pinned: 'left'
        });
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < sectionsData.length; i++) {
            let section = sectionsData[i];
            let created: any = {};
            created.headerName = section.sectionTitle;
            created.children = [];
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < section.indicators.length; j++) {
                let child: any = {
                    headerName: section.indicators[j].label,
                    field: section.indicators[j].indicator
                };
                created.children.push(child);
            }
            defs.push(created);
        }

        this.gridOptions.columnDefs = defs;
        if (this.agGrid && this.agGrid.api) {
            this.agGrid.api.setColumnDefs(defs);
        }
    }

    private setCellSelection() {
        this.gridOptions.rowSelection = 'single';
        this.gridOptions.onCellClicked = (e) => {
            if (e.data.location_uuid) {
                let selectedIndicator = {
                    indicator: e.colDef.field,
                    value: e.value,
                    location: e.data.location_uuid
                };
                // console.log('selected', selectedIndicator);
                this.indicatorSelected.emit(selectedIndicator);
            }
        };
    }
}
