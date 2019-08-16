
import {take} from 'rxjs/operators';
import { Component, OnInit, OnDestroy , Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute , Params } from '@angular/router';
import { Location } from '@angular/common';
import { PatientProgramEnrollmentService } from './../etl-api/patient-program-enrollment.service';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

@Component({
    selector: 'program-enrollment-patient-list',
    templateUrl: './program-enrollent-patient-list.component.html',
    styleUrls: ['./program-enrollent-patient-list.component.css']
})

export class ProgramEnrollmentPatientListComponent implements OnInit, OnDestroy {

    public params: any;

    public enrolledPatientList: any = [];

    public startDate: string;
    public endDate: string;
    public busyIndicator: any = {
        busy: false,
        message: '' // default message
    };


    public defaultEnrollmentColdef: any = [
        { headerName: 'No', field: 'no' , width: 50},
        { headerName: 'Identifier', field: 'identifier' , width: 250,
        cellRenderer: (column) => {
            return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
        },
        onCellClicked: (column) => {
            this.redirectTopatientInfo(column.data.patient_uuid);
        }
        },
        { headerName: 'Name', field: 'name' , width: 250 },
        { headerName: 'Gender', field: 'gender', width: 100 },
        { headerName: 'Age', field: 'age', width: 100 },
        { headerName: 'Program', field: 'program', width: 500,
        cellRenderer : (params) => {
            return '<span>' + params.value + '</span>';
        },
        cellStyle: {
            'white-space': 'normal',
            'fontsize': '14px !important',
            'overflow-y': 'scroll',
            'word-wrap': 'break-word'}}
    ];

    public enrollmentColdef = [];

    public style = {
        marginTop: '20px',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
    };

    public gridOptions: any = {
        enableColResize: true,
        enableSorting : true,
        enableFilter : true,
        showToolPanel : false,
        paginationPageSize : 300,
        onGridSizeChanged : () => {
            // this.gridOptions.api.sizeColumnsToFit();
        },
        getRowHeight : (params) => {
            // assuming 50 characters per line, working how how many lines we need
            const height = params.data.program.length / 30;
            if ( height > 1) {
                   return (height + 1.5) * 10;
            } else {

                 return 25;
            }
        },
        getRowStyle : (params) => {
            return {'font-size': '14px', 'cursor': 'pointer'};
        }
    };

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _location: Location,
        private localStorageService: LocalStorageService,
        private _patientProgramEnrollmentService: PatientProgramEnrollmentService) {
    }

    public ngOnInit() {
        const userDefaultDepartment: any = JSON.parse(this.localStorageService.getItem('userDefaultDepartment'));
        if (userDefaultDepartment[0].itemName === 'HIV') {
            const hivColumns = [
                {
                    headerName: 'Phone Number',
                    width: 150,
                    field: 'phone_number'
                },
                {
                    headerName: 'Latest Appointment',
                    width: 200,
                    field: 'last_appointment'
                },
                {
                    headerName: 'Latest RTC Date',
                    width: 150,
                    field: 'latest_rtc_date'
                },
                {
                    headerName: 'Current Regimen',
                    width: 400,
                    field: 'cur_meds'
                },
                {
                    headerName: 'Latest VL',
                    width: 100,
                    field: 'latest_vl'
                },
                {
                    headerName: 'Latest VL Date',
                    width: 150,
                    field: 'latest_vl_date'
                },
                {
                  headerName: 'Previous VL',
                  width: 75,
                  field: 'previous_vl'
                },
                {
                  headerName: 'Previous VL Date',
                  width: 150,
                  field: 'previous_vl_date'
                },
                {
                  headerName: 'Nearest Center',
                  width: 150,
                  field: 'nearest_center'
                }
            ];
            this.enrollmentColdef = _.concat(this.defaultEnrollmentColdef, hivColumns as Array<object>);
        } else {
            this.enrollmentColdef = this.defaultEnrollmentColdef;
        }
        this._route
        .queryParams
        .subscribe((params) => {
        if (params) {
                this.getEnrolledPatientList(params);
            }
        }, (error) => {
            console.error('Error', error);
        });
    }

    public ngOnDestroy() {

    }
    public getEnrolledPatientList(params) {

        this.busyIndicator = {
            busy: true,
            message: 'Fetching Patient Enrollments...'
         };

        if (params.startDate) {
             this.startDate = params.startDate;
        }
        if (params.endDate) {
             this.endDate = params.endDate;
        }

        if (typeof params !== 'undefined') {

                this._patientProgramEnrollmentService.getActivePatientEnrollmentPatientList(params).pipe(
                take(1)).subscribe((enrollments) => {
                    if (enrollments) {
                        this.processEnrollments(enrollments.result);
                    }

                    this.busyIndicator = {
                        busy: false,
                        message: ''
                    };
                });

    }

}
    public processEnrollments(enrollments: any) {

        let i = 1;
        const trackPatientMap = new Map();

        _.each((enrollments), (enrollment: any) => {

            const patientUuid = enrollment.patient_uuid;
            const patientObjMap = trackPatientMap.get(patientUuid);
            let completedDetail = '';
            if (enrollment.date_completed != null) {

                completedDetail = '( Completed - ' +
                Moment(enrollment.date_completed).format('DD-MMM-YYYY') + ') ';

            }

            const enrollmentDateDetail = enrollment.program_name + '( Enrolled - ' +
            Moment(enrollment.date_enrolled).format('DD-MMM-YYYY') + ')' +  completedDetail;

            if (typeof patientObjMap === 'undefined') {

            const patient = {
                no: i,
                name: enrollment.person_name,
                identifier: enrollment.identifiers,
                program: enrollmentDateDetail,
                patient_uuid : patientUuid,
                age: enrollment.age,
                gender: enrollment.gender,
                phone_number: enrollment.phone_number,
                last_appointment: enrollment.last_appointment,
                latest_rtc_date: enrollment.latest_rtc_date,
                cur_meds: enrollment.cur_meds,
                latest_vl: enrollment.latest_vl,
                latest_vl_date: enrollment.latest_vl_date
            };

            trackPatientMap.set(patientUuid, patient);

            i++;

            } else {
                  // add second program to program to enrollment detail
                  patientObjMap.program = patientObjMap.program + ' </br>' + enrollmentDateDetail;
                  trackPatientMap.set(patientUuid, patientObjMap);

            }
        });


        this.sortPatientList(trackPatientMap);

 }

 public sortPatientList(patientMap) {

    const enrolledPatientList = [];

    patientMap.forEach((mapElement) => {

           enrolledPatientList.push(mapElement);
    });

    this.enrolledPatientList = enrolledPatientList;

}

public backToSummary() {

    this._location.back();

}

public exportPatientListToCsv() {
        this.gridOptions.api.exportDataAsCsv();
}
public redirectTopatientInfo(patientUuid) {

        if (patientUuid === undefined || patientUuid === null) {
            return;
          } else {

            this._router.navigate(['/patient-dashboard/patient/' + patientUuid +
            '/general/general/landing-page']);

          }
}

}
