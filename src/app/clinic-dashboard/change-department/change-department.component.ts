import { Router } from '@angular/router';
import { LocalStorageService } from '../../utils/local-storage.service';
import { DepartmentSelectComponent } from '../../department-select/department-select.component';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'analytics-department-select',
  templateUrl: '../../department-select/department-select.component.html',
  styleUrls: ['../../department-select/department-select.component.css']
})
export class ChangeDepartmentComponent
  extends DepartmentSelectComponent
  implements OnInit
{
  public clinicDashboardConf: any = require('../../shared/dynamic-route/schema/clinic.dashboard.conf.json');

  constructor(
    public locaStorageService: LocalStorageService,
    public router: Router
  ) {
    super(locaStorageService, router);
  }

  public ngOnInit() {
    const dashboard = '/clinic-dashboard';
    this.getCurrentDepartment();
    this.clinicDashboardDepts(this.clinicDashboardConf.departments, dashboard);
  }
}
