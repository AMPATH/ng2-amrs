import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientService } from '../../../patient-dashboard/services/patient.service';
import { Patient } from '../../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PatientProgramService
} from '../../../patient-dashboard/programs/patient-programs.service';
import { FormListService } from '../../../patient-dashboard/common/forms/form-list.service';
import { PatientReferralService } from '../../services/patient-referral-service';

@Component({
  selector: 'program-enrollment-manager-form-wizard',
  templateUrl: './enrollment-manager-form-wizard.component.html',
  styleUrls: ['./enrollment-manager-form-wizard.component.css']
})
export class EnrollmentManagerFormWizardComponent implements OnInit, OnDestroy {
  @Input() public forms: any[];
  @Input() public patient: Patient;
  @Output() public onFormsCompleted: EventEmitter<boolean> = new EventEmitter(false);
  public stateType: any;
  public excludedForms: any[];
  public encounterForms: any[];
  public isBusy: boolean = false;
  public hasForms: boolean = false;
  public hasError: boolean = false;
  public allFormsFilled: boolean = false;
  private subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private patientService: PatientService,
              private formListService: FormListService,
              private patientReferralService: PatientReferralService) {
  }

  public ngOnInit() {
    this._init();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public fillForm(form) {
    let _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/formentry';
    let routeOptions = {
      queryParams: {
        programEncounter: form.encounterType.uuid
      }
    };
    this.router.navigate([_route, form.uuid], routeOptions);
  }

  public completeProcess() {
    this.onFormsCompleted.emit(true);
  }

  private _init() {
    this.patientReferralService.getProcessPayload().subscribe((stateChange) => {
      if (!stateChange) {
          this.router.navigate(['..'], {relativeTo: this.route});
      } else {
        this.patientService.currentlyLoadedPatient.subscribe((patient) => {
            if (patient !== null) {
              this.patient = patient;
              this.hasError = false;
              this.stateType = stateChange;
              if (_.isEmpty(this.forms)) {
                this.forms = stateChange.forms;
              }
              this._filterForms();
            }
          });

      }
    }, (err) => {
      console.log(err);
      this.hasError = true;
    });
  }

  private _filterForms() {
    this.isBusy = true;
    this.formListService.getFormList().subscribe((forms: any[]) => {
        if (forms.length > 0) {
          this.patientReferralService.getPatientEncounters(this.patient)
            .subscribe((encounters) => {
            let encounterTypeUuids = _.map(forms, (form) => {
              return form.encounterType.uuid;
            });

            // pick today's encounters to remove already filled forms
            let lastFilledEncounters =
                this.patientReferralService.pickEncountersByLastFilledDate(encounters,
                  new Date());
            let formsToFill = _.map(this.forms, 'uuid');
            let unfilledForms = _.map(this.forms, 'uuid');
            if (lastFilledEncounters.length > 0) {
              unfilledForms = _.map(_.filter(formsToFill, (form) => {
                return !_.includes(lastFilledEncounters, form);
              }), 'uuid');
            }
            this.hasForms = unfilledForms.length > 0;
            this.excludedForms = _.xor(unfilledForms, encounterTypeUuids);
            this.encounterForms = unfilledForms;
            this.isBusy = false;
            let totalFilledForms = _.intersection(formsToFill, lastFilledEncounters);
            this.allFormsFilled = formsToFill.length === totalFilledForms.length;
            // complete process if all forms have been filled
            if (this.allFormsFilled) {
              this.completeProcess();
            }
          }, (err) => {
            this.isBusy = false;
            console.log(err);
            this.hasError = true;
          });
        }
      });
  }
}
