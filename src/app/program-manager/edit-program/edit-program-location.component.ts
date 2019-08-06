import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import { Patient } from '../../models/patient.model';
import { ProgramManagerService } from '../program-manager.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'edit-program-location',
  templateUrl: './edit-program-location.component.html',
  styleUrls: []
})
export class EditProgramLocationComponent implements OnInit {
  @Input() public programs: any[] = [];
  // tslint:disable:no-input-rename
  @Input('editedProgram') public editedPrograms: any;
  @Input()
  public set userLocation(location: any) {
    if (location) {
      this._userLocation = location;
      this.preSelectLocation();
    }
  }

  public get userLocation(): any {
    return this._userLocation;
  }
  @Input() public patient: Patient;
  @Input() public complete = false;
  @Output() public locationChangeComplete: EventEmitter<any> = new EventEmitter(null);
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onBack: EventEmitter<any> = new EventEmitter(null);
  public updating = false;
  public dateEnrolled: string;
  public transferLocation: any;
  public hasError = false;
  private location: any;
  public message = '';
  private _userLocation: any;

  constructor(private programManagerService: ProgramManagerService,
              public route: ActivatedRoute,
              private patientResourceService: PatientResourceService) {
    this.dateEnrolled = moment().format('YYYY-MM-DD');
  }

  public ngOnInit() {
    const queryParams: any = this.route.snapshot.queryParams;
    if (queryParams && queryParams.program && !this.complete) {
      this.doEnroll(queryParams.program);
    }
  }

  public doEnroll(program) {
    const payload = {
      programUuid: program,
      patient: this.patient,
      dateEnrolled: this.dateEnrolled,
      dateCompleted: null,
      location: this.location.value,
      enrollmentUuid: ''
    };
    this.programManagerService.enrollPatient(payload).subscribe((newProgram) => {
      if (newProgram) {
        localStorage.removeItem('transferLocation');
        localStorage.removeItem('careStatus');
        localStorage.removeItem('transferRTC');
        this.locationChangeComplete.next([newProgram]);
      }
    }, (err) => {
      console.log(err);
      this.locationChangeComplete.error(err);
    });
  }

  public completeLocationChange() {
    if (this.hasValidFields()) {
      this.programs = _.map(this.programs, (program) => {
        _.merge(program, {
          dateEnrolled: new Date(this.dateEnrolled),
          dateCompleted: new Date(this.dateEnrolled)
        });
        return program;
      });
      if (this.patient) {
        this.hasError = false;
        this.message = '';
        this.updating = true;
        this.programManagerService.editProgramEnrollments('location', this.patient,
          this.programs, this.location.value).subscribe((programs) => {
          if (programs) {
            this.transferPreferedIdentifier().subscribe(() => {
              this.updating = false;
              this.hasError = false;
              localStorage.removeItem('transferLocation');
              localStorage.removeItem('careStatus');
              this.locationChangeComplete.next(programs);
            }, (error) => {
              this.hasError = true;
              this.updating = false;
              console.log(error);
            });
          }
        }, (err) => {
          console.log(err);
          this.updating = false;
          this.hasError = true;
        });
      }
    } else {
      this.hasError = true;
      this.message = 'Please fill location and date enrolled to proceed';
    }

  }

  public goBack() {
    this.onBack.next(true);
  }

  public selectLocation(location) {
    this.location = location.locations;
  }

  public updateProgramsToEdit(event) {
    _.remove(this.programs, (_program) => {
      return _program.uuid === event.target.value;
    });
  }

  private hasValidFields() {
    return !_.isNil(this.location) && !_.isNil(this.dateEnrolled);
  }

  private preSelectLocation() {
    const retroLocation = localStorage.getItem('retroLocation');
    if (retroLocation) {
      const retroLocationObj = JSON.parse(retroLocation);
      this.transferLocation = retroLocationObj.uuid;
      this.location = {value: retroLocationObj.uuid};
      return;
    }
    const transferLocation = localStorage.getItem('transferLocation');
    if (transferLocation) {
      this.transferLocation = transferLocation;
      this.location = {value: transferLocation};
    } else {
      this.transferLocation = this.userLocation.value;
      this.location = this.userLocation;
    }
  }

  private transferPreferedIdentifier(): Observable<any> {
    // get preferred identifier
    const preferredIdentifier = _.find(this.patient.openmrsModel.identifiers, 'preferred');
    if (preferredIdentifier) {


      const person = {
        uuid: this.patient.person.uuid
      };
      // we only change the location of the preferred Identifier
      const personIdentifierPayload: any = {
        uuid: preferredIdentifier.uuid,
        identifier: preferredIdentifier.identifier,
        identifierType: preferredIdentifier.identifierType.uuid,
        preferred: true,
        location: this.location.value // location
      };

      return this.patientResourceService.saveUpdatePatientIdentifier(person.uuid,
        personIdentifierPayload.uuid, personIdentifierPayload).take(1);
    }
  }

}
