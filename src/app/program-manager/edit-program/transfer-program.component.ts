import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { Patient } from '../../models/patient.model';
import { ProgramManagerService } from '../program-manager.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'program-transfer',
  templateUrl: './transfer-program.component.html',
  styles: [
      `.panel.panel-info {
      border: 1px solid #bce8f1;
      margin-top: 12px;
    }`
  ]
})
export class TransferProgramComponent implements OnInit {
  @Input() public programs: any[] = [];
  @Input() public editedProgram: any;
  @Input() public complete = false;

  @Input()
  public set patient(val: Patient) {
    this._patient = val;
    if (val) {
      this.showExitForms();
    }
  }

  public get patient() {
    return this._patient;
  }

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
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onBack: EventEmitter<any> = new EventEmitter(null);
  public transferring = false;
  private location: any;
  public showForms = false;
  public exitEncounters: string[] = [];
  public hasError = false;
  public message = '';
  public transferLocation;
  private _formsFilled = false;
  private _patient: Patient;

  constructor(private programManagerService: ProgramManagerService,
              private patientResourceService: PatientResourceService,
              private router: Router) {
  }

  public ngOnInit() {
  }

  public showExitForms() {
    _.each(this.programs, (program) => {
      if (program.stateChangeEncounterTypes && program.stateChangeEncounterTypes.transfer) {
        // at the moment we only have one form. Pick the first
        const form: any = _.first(program.stateChangeEncounterTypes.transfer);
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
    this.preSelectLocation();
    this.transferring = true;
    this.programs = _.map(this.programs, (program) => {
      _.merge(program, {
        dateCompleted: new Date()
      });
      return program;
    });

    this.programManagerService.editProgramEnrollments('transfer', this.patient,
      this.programs, this.location ? this.location.value : null).subscribe((programs) => {
      if (programs) {
        this.updatePreferedIdentifier(!this.location).subscribe((success) => {
          this.transferring = false;
          this.hasError = false;
          this.formsFilled = false;
          this.programTransferComplete.next(programs);
        }, (err) => {
          this.showError('Could not remove preferred patient identifier');
          console.log(err);
        });
      } else {
        this.showError('Could not update patient programs');
      }
    }, (err) => {
      this.showError('Could not update patient programs');
      console.log(err);
    });
  }

  public fillEnrollmentForm(form) {
    const _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/formentry';
    const routeOptions = {
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

  private updatePreferedIdentifier(remove?: boolean): Observable<any> {
    // get preferred identifier
    const preferredIdentifier = _.find(this.patient.openmrsModel.identifiers, 'preferred');
    if (preferredIdentifier) {
      const personIdentifierPayload: any = {
        uuid: preferredIdentifier.uuid,
        identifier: preferredIdentifier.identifier, // patientIdentifier
        identifierType: preferredIdentifier.identifierType.uuid, // identifierType
        preferred: true,
        location: this.location ? this.location.value : preferredIdentifier.location.uuid // location
      };
      if (remove) {
        _.merge(personIdentifierPayload, {
          preferred: false, // we don't know where the patient is going. so we only remove the preferred state
        });
      }

      return this.patientResourceService.saveUpdatePatientIdentifier(this.patient.person.uuid,
        personIdentifierPayload.uuid, personIdentifierPayload).take(1);
    } else {
      return of({});
    }
  }

  private preSelectLocation() {
    const transferLocation = localStorage.getItem('transferLocation');
    if (transferLocation) {
      this.transferLocation = transferLocation;
      this.location = {value: transferLocation};
    }
  }

}
