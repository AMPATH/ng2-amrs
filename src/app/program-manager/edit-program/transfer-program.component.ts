import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { Patient } from '../../models/patient.model';
import { ProgramManagerService } from '../program-manager.service';

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
  @Input() public set formsFilled(val: boolean) {
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
  private _formsFilled: boolean = false;
  constructor(private programManagerService: ProgramManagerService,
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
        this.transferring = false;
        this.formsFilled = false;
        this.programTransferComplete.next(_.first(programs));
      }
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

}
