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
export class ChangeDepartmentComponent extends DepartmentSelectComponent implements OnInit {

    public analyticsDashboardConf: any = require('../../shared/dynamic-route/schema/analytics.dashboard.conf.json');

    constructor(public locaStorageService: LocalStorageService, public router: Router) {
        super(locaStorageService, router);
    }

    public ngOnInit() {
        const dashboard = '/data-analytics';
        this.getCurrentDepartment();
        this.clinicDashboardDepts(this.analyticsDashboardConf.departments, dashboard);
    }

}
