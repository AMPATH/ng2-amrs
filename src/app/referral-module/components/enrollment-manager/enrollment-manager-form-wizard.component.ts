import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientService } from '../../../patient-dashboard/services/patient.service';
import { Patient } from '../../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { FormListService } from '../../../patient-dashboard/common/forms/form-list.service';
import { PatientReferralService } from '../../services/patient-referral-service';

@Component({
  selector: 'program-enrollment-manager-form-wizard',
  templateUrl: './enrollment-manager-form-wizard.component.html',
  styleUrls: ['./enrollment-manager-form-wizard.component.css']
})
export class EnrollmentManagerFormWizardComponent implements OnInit, OnDestroy {
  @Input() public forms: any[];
  @Input() public parentComponent: string = 'enrollment-manager';
  @Input() public patient: Patient;
  @Output() public onFormsCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  public stateType: any;
  public currenProcessId: string;
  public encounterForms: any[];
  public processCompleteState: boolean = false;
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
    // this.onFormsCompleted.emit(true);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public fillForm(form) {
    let _route = '/patient-dashboard/patient/' + this.patient.uuid
      + '/general/general/formentry';
    let routeOptions = {
      queryParams: {
        programEncounter: form.encounterType.uuid,
        referralEncounterType: form.encounterType.name,
        parentComponent: this.parentComponent
      }
    };
    this.router.navigate([_route, form.uuid], routeOptions);
  }

  public completeProcess(event: any) {
    this.patientReferralService.formsComplete.next(true);
    this.onFormsCompleted.emit(true);
  }

  private _init() {
    this.subscription = this.patientReferralService.getProcessPayload().subscribe((stateChange) => {
      if (!stateChange) {
          this.router.navigate(['..'], {relativeTo: this.route});
      } else {
        this.subscription = this.patientService.currentlyLoadedPatient.subscribe((patient) => {
            if (patient !== null) {
              this.patient = patient;
              this.hasError = false;
              this.stateType = stateChange;
              this.forms = stateChange.forms;
              this.currenProcessId = stateChange.processId;
              this._filterForms(stateChange);
            }
          });

      }
    }, (err) => {
      console.log(err);
      this.hasError = true;
    });
  }

  private _filterForms(stateChange: any) {
    this.isBusy = true;
    this.subscription = this.formListService.getFormList().subscribe((forms: any[]) => {
      if (forms.length > 0) {
        this.subscription = this.patientReferralService.getPatientEncounters(this.patient)
          .subscribe((encounters) => {
            // pick today's encounters to remove already filled forms
            let lastFilledEncounters =
              this.patientReferralService.pickEncountersByLastFilledDate(encounters,
                new Date());
            let formsToFill = _.compact(_.map(this.forms, 'uuid'));
            let unfilledForms = [];
            if (lastFilledEncounters.length > 0) {
              unfilledForms = _.map(_.filter(formsToFill, (form) => {
                return !_.includes(lastFilledEncounters, form);
              }), 'uuid');
            }

            this.hasForms = unfilledForms.length > 0;
            this.encounterForms = formsToFill;
            this.isBusy = false;
            if (formsToFill.length > 0) {
              let totalFilledForms = _.intersection(formsToFill,
                _.compact(lastFilledEncounters));
              this.allFormsFilled = formsToFill.length === totalFilledForms.length;
              // complete process if all forms have been filled
              if (this.allFormsFilled && this.currenProcessId) {
                this.processCompleteState = true;
                this.completeProcess(true);
              }
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
