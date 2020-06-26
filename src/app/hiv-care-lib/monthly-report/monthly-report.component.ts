import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
})
export class MonthlyReportComponent implements OnInit {
  public isBusy = false;
  public errorMessage = '';

  public dashboards: Array<any> = [
  ];
  constructor(public router: Router,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.dashboards = [
      { 'title': 'Monthly Report', 'description': 'PrEP Monthly Report', 'url': 'prep-report', 'icon': 'fa' }
    ];
  }

  public viewDashboard(dashboard: any) {
    this.router.navigate([dashboard.url], {
      relativeTo: this.route
    });
  }

}
