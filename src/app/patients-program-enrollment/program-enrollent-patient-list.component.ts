import { Component, OnInit, OnDestroy , Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute , Params } from '@angular/router';
import { Location } from '@angular/common';
import { PatientProgramEnrollmentService } from './../etl-api/patient-program-enrollment.service';
import * as _ from 'lodash';
import * as Moment from 'moment';

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

    public enrollmentColdef: any = [
        { headerName: 'No', field: 'no' , minWidth: 50},
        { headerName: 'Identifier', field: 'identifier' , minWidth: 200,
        cellRenderer: (column) => {
            return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
        },
        onCellClicked: (column) => {
            this.redirectTopatientInfo(column.data.patient_uuid);
        }
        },
        { headerName: 'Name', field: 'name' , minWidth: 200},
        { headerName: 'Program', field: 'program',   minWidth: 600,
        cellRenderer : (params) => {
            return '<div>' + params.value + '</div>';
        },
        cellStyle: {
            'white-space': 'normal',
            'fontsize': '14px !important',
            'overflow-y': 'scroll',
            'word-wrap': 'break-word'}},
    ];

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
            this.gridOptions.api.sizeColumnsToFit();
        },
        getRowHeight : (params) => {
            // assuming 50 characters per line, working how how many lines we need
            let height = params.data.program.length / 30;
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
        private _patientProgramEnrollmentService: PatientProgramEnrollmentService) {
    }

    public ngOnInit() {
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

                this._patientProgramEnrollmentService.getActivePatientEnrollmentPatientList(params)
                .subscribe((enrollments) => {
                    if (enrollments) {
                        this.processEnrollments(enrollments);
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
        let enrolledPatientList = [];
        let trackPatientMap = new Map();
        let programMap = new Map();
        let patientIndex  = 0;

        _.each((enrollments), (enrollment: any) => {

            let patientUuid = enrollment.person_uuid;
            let patientObjMap = trackPatientMap.get(patientUuid);
            let completedDetail = '';
            if (enrollment.date_completed != null) {

                completedDetail = '( Completed - ' +
                Moment(enrollment.date_completed).format('DD-MMM-YYYY') + ') ';

            }

            let enrollmentDateDetail = enrollment.program_name + '( Enrolled - ' +
            Moment(enrollment.enrolled_date).format('DD-MMM-YYYY') + ')' +  completedDetail;

            if (typeof patientObjMap === 'undefined') {

            let patient = {
                no: i,
                name: enrollment.patient_name,
                identifier: enrollment.patient_identifier,
                program: enrollmentDateDetail,
                patient_uuid : patientUuid
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

    let enrolledPatientList = [];

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
