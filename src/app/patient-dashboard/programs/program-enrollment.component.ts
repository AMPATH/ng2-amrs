import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { ProgramService } from './program.service';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import * as _ from 'lodash';

@Component({
  selector: 'program-enrollment',
  templateUrl: './program-enrollment.component.html'
})
export class ProgramEnrollmentComponent implements OnInit {
  public loadingPatientPrograms: boolean = false;
  public enrolledPrograms: ProgramEnrollment[];
  constructor(private patientService: PatientService,
              private programService: ProgramService) {}

  public ngOnInit() {
    this._init();
  }

  private _init() {
    this.loadingPatientPrograms = true;
    this.patientService.currentlyLoadedPatient.subscribe((patient) => {
        if (patient) {
          this.loadingPatientPrograms = false;
          this.enrolledPrograms = _.filter(patient.enrolledPrograms, 'isEnrolled');
        }
      }
    );
  }
}
