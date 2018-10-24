import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { Patient } from '../../models/patient.model';
import { ProgramManagerService } from '../program-manager.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'program-transfer',
  templateUrl: './transfer-program.component.html',
  styleUrls: []
})
export class TransferProgramComponent implements OnInit {
  @Input() public programs: any[] = [];
  @Input() public editedProgram: any;
  @Input() public patient: Patient;
  @Input() public complete: boolean = false;

  @Input()
  public set formsFilled(val: boolean) {
    this._formsFilled = val;
    if (val) {
      this.completeProgramTransfer();
    }
  }

  public get formsFilled() {
    return this._formsFilled;
  }

  @Output() public programTransferComplete: EventEmitter<any> = new EventEmitter(null);
  @Output() public onBack: EventEmitter<any> = new EventEmitter(null);
  public transferring: boolean = false;
  public showForms: boolean = false;
  public exitEncounters: string[] = [];
  public hasError: boolean = false;
  public message: string = '';
  private _formsFilled: boolean = false;

  constructor(private programManagerService: ProgramManagerService,
              private patientResourceService: PatientResourceService,
              private router: Router) {
  }

  public ngOnInit() {

  }

  public showExitForms() {
    _.each(this.programs, (program) => {
      if (program.stateChangeEncounterTypes && program.stateChangeEncounterTypes.nonAmpath) {
        // at the moment we only have one form. Pick the first
        const form: any = _.first(program.stateChangeEncounterTypes.nonAmpath);
        this.exitEncounters.push(form.uuid);
      }
    });
    this.exitEncounters = _.uniq(this.exitEncounters);
    if (this.exitEncounters.length > 0) {
      this.showForms = true;
    } else {
      this.completeProgramTransfer();
    }

  }

  public completeProgramTransfer() {
    this.transferring = true;
    this.programs = _.map(this.programs, (program) => {
      _.merge(program, {
        dateCompleted: new Date()
      });
      return program;
    });

    this.programManagerService.editProgramEnrollments('transfer', this.patient,
      this.programs, null).subscribe((programs) => {
      if (programs) {
        this.removePreferedIdentifier().subscribe((success) => {
          this.transferring = false;
          this.hasError = false;
          this.formsFilled = false;
          this.programTransferComplete.next(programs);
        }, (err) => {
          this.showError('Could not remove preferred patient identifier');
          console.log(err);
        });
        /*this.programManagerService.updatePersonHealthCenter({
          attributes: [{
            value: null,
            attributeType: '8d87236c-c2cc-11de-8d13-0010c6dffd0f'
          }],
          person: {uuid: this.patient.uuid}
        }).subscribe((success) => {

        }, (err) => {
          this.hasError = true;
          this.transferring = false;
          this.message = 'Could not update patient health center';
          console.log(err);
        });*/
      } else {
        this.showError('Could not update patient programs');
      }
    }, (err) => {
        this.showError('Could not update patient programs');
        console.log(err);
    });
  }

  public fillEnrollmentForm(form) {
    let _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/formentry';
    let routeOptions = {
      queryParams: {
        step: 3,
        parentComponent: 'programManager:edit'
      }
    };
    this.router.navigate([_route, form.uuid], routeOptions);
  }

  public goBack() {
    this.onBack.emit(true);
  }

  public updateProgramsToEdit(event) {
    _.remove(this.programs, (_program) => {
      return _program.uuid === event.target.value;
    });
  }

  private showError(message) {
    this.hasError = true;
    this.transferring = false;
    this.message = message;
  }

  private removePreferedIdentifier(): Observable<any> {
    // get preferred identifier
    const preferredIdentifier = _.find(this.patient.openmrsModel.identifiers, 'preferred');
    if (preferredIdentifier) {
      let personIdentifierPayload: any = {
        uuid: preferredIdentifier.uuid,
        identifier: preferredIdentifier.identifier, // patientIdentifier
        identifierType: preferredIdentifier.identifierType.uuid, // identifierType
        preferred: false, // we don't know where the patient is going. so we only remove the preferred state
        location: preferredIdentifier.location.uuid // location
      };

      return this.patientResourceService.saveUpdatePatientIdentifier(this.patient.person.uuid,
        personIdentifierPayload.uuid, personIdentifierPayload).take(1);
    } else {
      return of({});
    }
  }

}
