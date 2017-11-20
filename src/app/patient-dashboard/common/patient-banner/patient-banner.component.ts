import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import * as Moment from 'moment';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';
import { ProgramsTransferCareService } from '../../programs/transfer-care/transfer-care.service';

@Component({
  selector: 'patient-banner',
  templateUrl: './patient-banner.component.html',
  styleUrls: ['./patient-banner.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PatientBannerComponent implements OnInit, OnDestroy {
  public showingAddToCohort: boolean = false;
  public manageProgramEnrollment: boolean = false;
  public patient: Patient = new Patient({});
  public searchIdentifiers: object;
  public birthdate;
  private subscription: Subscription;

  constructor(private patientService: PatientService,
              private transferCareService: ProgramsTransferCareService) { }

  public ngOnInit() {
    this.transferCareService.getModalOpenState().subscribe((status) => {
      this.manageProgramEnrollment = status;
    });
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.searchIdentifiers = patient.searchIdentifiers;
          this.birthdate = Moment(patient.person.birthdate).format('l');
        } else {
          this.searchIdentifiers = undefined;
          this.birthdate = undefined;
        }
      }
    );
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  public addToCohort() {
    this.showingAddToCohort = true;
  }

  public showTransferCareModal() {
    this.manageProgramEnrollment = true;
  }

  public closeDialog() {
    this.manageProgramEnrollment = false;
  }

  public onAddingToCohortClosed() {
    this.showingAddToCohort = false;
  }

}
