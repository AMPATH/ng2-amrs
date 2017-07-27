import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs/Rx';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from './program.service';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';

@Injectable()
export class PatientProgramService {
  public enrolledPrograms: Subject<any[]> = new Subject();
  private subscription: Subscription;
  private _datePipe: DatePipe;
  constructor(private routesProviderService: RoutesProviderService,
              private programService: ProgramService) {
    this._datePipe = new DatePipe('en-US');
  }

  public getCurrentlyEnrolledPatientPrograms(uuid): Observable<any> {
    this.loadProgramBatch(uuid);
    return Observable.create((observer: BehaviorSubject<any[]>) => {
        this.enrolledPrograms.subscribe(
          (data) => {
            if (data) {
              observer.next(data);
            }
          },
          (error) => {
            observer.error(error);
          }
        );
    }).first();
  }

  private loadProgramsPatientIsEnrolledIn(patientUuid: string) {
    return Observable.create((observer: Subject<Array<ProgramEnrollment>>) => {
      if (patientUuid) {
        this.programService.getPatientEnrolledProgramsByUuid(patientUuid).subscribe(
          (data) => {
            if (data) {
              observer.next(data);
            }
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('patientUuid is required');
      }
    }).first();
  }

  private getAvailablePrograms() {
    return Observable.create((observer: Subject<Array<Program>>) => {
      this.programService.getAvailablePrograms().subscribe(
        (programs) => {
          if (programs) {
            observer.next(programs);
          }
        },
        (error) => {
          observer.error(error);
        }
      );
    }).first();
  }

  private loadProgramBatch(patientUuid: string): void {
    let dashboardRoutesConfig: any = this.routesProviderService.patientDashboardConfig;
    let programBatch: Array<Observable<any>> = [];
    programBatch.push(this.loadProgramsPatientIsEnrolledIn(patientUuid));
    programBatch.push(this.getAvailablePrograms());
    this.subscription = Observable.forkJoin(programBatch).subscribe((data) => {
        let enrolledProgrames = data[0];
        let _programs = [];
        // data[1] = availablePrograms
        _.each(data[1], (program: any) => {
          let _enrolledPrograms: Array<any> = _.filter(enrolledProgrames,
            (enrolledProgram: any) => {
              return enrolledProgram.programUuid === program.uuid &&
                _.isNil(enrolledProgram.dateCompleted) && !enrolledProgram.voided;
            });
          let _enrolledProgram: any;
          if (_enrolledPrograms.length > 0) {
            _enrolledProgram = _.last(_enrolledPrograms);
          }

          let route: any = _.find(dashboardRoutesConfig.programs, (_route: any) => {
            return _route['requiresPatientEnrollment'] && _route['programUuid'] === program.uuid;
          });

          _programs.push({
            program: program,
            enrolledProgram: _enrolledProgram,
            programUuid: program.uuid,
            isFocused: false,
            isEdit: false,
            dateEnrolled: (!_.isNil(_enrolledProgram) && _.isNil(_enrolledProgram.dateCompleted)) ?
              this._datePipe.transform(_enrolledProgram.dateEnrolled, 'yyyy-MM-dd') : null,
            dateEnrolledView: (!_.isNil(_enrolledProgram)
            && _.isNil(_enrolledProgram.dateCompleted)) ?
              this._datePipe.transform(_enrolledProgram.dateEnrolled, 'dd-MM-yyyy') : null,
            dateCompleted: null,
            validationError: '',
            baseRoute: route ? route.alias : '',
            buttons: {
              landing: {
                display: 'Go to Program',
                url: route ? '/patient-dashboard/patient/' + patientUuid + '/' +
                  route.baseRoute + '/landing-page' : null
              },
              visit: {
                display: 'Start Visit',
                url: route ? '/patient-dashboard/patient/' + patientUuid + '/' +
                  route.baseRoute + '/visit' : null
              }
            },
            isEnrolled: !_.isNil(_enrolledProgram) && _.isNil(_enrolledProgram.dateCompleted)
          });
        });
        this.enrolledPrograms.next(_programs);
      },
      (err) => {
        this.enrolledPrograms.error(err);
      },
      () => {
        this.subscription.unsubscribe();
      }
    );
  }

}
