import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-otz-register',
  templateUrl: './otz-register.component.html',
  styleUrls: ['./otz-register.component.css']
})
export class OtzRegisterComponent implements OnInit {
  public enabledControls = 'monthControl';
  public _month: string;
  public reportName = 'OTZ Register';
  counterArray = Array(18)
    .fill(0)
    .map((_, index) => index + 1);
  counter = Array(8)
    .fill(0)
    .map((_, index) => index + 1);
  constructor(public router: Router, public route: ActivatedRoute) {
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment()
            .subtract(1, 'M')
            .endOf('month')
            .format('YYYY-MM-DD'))
        : (this._month = data.month);
    });
  }
  public ngOnInit() {}

  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
  }

  public generateReport(): void {
    return;
  }
  exportTableToExcel(): void {
    const table = document.getElementById('otzRegister');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'otz_register.xlsx');
  }
}