import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PatientService } from '../../services/patient.service';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ProgramsTransferCareService } from './transfer-care.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { Observable } from 'rxjs/Observable';
import { FormListService } from '../../common/forms/form-list.service';
import { Subject } from 'rxjs/Subject';
import { Patient } from '../../../models/patient.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'transfer-care-form-wizard',
  templateUrl: './transfer-care-form-wizard.component.html',
  styleUrls: ['./transfer-care-form-wizard.component.css']
})
export class ProgramsTransferCareFormWizardComponent implements OnInit, OnDestroy {
  @Input()
  public isModal: boolean = false;
  @Output()
  public hideModal: EventEmitter<boolean> = new EventEmitter(false);
  public patient: Patient;
  public transferCarePrograms: any[] = [];
  public transferType: string;
  public hasError: boolean = false;
  public totalProgramsForms: number = 0;
  public lastFilledEncounters: any[] = [];
  public isBusy: boolean = false;
  public allFormsFilled: boolean = false;
  public modalProcessComplete: boolean = false;
  public confirmMessage: string = '';
  private currentProcessId: string;
  private previousProcessId: string;
  private subscription: Subscription;
  private ngUnsubscribe: Subject<any> = new Subject();
  private hasPayload: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private transferCareService: ProgramsTransferCareService,
              private router: Router,
              private route: ActivatedRoute,
              private encounterResourceService: EncounterResourceService,
              private patientService: PatientService,
              private formListService: FormListService) {
  }

  public ngOnInit() {
    // Do not subscribe to patient service. when you reload it at the end of the process,
    // it becomes recursive
    this.patient = this.patientService.currentlyLoadedPatient.value;
    if (!_.isNil(this.patient)) {
      this._init();
    }
  }

  public ngOnDestroy(): void {
    if (!_.isNil(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }

  public fillForm(form) {
    if (form) {
      this.transferCareService.setTransferStatus(true);
      this.transferCareService.transferFromModal(this.isModal);
      let _route = '../../../formentry';
      let routeOptions = {
        queryParams: {
          transferCareEncounter: form.encounterType.uuid
        }
      };
      if (this.isModal) {
        _route = '/patient-dashboard/patient/' + this.patient.uuid
          + '/general/general/formentry';
      } else {
        _.extend(routeOptions, { relativeTo: this.route });
      }
      this.hideModal.emit(true);
      this.router.navigate([_route, form.uuid], routeOptions);
    }
  }

  private _init() {
    this.route.queryParams.subscribe((params) => {
      this.transferCareService.getPayload().subscribe((payload) => {
          this.transferCareService.setTransferStatus(false);
          if (!payload) {
            if (this.isModal) {
              this.hideModal.emit(true);
            } else {
              this.transferCareService.setTransferStatus(true);
              this.router.navigate(['..'], {relativeTo: this.route});
            }
          } else {
            this.currentProcessId = params['processId'];
            this.transferType = payload.transferType;
            this._filterTransferCareForms(_.merge(payload, {processId: params['processId']}));
          }
        }, (err) => {
          console.log(err);
          this.hasError = true;
        });
    });
  }

  private _getPatientEncounters(): Observable<any> {
    return this.encounterResourceService.getEncountersByPatientUuid(
        this.patient.uuid, false, null);
  }

  private _pickEncountersByLastTransferDate(patientEncounters: any[], payload: any) {
    let encounters = _.map(_.filter(patientEncounters, (encounter: any) => {
      let encounterDate = moment(encounter.encounterDatetime).format('DD-MM-YYYY');
      let lastDischargeDate = moment(payload.transferDate).format('DD-MM-YYYY');
      return encounterDate === lastDischargeDate;
    }), (encounter: any) => {
      return encounter.encounterType.uuid;
    });
    this.lastFilledEncounters.push({
      encounters: _.uniq(encounters),
      transferType: payload.transferType
    });
  }

  private _filterTransferCareForms(payload: any) {
    this.isBusy = true;
    this.hasError = false;
    this.transferCareService.fetchAllProgramTransferConfigs(this.patient.uuid)
      .subscribe((configs) => {
      if (configs) {
        this._loadProgramBatch(payload.programs, configs).subscribe((programs) => {
            this.formListService.getFormList().subscribe((forms: any[]) => {
                if (forms.length > 0) {
                  this.subscription = this._getPatientEncounters()
                    .subscribe((encounters) => {
                    // pick today's encounters to remove already filled forms
                    this._pickEncountersByLastTransferDate(encounters.reverse(), payload);
                    let allEncounterForms = [];
                    _.each(programs, (program) => {
                      allEncounterForms = allEncounterForms.concat(program.encounterForms);
                      this._transformProgram(program, payload);
                    });
                    this.isBusy = false;
                    this.transferCarePrograms = programs;
                    this.totalProgramsForms = (_.uniq(allEncounterForms)).length;
                    let lastFilledByTransferType = _.find(this.lastFilledEncounters,
                      (filledEncounter) => {
                      return filledEncounter.transferType === payload.transferType;
                    });
                    if (lastFilledByTransferType) {
                      let totalFilledForms =
                        _.intersection(allEncounterForms, lastFilledByTransferType.encounters);
                      this.allFormsFilled = this.totalProgramsForms === totalFilledForms.length;
                    } else {
                      this.allFormsFilled = true;
                    }
                    // transfer patient if all forms have been filled
                    if (allEncounterForms.length === 0
                      || (this.allFormsFilled &&
                        _.startsWith(this.currentProcessId, 'form_'))) {
                      this.previousProcessId = this.currentProcessId;
                      this._transferPatient(programs);
                    }

                  }, (err) => {
                    this.isBusy = false;
                    console.log(err);
                  }, () => { this.subscription.unsubscribe(); });
                }
              });
          }, (err) => {
            this.isBusy = false;
            console.log(err);
          });
      }
    }, (err) => {
      this.isBusy = false;
      console.error(err);
    });
  }

  private _transformProgram(program, payload): void {
    let unfilledForms = [];
    _.extend(program, {
      location: payload.location ? payload.location : {},
      hasForms: unfilledForms.length > 0
    });
  }

  private _transferPatient(programs: any[]) {
    this.transferCareService.transferPatient(this.patient, programs)
      .subscribe(() => {
      this.allFormsFilled = false;
      this.transferCareService.setTransferStatus(true);
      this.hasError = false;
      if (this.isModal) {
        this.transferCareService.getPayload().subscribe((payload) => {
          if (payload) {
            let head: string;
            switch (payload.transferType) {
              case 'AMPATH':
                head = 'Intra-AMPATH transfer';
                break;
              case 'NON-AMPATH':
                head = 'Extra-AMPATH transfer';
                break;
              case 'DISCHARGE':
                head = 'Discharge';
                break;
            }
            this.hasPayload.next(true);
            this.confirmMessage = head + ' has been completed successfully.';
          }
        });
        if (this.hasPayload.getValue()) {
          this.isBusy = false;
          this.modalProcessComplete = true;
          setTimeout(() => {
            this.transferCareService.setTransferStatus(false);
            this.hasPayload.next(false);
            this.modalProcessComplete = false;
            this.hideModal.emit(true);
            this._completeProcess();
            let currentUrl = this.router.url.split('?')[0];
            this.router.navigate([currentUrl]);
            this.patientService.fetchPatientByUuid(this.patient.uuid);
          }, 2500);
        }
      } else {
        setTimeout(() => {
          this._completeProcess();
          this.router.navigate(['..'], {relativeTo: this.route});
          this.patientService.fetchPatientByUuid(this.patient.uuid);
        }, 50);
      }
    }, (err) => {
      this.isBusy = false;
      this.hasError = true;
    });
  }

  private _loadProgramBatch(programs: any[], configs: any[]): Observable<any[]> {
    let programBatch: Array<Observable<any>> = [];
    _.each(programs, (program: any) => {
      programBatch.push(this.transferCareService.attachEncounterForms(program, configs));
    });
    return Observable.forkJoin(programBatch);
  }

  private _completeProcess() {
    // this.transferCareService.savePayload(null);
    this.currentProcessId = undefined;
    this.allFormsFilled = false;
  }
}
