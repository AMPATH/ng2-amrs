import { take } from 'rxjs/operators';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { PatientSearchService } from '../../../patient-search/patient-search.service';
import { Patient } from '../../../models/patient.model';
import * as _ from 'lodash';
import { PatientRelationshipService } from './patient-relationship.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'patient-relationship-search',
  templateUrl: './patient-relationship-search.component.html',
  styleUrls: ['./patient-relationship-search.component.css']
})
export class PatientRelationshipSearchComponent implements OnInit, OnDestroy {
  public searchString: string;
  public patients: Patient[];
  public isResetButton = true;
  public totalPatients: number;
  public isLoading = false;
  public page = 1;
  public patientToBindRelationship: any;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onPatientToBindRelationship = new EventEmitter();
  public subscription: Subscription;
  public searchPanelVisible = false;
  public errorMessage: string;

  constructor(
    private patientSearchService: PatientSearchService,
    private router: Router,
    private patientRelationshipService: PatientRelationshipService
  ) {}

  public ngOnInit() {
    // load cached result
    this.patientSearchService.patientsToBindRelationshipSearchResults
      .pipe(take(1))
      .subscribe((patients) => {
        this.patients = patients;
        this.searchString = this.patientSearchService.relationshipSearchString;
        this.totalPatients = this.patients.length;
      });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadPatient(): void {
    this.searchPanelVisible = true;
    this.totalPatients = 0;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.searchString && this.searchString.length > 2) {
      this.isLoading = true;
      this.patients = [];
      this.subscription = this.patientSearchService
        .searchPatientToBindRelationship(this.searchString, false)
        .pipe(take(1))
        .subscribe(
          (data) => {
            if (data.length > 0) {
              this.patients = data;
              this.totalPatients = this.patients.length;
              this.isLoading = false;
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            console.error('error', error);
            this.errorMessage = error;
          }
        );

      this.isResetButton = true;
    }
  }

  public updatePatientCount(search) {
    if (this.totalPatients > 0 && search.length > 0) {
      this.totalPatients = 0;
    }
  }

  public loadPatientData(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/patient-info'
    ]);
  }

  public selectPatient(patientUuid) {
    this.patientToBindRelationship = _.find(this.patients, (patient) => {
      if (patient.uuid === patientUuid) {
        return patient;
      }
    });
    this.onPatientToBindRelationship.emit(this.patientToBindRelationship);
    this.searchPanelVisible = false;
  }

  public resetSearchList() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.patientSearchService.resetRelationshipSearch();
    this.searchString = '';
    this.totalPatients = 0;
    this.isResetButton = false;
    this.searchPanelVisible = false;
    this.isLoading = false;
    this.patientToBindRelationship = {
      person: {
        display: ''
      }
    };
    this.onPatientToBindRelationship.emit(this.patientToBindRelationship);
  }

  public tooltipStateChanged(state: boolean): void {
    // console.log(`Tooltip is open: ${state}`);
  }
}
