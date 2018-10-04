import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import { Patient } from '../../models/patient.model';
import { ProgramManagerService } from '../program-manager.service';

@Component({
  selector: 'edit-program-location',
  templateUrl: './edit-program-location.component.html',
  styleUrls: []
})
export class EditProgramLocationComponent implements OnInit {
  @Input() public programs: any[] = [];
  @Input() public editedProgram: any;
  @Input() public patient: Patient;
  @Input() public complete: boolean = false;
  @Output() public locationChangeComplete: EventEmitter<any> = new EventEmitter(null);
  @Output() public onBack: EventEmitter<any> = new EventEmitter(null);
  public updating: boolean = false;
  public dateEnrolled: Date;
  private location: any;
  constructor(private programManagerService: ProgramManagerService) {
  }

  public ngOnInit() {

  }

  public completeLocationChange() {
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
        this.updating = false;
        this.locationChangeComplete.next(programs);
      }
    });

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

}
