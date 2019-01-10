import { Router } from '@angular/router';
import { LocalStorageService } from './../../utils/local-storage.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';


@Component({
    selector: 'department-select',
    templateUrl: 'department-select.component.html',
    styleUrls: ['./department-select.component.css']
  })
export class DepartmentSelectComponent implements OnInit {

public clinicDashboardConf: any = require('../../shared/dynamic-route/schema/clinic.dashboard.conf.json');
public departments: any;
public currentDepartment = '';

constructor(private _locaStorageService: LocalStorageService, private _router: Router) {}

public ngOnInit() {
    this.getCurrentDepartment();
    this.clinicDashboardDepts();
}
public clinicDashboardDepts() {
    const departments = this.clinicDashboardConf.departments;
    this.departments = [];
    _.each(departments, (department: any) => {
        if (department.baseRoute !== 'general') {

            const specDept = {
                'name': department.departmentName,
                'baseRoute':  department.baseRoute
            };
            this.departments.push(specDept);

        }
    });
}

public setDefaultDepartment(department) {
    const departmentObj = [{
       'itemName': department.name,
       'id': ''
    }];
    this._locaStorageService.setItem('userDefaultDepartment', JSON.stringify(departmentObj) );
    this._router.navigate(['../clinic-dashboard']);

}

public getCurrentDepartment() {
    const currentDepartmentObj: any = JSON.parse(this._locaStorageService.getItem('userDefaultDepartment'));
    if (typeof currentDepartmentObj !== 'undefined') {
        this.currentDepartment = currentDepartmentObj[0].itemName;
    } else {
        this.currentDepartment = 'HIV';
    }

}

}
