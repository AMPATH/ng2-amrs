import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-analytics-monthly-reports',
  templateUrl: './data-analytics-monthly-reports.component.html',
  styleUrls: ['./data-analytics-monthly-reports.component.css']
})
export class DataAnalyticsMonthlyReportComponent implements OnInit {
  public isBusy = false;
  public errorMessage = '';

  public dashboards: Array<any> = [];
  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit() {
    this.dashboards = [
      {
        title: 'PrEP Monthly Report (deprecated)',
        description: '',
        url: 'prep-report',
        icon: 'fa'
      },
      {
        title: 'New PrEP Monthly Report',
        description: '',
        url: 'prep-monthly-report',
        icon: 'fa'
      },
      {
        title: 'TB Treatment Therapy report',
        description: '',
        url: 'ipt-report',
        icon: 'fa'
      },
      {
        title: 'Cervical Cancer Screening',
        description: '',
        url: 'moh-412-report',
        icon: 'fa'
      },
      {
        title: 'Patient Gains and Losses',
        description: '',
        url: 'patient-gains-and-losses',
        icon: 'fa'
      },
      {
        title: 'Plhiv Ncd v2 report',
        description: '',
        url: 'plhiv-ncd-v2-monthly-report',
        icon: 'fa'
      }
    ];
  }

  public viewDashboard(dashboard: any) {
    this.router.navigate([dashboard.url], {
      relativeTo: this.route
    });
  }
}
