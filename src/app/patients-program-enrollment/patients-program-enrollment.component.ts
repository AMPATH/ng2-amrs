import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute , Params } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PatientProgramEnrollmentService } from
    './../etl-api/patient-program-enrollment.service';
import { DepartmentProgramsConfigService } from
'./../etl-api/department-programs-config.service';

@Component({
    selector: 'patients-program-enrollment',
    templateUrl: './patients-program-enrollment.component.html',
    styleUrls: ['./patients-program-enrollment.component.css']
})

export class PatientsProgramEnrollmentComponent implements OnInit {

    public title: string = 'Active patient Program Enrollment';
    public params: any;
    public showSummary: boolean = false;
    @Input() public filterSelected: any[];

    public busyIndicator: any = {
        busy: false,
        message: '' // default message
    };

    public startDate: string = '';
    public endDate: string = '';
    public selectedLocation: any;
    public replaceSummary: boolean = true;
    public departmentProgConfig: any = [];
    public enrolledPatientList: any = [];
    public enrolledSummary: any = [];

    constructor(
        private _patientProgramEnrollmentService: PatientProgramEnrollmentService,
        private _departmentProgramService: DepartmentProgramsConfigService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    public ngOnInit() {

        this.getDepartmentConfig();
    }

    public getDepartmentConfig() {

        this._departmentProgramService.getDartmentProgramsConfig()
          .subscribe((results) => {
            if (results) {
              this.departmentProgConfig = results;
            }
          });
    }

    public selectedFilter($event) {

        this.enrolledSummary = [];
        this.enrolledPatientList = [];
        this.replaceSummary = true;
        this.setQueryParams($event);
        let queryParams = this.getQueryParams();
        this.showSummary = true;
        this.getEnrollmentSummary(queryParams);

    }

    public filterReset($event) {

        this.enrolledSummary = [];
        this.enrolledPatientList = [];
        this.showSummary = false;

    }

    public getEnrollmentSummary(params) {

        this.busyIndicator = {
            busy: true,
            message: 'Fetching Patient Enrollments...'
         };

        if (typeof params !== 'undefined') {

                this._patientProgramEnrollmentService.getActivePatientEnrollmentSummary(params)
                .subscribe((enrollmentSummary) => {
                    if (enrollmentSummary) {
                        this.processEnrollmentSummary(enrollmentSummary);
                    }

                    this.busyIndicator = {
                        busy: false,
                        message: ''
                    };
                });

    }

}

public processEnrollmentSummary(enrollmentSummary: any) {

    let i = 1;
    let enrolledSummaryList = [];
    let programMap = new Map();
    let totalCount = 0;

    _.each(enrollmentSummary, (summary: any) => {

         let programUuid = summary.program_uuid;
         let programName = summary.program_name;
         let programCount = summary.enrollment_count;

         _.each(this.departmentProgConfig, (department: any) => {
            let programs = department.programs;
            let departmentName = department.name;
            _.each(programs, (program: any) => {
                let uuid = program.uuid;
                if (uuid === programUuid) {

                    let summaryObj = {
                        'dept': departmentName,
                        'program': programName,
                        'enrolled': programCount,
                        'programUuid': uuid
                    };

                    totalCount += programCount;

                    enrolledSummaryList.push(summaryObj);
                }
            });
      });

    });

    let totalObj = {
        'dept': 'Total',
        'program': '#Total',
        'enrolled': totalCount,
        'programUuid': ''
    };

    enrolledSummaryList.push(totalObj);

    this.enrolledSummary = enrolledSummaryList;

}

    public getQueryParams() {

        return this.params;

    }

    public setQueryParams(params: any) {

        if (typeof params.startDate === 'undefined' &&
            typeof params.endDate === 'undefined' &&
            typeof params.locationUuids === 'undefined' &&
            typeof params.programType === 'undefined') {
            this.params = params;
        }else {

            this.endDate = params.endDate;
            this.startDate = params.startDate;
            this.selectedLocation = params.locationUuids;
            this.params = {
                'startDate': params.startDate,
                'endDate': params.endDate,
                'locationUuids': params.locationUuids,
                'programType': params.programType
            };

        }

    }

    public showEnrolledSummary() {
        this.showSummary = true;
    }

    public getProgramEnrollments($event) {
        this.router.navigate(['patient-list']
        , {
          relativeTo: this.route,
          queryParams: $event
        });
    }

}
