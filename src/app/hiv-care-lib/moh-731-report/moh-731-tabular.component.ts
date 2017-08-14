import { Component, OnInit, ChangeDetectionStrategy,
  Input, Output, ViewChild, EventEmitter } from '@angular/core';
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
    @Output() onColumnClick = new EventEmitter<any>();

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

    constructor() { }

    ngOnInit() {

    }

    setColumns(sectionsData: Array<any>) {
        let defs = [];
        defs.push({
            headerName: 'Location',
            field: 'location',
            pinned: 'left'
        });
        for (let i = 0; i < sectionsData.length; i++) {
            let section = sectionsData[i];
            let created: any = {};
            created.headerName = section.sectionTitle;
            created.children = [];
            for (let j = 0; j < section.indicators.length; j++) {
                let child: any = {
                    headerName: section.indicators[j].label,
                    onCellClicked: (column) => {
                      this.onColumnClick.emit(column);
                    },
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
}
