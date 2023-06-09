import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tx-reports-dashboard',
  templateUrl: './tx-reports-dashboard.component.html',
  styleUrls: ['./tx-reports-dashboard.component.css']
})
export class TxReportsDashboardComponent implements OnInit {
  public isBusy = false;
  public errorMessage = '';

  public dashboards: Array<any> = [];
  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit() {
    this.dashboards = [
      {
        title: 'TX_ML Report',
        description: '',
        url: 'tx-ml-report',
        icon: 'fa'
      },
      {
        title: 'TX_NEW Report',
        description: '',
        url: 'tx-new-report',
        icon: 'fa'
      },
      {
        title: 'TX_CURR Report',
        description: '',
        url: 'tx-curr-report',
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
