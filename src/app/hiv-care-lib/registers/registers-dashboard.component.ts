import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registers-dashboard',
  templateUrl: './registers-dashboard.component.html'
})
export class RegistersDashboardComponent implements OnInit {
  public isBusy = false;
  public errorMessage = '';

  public dashboards: Array<any> = [];
  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit() {
    this.dashboards = [
      {
        title: 'OTZ Register',
        description: '',
        url: 'otz-register',
        icon: 'fa'
      },
      {
        title: 'Jua Mtoto Wako Register',
        description: '',
        url: 'jua-mtoto-wako-register',
        icon: 'fa'
      },
      {
        title: 'Defaulter Tracing Register',
        description: '',
        url: 'defaulter-tracing-register',
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
