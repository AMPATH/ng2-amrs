import { Component, OnInit, Input, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import 'datatables.net-scroller-bs/css/scroller.bootstrap.css';
import 'datatables.net-fixedcolumns-bs/css/fixedColumns.bootstrap.css';
import 'datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.css';
declare var $: any;
@Component({
    selector: 'data-tables',
    templateUrl: 'data-tables.component.html'
})
export class DataTablesComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChild('dataTable') dataTable;
    @Input() options: {};
    table: any;
    constructor() { }

    ngOnInit() {
        if (!this.options) throw new Error(`Attribute 'options' is required`);
    }

    ngOnDestroy() {
        this.table.destroy();
        this.table = null;
    }
    ngAfterViewChecked() {
        if (this.table) {
            this.table.$(this.options);
        } else {
            this.table = $(this.dataTable.nativeElement).DataTable(this.options);
        }
    }
}
