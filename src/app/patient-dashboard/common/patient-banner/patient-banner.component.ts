import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'patient-banner',
  templateUrl: './patient-banner.component.html',
  styleUrls: ['./patient-banner.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PatientBannerComponent implements OnInit, OnDestroy {
  public showingAddToCohort: boolean = false;
  public patient: Patient = new Patient({});
  public searchIdentifiers: object;
  public attributes: any;
  public birthdate;
  public formattedPatientAge;
  private subscription: Subscription;

  constructor(private patientService: PatientService) { }

  public ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.searchIdentifiers = patient.searchIdentifiers;
          let attributes = patient.person.attributes;
          _.each(attributes, (attribute) => {
             // get the test patient attribute
             if (attribute.attributeType.uuid === '1e38f1ca-4257-4a03-ad5d-f4d972074e69') {
                  this.attributes = attribute;
              }
          });

          this.birthdate = Moment(patient.person.birthdate).format('l');
          this.formattedPatientAge = this.getPatientAge(patient.person.birthdate);
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

  public onAddingToCohortClosed() {
    this.showingAddToCohort = false;
  }

  private getPatientAge(birthdate) {
    if (birthdate) {
      const todayMoment: any = Moment();
      const birthDateMoment: any = Moment(birthdate);
      const years = todayMoment.diff(birthDateMoment, 'year');
      birthDateMoment.add(years, 'years');
      const months = todayMoment.diff(birthDateMoment, 'months');
      birthDateMoment.add(months, 'months');
      const days = todayMoment.diff(birthDateMoment, 'days');
      return years + ' y ' + months + ' m ' + days + ' d';
    }
    return null;
  }

}
