import { take } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import * as _ from 'lodash';
import { PatientProgramEnrollmentService } from './../etl-api/patient-program-enrollment.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';

@Component({
  selector: 'patients-program-enrollment',
  templateUrl: './patients-program-enrollment.component.html',
  styleUrls: ['./patients-program-enrollment.component.css']
})
export class PatientsProgramEnrollmentComponent implements OnInit {
  public title = 'Active patient Program Enrollment';
  public params: any;
  public showSummary = false;
  @Input() public filterSelected: any[];

  public busyIndicator: any = {
    busy: false,
    message: '' // default message
  };

  public startDate = '';
  public endDate = '';
  public selectedLocation: any;
  public replaceSummary = true;
  public departmentProgConfig: any = [];
  public enrolledPatientList: any = [];
  public enrolledSummary: any = [];
  public error: any = {
    error: false,
    message: ''
  };

  constructor(
    private _patientProgramEnrollmentService: PatientProgramEnrollmentService,
    private _departmentProgramService: DepartmentProgramsConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.getDepartmentConfig();
  }

  public getDepartmentConfig() {
    this._departmentProgramService
      .getDartmentProgramsConfig()
      .pipe(take(1))
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
    const queryParams = this.getQueryParams();
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
    this.error = {
      error: false,
      message: ''
    };

    if (typeof params !== 'undefined') {
      this._patientProgramEnrollmentService
        .getActivePatientEnrollmentSummary(params)
        .pipe(take(1))
        .subscribe(
          (enrollmentSummary) => {
            if (enrollmentSummary) {
              this.processEnrollmentSummary(enrollmentSummary.result);
            }

            this.busyIndicator = {
              busy: false,
              message: ''
            };
          },
          (error) => {
            this.busyIndicator = {
              busy: false,
              message: ''
            };
            this.error = {
              error: true,
              message: error.error.message ? error.error.message : ''
            };
          }
        );
    }
  }

  public processEnrollmentSummary(enrollmentSummary: any) {
    const enrolledSummaryList = [];
    let totalCount = 0;

    _.each(enrollmentSummary, (summary: any) => {
      const programUuid = summary.program_uuid;
      const programName = summary.program_name;
      const programCount = summary.enrollment_count;

      _.each(this.departmentProgConfig, (department: any) => {
        const programs = department.programs;
        const departmentName = department.name;
        _.each(programs, (program: any) => {
          const uuid = program.uuid;
          if (uuid === programUuid) {
            const summaryObj = {
              dept: departmentName,
              program: programName,
              enrolled: programCount,
              programUuid: uuid
            };

            totalCount += programCount;

            enrolledSummaryList.push(summaryObj);
          }
        });
      });
    });

    const totalObj = {
      dept: 'Total',
      program: '#Total',
      enrolled: totalCount,
      programUuid: ''
    };

    enrolledSummaryList.push(totalObj);

    this.enrolledSummary = enrolledSummaryList;
  }

  public getQueryParams() {
    return this.params;
  }

  public setQueryParams(params: any) {
    if (
      typeof params.startDate === 'undefined' &&
      typeof params.endDate === 'undefined' &&
      typeof params.locationUuids === 'undefined' &&
      typeof params.programType === 'undefined'
    ) {
      this.params = params;
    } else {
      this.endDate = params.endDate;
      this.startDate = params.startDate;
      this.selectedLocation = params.locationUuids;
      this.params = {
        startDate: params.startDate,
        endDate: params.endDate,
        locationUuids: params.locationUuids,
        programType: params.programType
      };
    }
  }

  public showEnrolledSummary() {
    this.showSummary = true;
  }

  public getProgramEnrollments($event) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: $event
    });
  }
}
