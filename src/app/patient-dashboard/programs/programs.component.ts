import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../patient.service';
import { ProgramService } from './program.service';
import { Patient } from '../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-programs',
    templateUrl: './programs.component.html',
    styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit, OnDestroy {
    patient: Patient = new Patient({});
    enrolledProgrames: ProgramEnrollment[] = [];
    availablePrograms: Program[] = [];
    selectedProgram: string = '';
    errors: any[] = [];
    notEnrolled: boolean = false;
    loadingPatientPrograms: boolean = false;
    programsBusy: boolean = false;
    enrollmentUuid: string = '';
    program: string = '';
    dateCompleted: any;
    dateEnrolled: any;
    displayDialog: boolean = false;
    hasError: boolean = false;
    errorMessage: string = '';
    subscription: Subscription;
    private _datePipe: DatePipe;

    constructor(private appFeatureAnalytics: AppFeatureAnalytics,
        private patientService: PatientService, private programService: ProgramService
    ) {
        this._datePipe = new DatePipe('en-US');
    }

    ngOnInit() {
        this.appFeatureAnalytics
            .trackEvent('Patient Dashboard', 'Program Loaded', 'ngOnInit');
        this.subscribeToPatientChangeEvent();
        this.getAvailablePrograms();
    }

    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    subscribeToEnrollmentChangeEvent(payload) {
        this.programService.saveUpdateProgramEnrollment(payload).subscribe(
            (enrollment) => {
                if (enrollment) {
                    this.patientService.fetchPatientByUuid(this.patient.uuid);
                }
            }
        );
    }

    subscribeToPatientChangeEvent() {
        this.programsBusy = true;
        this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient) {
                    this.patient = patient;
                    this.loadProgramsPatientIsEnrolledIn(patient.person.uuid);
                }
            }
        );
    }

    openNewEnrollmentDialog(programUuid: string) {

        let selectedProgram = this.programService.
            getSelectedProgram(this.availablePrograms, programUuid);
        this.hasError = false;
        this.dateCompleted = undefined;
        this.dateEnrolled = undefined;
        this.selectedProgram = selectedProgram.display;
        this.program = selectedProgram.uuid;
        this.displayDialog = true;
    }

    enrollToProgram() {
        let isFormValid = this.validateFormFields(this.dateEnrolled, this.dateCompleted);
        let payload = this.programService.createEnrollmentPayload(
            this.program, this.patient, this.dateEnrolled, this.dateCompleted, this.enrollmentUuid);

        if (isFormValid === true && payload) {
            this.subscribeToEnrollmentChangeEvent(payload);
            this.displayDialog = false;
        }
    }

    updateEnrollment(enrollmentProgram) {
        this.hasError = false;
        this.displayDialog = true;
        this.selectedProgram = enrollmentProgram.display;
        this.enrollmentUuid = enrollmentProgram.uuid;
        if (enrollmentProgram.dateCompleted) {
            this.dateCompleted = this._datePipe.transform(
                enrollmentProgram.dateCompleted, 'yyyy-MM-dd');
        } else {
            this.dateCompleted = undefined;
        }

        this.dateEnrolled = this._datePipe.transform(enrollmentProgram.dateEnrolled, 'yyyy-MM-dd');
        this.program = enrollmentProgram.programUuid;
    }

    loadProgramsPatientIsEnrolledIn(patientUuid: string) {
        this.resetVariables();
        if (patientUuid) {
            this.loadingPatientPrograms = true;
            let request = this.programService.getPatientEnrolledProgramsByUuid(patientUuid);
            request
                .subscribe(
                (data) => {

                    if (data) {
                        this.enrolledProgrames = data;
                        this.programsBusy = false;
                        this.loadingPatientPrograms = false;
                    }

                },
                (error) => {

                    this.errors.push({
                        id: 'Patient Program Enrollment',
                        message: 'error fetching patient program enrollment'
                    });
                    this.loadingPatientPrograms = false;
                    this.programsBusy = false;
                }
                );
        }
    }

    getAvailablePrograms() {
        this.programService.getAvailablePrograms().subscribe(
            (programs) => {
                if (programs) {
                    this.availablePrograms = programs;
                }
            },
            (error) => {
                this.errors.push({
                    id: 'Patient Care Programs',
                    message: 'error fetching available programs'
                });
                this.loadingPatientPrograms = false;
                this.programsBusy = false;
            }
        );
    }

    resetVariables() {
        this.enrolledProgrames = [];
        this.programsBusy = false;
        this.loadingPatientPrograms = false;
        this.enrollmentUuid = '';
        this.hasError = false;

    }

    public closeDialog() {
        this.displayDialog = false;
    }

    private validateFormFields(enrolledDate, completedDate) {

        if (this.isNullOrUndefined(enrolledDate)) {
            this.setErroMessage('Date Enrolled is required.');
            return false;
        }

        if (this.isDateValid(enrolledDate) !== true) {
            this.setErroMessage('Date Enrolled should be a valid date.');
            return false;
        }

        if (!this.isNullOrUndefined(completedDate) && this.isDateValid(completedDate) !== true) {
            this.setErroMessage('Date Completed should be a valid date.');
            return false;
        }

        if (this.isDateValid(completedDate) === true &&
            !moment(completedDate).isAfter(enrolledDate)) {
            this.setErroMessage('Date Completed should be after Date Enrolled');
            return false;
        }

        if (this.isFutureDates(enrolledDate, completedDate) === true) {
            this.setErroMessage('Date Enrolled or Date Completed should not be in future');
            return false;
        }

        return true;
    }

    private isFutureDates(enrolledDate, completedDate) {
        let today = new Date();
        if (moment(completedDate).isAfter(today) || moment(completedDate).isAfter(today)) {
            return true;
        }
        return false;
    }

    private isNullOrUndefined(val) {
        return val === null || val === undefined || val === ''
            || val === 'null' || val === 'undefined';
    }

    private setErroMessage(message) {

        this.hasError = true;
        this.errorMessage = message;
    }
    private isDateValid(inputValue) {
        if (inputValue && inputValue !== undefined) {
            return moment(inputValue).isValid();
        }
        return false;
    }
}
