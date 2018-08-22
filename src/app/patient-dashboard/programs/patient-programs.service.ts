import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


import * as _ from 'lodash';
import { Subject, Observable, forkJoin, combineLatest ,  Subscription ,  BehaviorSubject } from 'rxjs';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from './program.service';
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
    });
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
    });
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
    });
  }

  private loadProgramBatch(patientUuid: string): void {
    let dashboardRoutesConfig: any = this.routesProviderService.patientDashboardConfig;
    let programBatch: Array<Observable<any>> = [];
    programBatch.push(this.loadProgramsPatientIsEnrolledIn(patientUuid));
    programBatch.push(this.getAvailablePrograms());


    this.subscription = combineLatest(this.loadProgramsPatientIsEnrolledIn(patientUuid),
     this.getAvailablePrograms(),
    (enrolledPrograms, availablePrograms) => {
      return { enrolledPrograms, availablePrograms };
    }
  ).subscribe((data) => {
      let enrolledPrograms = data.enrolledPrograms;
      let _programs = [];
      // data[1] = availablePrograms
      _.each(data.availablePrograms, (program: any) => {
        let _enrolledPrograms: Array<any> = _.filter(enrolledPrograms,
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
          concept: program.concept,
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
              url: route ? '/patient-dashboard/patient/' + patientUuid + '/' + route.alias + '/' +
                route.baseRoute + '/landing-page' : null
            },
            visit: {
              display: 'Program Visit',
              url: route ? '/patient-dashboard/patient/' + patientUuid + '/' + route.alias + '/' +
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
