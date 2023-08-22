import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html'
})
export class MonthlyReportComponent implements OnInit {
  public isBusy = false;
  public errorMessage = '';

  public dashboards: Array<any> = [];
  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit() {
    this.dashboards = [
      {
        title: 'PrEP Monthly Report',
        description: '',
        url: 'prep-report',
        icon: 'fa'
      },
      {
        title: 'TB Treatment Therapy report',
        description: '',
        url: 'ipt-report',
        icon: 'fa'
      },
      {
        title: 'Cross Border and Ovc Report',
        description: '',
        url: 'cross-border-report',
        icon: 'fa'
      },
      {
        title: 'Patient gains and loses',
        description: '',
        url: 'patient-gains-and-loses',
        icon: 'fa'
      },
      {
        title: 'Cervical Cancer Screening',
        description: '',
        url: 'moh-412-report',
        icon: 'fa'
      },
      {
        title: 'Covid-19 Monthly Report',
        description: '',
        url: 'covid-19-monthly-report',
        icon: 'fa'
      },
      {
        title: 'MNCH Monthly Report',
        description: '',
        url: 'mnch-report',
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
