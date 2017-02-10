import { Component, OnInit } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../patient.service';
import { ProgramService } from './program.service';
import { Patient } from '../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {
  patients: Patient = new Patient({});
  enrolledProgrames: ProgramEnrollment[] = [];
  errors: any[] = [];
  notEnrolled: boolean = false;
  loadingPatientPrograms: boolean = false;
  programsBusy: boolean = false;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService, private programEnrollmentService: ProgramService) {
  }

  ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Program Loaded', 'ngOnInit');
    this.subscribeToPatientChangeEvent();
  }

  subscribeToPatientChangeEvent() {
    this.programsBusy = true;
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.loadProgramsPatientIsEnrolledIn(patient.person.uuid);
        }
      }
    );
  }

  loadProgramsPatientIsEnrolledIn(patientUuid: string) {

    this.resetVariables();
    if (patientUuid) {
      this.loadingPatientPrograms = true;
      let request = this.programEnrollmentService.getPatientEnrolledProgramsByUuid(patientUuid);
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

  resetVariables() {
    this.enrolledProgrames = [];
    this.programsBusy = false;
    this.loadingPatientPrograms = false;
  }

}
