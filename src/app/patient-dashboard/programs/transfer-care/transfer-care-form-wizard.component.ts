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
  public lastDischargeEncounters: any[] = [];
  public isBusy: boolean = false;
  public allFormsFilled: boolean = false;
  public modalProcessComplete: boolean = false;
  public confirmMessage: string = '';
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
    this._init();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    this.transferCareService.getPayload().takeUntil(this.ngUnsubscribe)
      .subscribe((payload) => {
      this.transferCareService.setTransferStatus(false);
      if (!payload) {
        if (this.isModal) {
          this.hideModal.emit(true);
        } else {
          this.transferCareService.setTransferStatus(true);
          this.router.navigate(['..'], {relativeTo: this.route});
        }
      } else {
        this.transferType = payload.transferType;
        this.patientService.currentlyLoadedPatient.takeUntil(this.ngUnsubscribe)
          .subscribe((patient) => {
            if (patient !== null) {
              this.patient = patient;
              this.hasError = false;
              this._filterTransferCareForms(payload);
            }
          });
      }
    }, (err) => {
      console.log(err);
      this.hasError = true;
    });
  }

  private _getPatientEncounters(): Observable<any> {
    return Observable.create((observer: Subject<any>) => {
      this.encounterResourceService.getEncountersByPatientUuid(this.patient.uuid, false, null)
        .takeUntil(this.ngUnsubscribe).subscribe((resp) => {
        observer.next(resp.reverse());
      });
    });
  }

  private _pickEncountersByLastDischargeDate(patientEncounters: any[], date: string) {
    let encounters = _.map(_.filter(patientEncounters, (encounter: any) => {
      let encounterDate = moment(encounter.encounterDatetime).format('DD-MM-YYYY');
      let lastDischargeDate = moment(date).format('DD-MM-YYYY');
      return encounterDate === lastDischargeDate;
    }), (encounter: any) => {
      return encounter.encounterType.uuid;
    });
    this.lastDischargeEncounters = _.uniq(encounters);
  }

  private _filterTransferCareForms(payload: any) {
    this.isBusy = true;
    this.hasError = false;
    if (this.transferType === 'AMPATH') {
      this._transferPatient(_.map(payload.programs, (p) => {
        return _.extend(p, {location: payload.location ? payload.location : {}});
      }));
    } else {
      this.transferCareService.fetchAllProgramTransferConfigs(this.patient.uuid)
        .takeUntil(this.ngUnsubscribe).subscribe((configs) => {
          if (configs) {
            this._loadProgramBatch(payload.programs, configs).takeUntil(this.ngUnsubscribe)
              .subscribe((programs) => {
                this.formListService.getFormList().takeUntil(this.ngUnsubscribe)
                  .subscribe((forms: any[]) => {
                    if (forms.length > 0) {
                      this._getPatientEncounters().subscribe((encounters) => {
                        let encounterTypeUuids = _.map(forms, (form) => {
                          return form.encounterType.uuid;
                        });

                        // pick today's encounters to remove already filled forms
                        this._pickEncountersByLastDischargeDate(encounters, payload.transferDate);
                        let allEncounterForms = [];
                        _.each(programs, (program) => {
                          allEncounterForms = allEncounterForms.concat(program.encounterForms);
                          this._transformProgram(program, payload, encounterTypeUuids);
                        });
                        this.isBusy = false;
                        this.transferCarePrograms = programs;
                        this.totalProgramsForms = (_.uniq(allEncounterForms)).length;
                        let totalFilledForms =
                          _.intersection(allEncounterForms, this.lastDischargeEncounters);
                        this.allFormsFilled = this.totalProgramsForms === totalFilledForms.length;
                        // transfer patient if all forms have been filled
                        if (this.allFormsFilled) {
                          this._transferPatient(programs);
                        }
                      }, (err) => {
                        this.isBusy = false;
                        console.log(err);
                      });
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
  }

  private _transformProgram(program, payload, encounterTypeUuids): void {
    let unfilledForms = [];
    if (this.lastDischargeEncounters.length > 0) {
      unfilledForms = _.filter(program.encounterForms, (form) => {
        return !_.includes(this.lastDischargeEncounters, form);
      });
    }
    unfilledForms = _.compact(unfilledForms);
    console.log(unfilledForms, encounterTypeUuids);
    _.extend(program, {
      location: payload.location ? payload.location : {},
      hasForms: unfilledForms.length > 0,
      excludedForms: _.xor(unfilledForms, encounterTypeUuids)
    });
  }

  private _transferPatient(programs: any[]) {
    this.transferCareService.transferPatient(this.patient, programs)
      .takeUntil(this.ngUnsubscribe).subscribe(() => {
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
            this.hideModal.emit(true);
            this.patientService.fetchPatientByUuid(this.patient.uuid);
          }, 2000);
        }
      } else {
        setTimeout(() => {
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
}
