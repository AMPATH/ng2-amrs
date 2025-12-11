import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.css']
})
export class RegistersComponent implements OnInit {
  public isBusy = false;
  public errorMessage = '';

  public dashboards: Array<any> = [];
  constructor(public router: Router, public route: ActivatedRoute) {}

  ngOnInit() {
    this.dashboards = [
      {
        title: 'MOH-408: HEI Register',
        description: '',
        url: 'hei-register',
        icon: 'fa'
      },
      {
        title: 'MOH-405: ANC Register',
        description: '',
        url: 'anc-register',
        icon: 'fa'
      },
      {
        title: 'MOH-407: Nutrition Service Register',
        description: '',
        url: 'nutrition-register',
        icon: 'fa'
      },
      {
        title: 'MOH-333: Martenity Register',
        description: '',
        url: 'maternity-register',
        icon: 'fa'
      },
      {
        title: 'MOH-362: HTS Lab Refferal & Linkage Register',
        description: '',
        url: 'htsrefferallinkage-register',
        icon: 'fa'
      },
      {
        title: 'MOH-406: PNC Register',
        description: '',
        url: 'pnc-register',
        icon: 'fa'
      },
      {
        title: 'Defaulter Tracing Register',
        description: '',
        url: 'defaultertracing-register',
        icon: 'fa'
      },
      {
        title: 'MOH-267: PrEP Daily Activity Register',
        description: '',
        url: 'prepdaily-register',
        icon: 'fa'
      },
      {
        title: 'MOH-366: Care and Treatment Daily Activity',
        description: '',
        url: 'cntdaily-register',
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
