import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import * as Moment from 'moment';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormsModule, NgForm, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProgramService } from '../../programs/program.service';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'unenroll-patient-programs',
    templateUrl: 'unenroll-patient-programs.component.html',
    styleUrls: ['./unenroll-patient-programs.component.css'],
})
export class UnenrollPatientProgramsComponent implements OnInit, OnDestroy {

    public enrollmentUdateErrors: any[] = [];
    public enrollmentDetails: any = {};
    public message: string = '';

    @Input()
    public get enrollments(): any {
        return this.enrolledPrograms;
    }
    public set enrollments(v: any) {
        this.enrolledPrograms = v;
    }

    @Input()
    public get reason(): any {
        return this.message;
    }
    public set reason(v: any) {
        this.message = v;
    }

    @Output() public unenrollmentCompleted = new EventEmitter();
    @Output() public unEnrollmentCancelled = new EventEmitter();
    public enrolledPrograms: any;
    public disenrollConfirmDialog: boolean = true;
    public hasValidationErrors: boolean = true;
    public currentError: any = '';
    public enrollmentDatd: any = '';
    private _datePipe: DatePipe;
    constructor(private programService: ProgramService) {
      this._datePipe = new DatePipe('en-US');
    }

    public ngOnInit() {
        this.init();
    }

    public ngOnDestroy() {
    }

    public unEnrollPatientFromPrograms() {
       this.unEnrollFromPrograms(this.enrollmentDetails);

    }

    public onNoDialogConfirmation() {
        this.unEnrollmentCancelled.emit(true);
        this.disenrollConfirmDialog = false;

    }

    private initCompletedDate() {
            for (let enrolled of this.enrolledPrograms) {
                    this.enrollmentDetails[enrolled.enrollmentUuid] = this._datePipe.transform(
                    new Date(), 'yyyy-MM-dd');
                }
    }

    private unEnrollFromPrograms(enrollmentDetails) {

        for (let property in enrollmentDetails) {
            if (enrollmentDetails.hasOwnProperty(property)) {
            this.unenrollPatient(property, enrollmentDetails[property]) ;
            }
        }
    }

    private init() {
        this.initCompletedDate();
        this.enrollmentUdateErrors = [];
    }

    private unenrollPatient(enrollmentUuid, completedDate) {
        let enrolled: any = this.getEnrollmentDetails(enrollmentUuid);
        let enrolledDate = enrolled ? enrolled[0].enrolledDate : null;
        let program = enrolled ? enrolled[0].name : null;

        if (this. _formFieldsValid(enrolledDate, completedDate, enrollmentUuid)) {
        let payload = this.createPayload(enrollmentUuid, completedDate);
        this.programService.saveUpdateProgramEnrollment(payload).subscribe(
                (enrollment) => {
                    if (enrollment) {
                    this.removeEnrolledProgram(enrollmentUuid);
                    }
                }, (error) => {
                    this.enrollmentUdateErrors.push(
                        'An error occurred while unenrolling ' + program);
                    console.error(error);
                }

                );

        }

    }

    private removeEnrolledProgram(enrollmentUuid) {
            _.remove(this.enrolledPrograms, (o: any) => {
                return o.enrollmentUuid === enrollmentUuid;
            });

            if (this.enrolledPrograms.length === 0) {
            this.unenrollmentCompleted.emit(true);
        }
    }

    private createPayload(enrollmentUuid, completedDate) {
    return {uuid: enrollmentUuid, dateCompleted: completedDate};
    }

    private getEnrollmentDetails(enrollmentUuid) {
            let enrolled: any = _.filter(this.enrolledPrograms, (e: any) => {
                    return e.enrollmentUuid === enrollmentUuid;
                });
            return enrolled ? enrolled : null;
    }

    private _formFieldsValid(enrolledDate, completedDate, enrollmentUuid) {

    if (!enrollmentUuid || enrollmentUuid === '') {
      this._showErrorMessage('Patient enrollment uuid is required.');
      return false;
    }

    if (!_.isNil(enrolledDate) && _.isNil(completedDate)) {
      this._showErrorMessage('Date Completed is required.');
      return false;
    }

    if (_.isNil(enrolledDate)) {
      this._showErrorMessage('Date Enrolled is required.');
      return false;
    }

    if ((!_.isNil(completedDate) && !moment(completedDate).isAfter(enrolledDate)
    && !moment(completedDate).isSame(enrolledDate))) {
      this._showErrorMessage('Date Completed should be after Date Enrolled');
      return false;
    }

    if (this._isFutureDate(completedDate) === true) {
      this._showErrorMessage('Date Completed should not be in future');
      return false;
    }
    console.log(enrolledDate + ', ' + completedDate + ', ' + enrollmentUuid);
    return true;
    }

    private _showErrorMessage(message) {
        this.hasValidationErrors = true;
        this.enrollmentUdateErrors.push(message);
    }

    private _isFutureDate(completedDate) {

        let today: Date;
        today = new Date();
        if ((!_.isNil(completedDate) && moment(completedDate).isAfter(today))) {
        return true;
        }
        return false;
    }

}
