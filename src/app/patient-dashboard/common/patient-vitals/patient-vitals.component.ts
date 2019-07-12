import { Component, OnInit, OnDestroy } from '@angular/core';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Helpers } from '../../../utils/helpers';
import { PatientService } from '../../services/patient.service';
import { PatientVitalsService } from './patient-vitals.service';
import { Patient } from '../../../models/patient.model';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { SelectDepartmentService } from 'src/app/shared/services/select-department.service';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.css']
})
export class PatientVitalsComponent implements OnInit, OnDestroy {
  public loadingVitals = false;
  public vitals: Array<any> = [];
  public patient: Patient;
  public dataLoaded = false;
  public errors: any = [];
  public page = 1;
  public patientUuid: any;
  public subscription: Subscription;
  public nextStartIndex = 0;
  public isLoading = false;
  public userDefaultDept: any;
  public isDepartmentOncology = false;

  constructor(private patientVitalsService: PatientVitalsService,
    private patientService: PatientService,
    private selectDepartmentService: SelectDepartmentService,
    private localStorage: LocalStorageService) { }

  public ngOnInit() {
    this.getPatient();
    this.getUserDefaultDepartment();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.pipe(take(1)).subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.loadVitals(patient.person.uuid, this.nextStartIndex);
          this.patientUuid = patient.person.uuid;
        }
      }
      , (err) => {

        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  public loadVitals(patientUuid, nextStartIndex): void {
    this.loadingVitals = true;

    this.patientVitalsService.getVitals(this.patient, this.nextStartIndex).subscribe((data) => {
      if (data) {
        if (data.length > 0) {
          const membersToCheck = ['weight', 'height', 'temp', 'oxygen_sat', 'systolic_bp',
            'diastolic_bp', 'pulse'];
          this.interpretEcogValuesForOncology(data);

          for (const r in data) {
            if (data.hasOwnProperty(r)) {
              const encounter = data[r];
              if (!Helpers.hasAllMembersUndefinedOrNull(encounter, membersToCheck)) {
                this.vitals.push(encounter);
              }
            }
          }
          const size: number = data.length;
          this.nextStartIndex = this.nextStartIndex + size;
          this.isLoading = false;
          this.loadingVitals = false;
        } else {
          this.dataLoaded = true;
          this.loadingVitals = false;
        }
      }
      this.isLoading = false;
    },

      (err) => {
        this.loadingVitals = false;
        this.errors.push({
          id: 'vitals',
          message: 'error fetching patient'
        });
      });
  }

  public loadMoreVitals() {
    this.loadVitals(this.patientUuid, this.nextStartIndex);
  }

  public getUserDefaultDepartment() {
    if (this.selectDepartmentService.getUserSetDepartment() === 'HEMATO-ONCOLOGY') {
      this.isDepartmentOncology = true;
    }
  }

  /**
   * interpretEcogValuesForOncology
   * (not a good approach refactor later to use etl)
   * 0 is normal
   * 1 is symptomatic
   * 2 is DEBILITATED, BEDRIDDEN LESS THAN 50% OF DAY
   * 3 is DEBILITATED, BEDRIDDEN GREATER THAN 50% OF THE DAY
   * 4 is BEDRIDDEN 100%
   */
  public interpretEcogValuesForOncology(data: any) {
    _.each(data, (element) => {
      switch (element.ecog) {
        case 1115: {
          element.ecog = 0;
          break;
        }
        case 6585: {
          element.ecog = 1;
          break;
        }
        case 6586: {
          element.ecog = 2;
          break;
        }
        case 6587: {
          element.ecog = 3;
          break;
        }
        case 6588: {
          element.ecog = 4;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
