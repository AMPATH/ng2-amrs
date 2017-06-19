import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientSearchService } from './patient-search.service';
import { Patient } from '../../models/patient.model';
import { Subscription } from 'rxjs';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css'],
})

export class PatientSearchComponent implements OnInit, OnDestroy {
  patients: Patient[];
  isResetButton: boolean = true;
  totalPatients: number;
  isLoading: boolean = false;
  hasConductedSearch = false;
  page: number = 1;
  adjustInputMargin: string = '240px';
  subscription: Subscription;
  public errorMessage: string = '';

  private _searchString: string;
  public get searchString(): string {
    return this._searchString;
  }
  public set searchString(v: string) {
    this._searchString = v;
    this.hasConductedSearch = false;
  }


  constructor(private patientSearchService: PatientSearchService,
    private route: ActivatedRoute,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private router: Router) {
  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.adjustInputMargin = '0';
    }
    this.route.queryParams.subscribe((params) => {
      if (params['reset'] !== undefined) {
        this.resetSearchList();
      } else {
        // load cached result
        this.errorMessage = '';
        this.patientSearchService.patientsSearchResults.subscribe(
          (patients) => {
            this.onResultsFound(patients);
          },
          (error) => {
            this.onError(error);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onResultsFound(results) {
    // console.error('res', results);
    if (results.length > 0) {
      this.patients = results;
      this.totalPatients = this.patients.length;
    } else {
      this.patients = [];
      this.totalPatients = 0;
    }
    this.searchString = this.patientSearchService.searchString;
    this.hasConductedSearch = true;
  }

  onError(error) {
    this.isLoading = false;
    this.resetInputMargin();
    console.log('error', error);
    this.errorMessage = error;
    this.hasConductedSearch = false;
  }

  loadPatient(): void {
    this.totalPatients = 0;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.searchString && this.searchString.length > 2) {
      if (window.innerWidth > 768) {
        this.adjustInputMargin = '267px';
      }
      this.isLoading = true;
      this.patients = [];
      this.errorMessage = '';
      this.subscription = this.patientSearchService.searchPatient(this.searchString, false)
        .subscribe(
        (data) => {
          this.isLoading = false;
          this.onResultsFound(data);
          this.resetInputMargin();
          // app feature analytics
          this.appFeatureAnalytics
            .trackEvent('Patient Search', 'Patients Searched', 'loadPatient');

        },
        (error) => {
          this.onError(error);
        }
        );

      this.isResetButton = true;
    }
  }

  updatePatientCount(search) {
    if (this.totalPatients > 0 && search.length > 0) {
      this.totalPatients = 0;

    }
  }

  loadPatientData(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/' + patientUuid + '/general']);
  }


  resetSearchList() {
    this.patientSearchService.resetPatients();
    this.searchString = '';
    this.totalPatients = 0;
    this.isResetButton = false;
    this.isLoading = false;
    this.hasConductedSearch = false;
    this.resetInputMargin();
  }

  public tooltipStateChanged(state: boolean): void {
    // console.log(`Tooltip is open: ${state}`);
  }

  public resetInputMargin() {
    if (window.innerWidth > 768) {
      this.adjustInputMargin = '240px';
    }
  }


}
