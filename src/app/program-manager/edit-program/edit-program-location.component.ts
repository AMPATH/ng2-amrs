import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import { Patient } from '../../models/patient.model';
import { ProgramManagerService } from '../program-manager.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'edit-program-location',
  templateUrl: './edit-program-location.component.html',
  styleUrls: []
})
export class EditProgramLocationComponent implements OnInit {
  @Input() public programs: any[] = [];
  @Input('editedProgram') public editedPrograms: any;
  @Input() public patient: Patient;
  @Input() public complete: boolean = false;
  @Output() public locationChangeComplete: EventEmitter<any> = new EventEmitter(null);
  @Output() public onBack: EventEmitter<any> = new EventEmitter(null);
  public updating: boolean = false;
  public dateEnrolled: Date;
  public transferLocation: any;
  public hasError: boolean = false;
  private location: any;
  public message: string = '';

  constructor(private programManagerService: ProgramManagerService,
              private patientResourceService: PatientResourceService) {
  }

  public ngOnInit() {
    this.preSelectLocation();
  }

  public completeLocationChange() {
    if (this.hasValidFields()) {
      this.hasError = false;
      this.message = '';
      this.updating = true;
      this.programs = _.map(this.programs, (program) => {
        _.merge(program, {
          dateEnrolled: new Date(this.dateEnrolled),
          dateCompleted: new Date(this.dateEnrolled)
        });
        return program;
      });
      this.programManagerService.editProgramEnrollments('location', this.patient,
        this.programs, this.location.value).subscribe((programs) => {
        if (programs) {
          this.transferPreferedIdentifier().subscribe(() => {
            this.updating = false;
            this.hasError = false;
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
    return !_.isNil(this.location) && !_.isNil(this.dateEnrolled)
  }

  private preSelectLocation() {
    let transferLocation = localStorage.getItem('transferLocation');
    if (transferLocation) {
      this.transferLocation = transferLocation;
    }
  }

  private transferPreferedIdentifier(): Observable<any> {
    // get preferred identifier
    const preferredIdentifier = _.find(this.patient.openmrsModel.identifiers, 'preferred');
    if (preferredIdentifier) {


      let person = {
        uuid: this.patient.person.uuid
      };
      // we only change the location of the preferred Identifier
      let personIdentifierPayload: any = {
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
