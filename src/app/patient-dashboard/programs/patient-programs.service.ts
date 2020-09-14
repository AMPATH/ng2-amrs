import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


import * as _ from 'lodash';
import { Subject, Observable, forkJoin, combineLatest, Subscription, BehaviorSubject } from 'rxjs';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from './program.service';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import { map } from 'rxjs/operators';

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
    return this.loadProgramBatch(uuid);
  }

  public loadProgramsPatientIsEnrolledIn(patientUuid: string): Observable<any> {
    return this.programService.getPatientEnrolledProgramsByUuid(patientUuid);
  }

  private getAvailablePrograms(): Observable<any> {
    return this.programService.getAvailablePrograms();
  }

  private loadProgramBatch(patientUuid: string): Observable<any> {
    let allAvailablePrograms = [];
    const dashboardRoutesConfig: any = this.routesProviderService.patientDashboardConfig;
    return this.getAvailablePrograms().flatMap((programs) => {
      allAvailablePrograms = programs;
      return this.loadProgramsPatientIsEnrolledIn(patientUuid);
    }).pipe(
      map((data) => {
        if (data) {
          // data[0] = enrolledPrograms
          // data[1] = availablePrograms
          const enrolledPrograms = data;
          const _programs = [];
          _.each(allAvailablePrograms, (program: any) => {
            let _enrolledProgram: any;
            const _enrolledPrograms = _.filter(enrolledPrograms, (enrolledProgram: any) =>
              enrolledProgram.programUuid === program.uuid && !enrolledProgram.voided);

            const route: any = _.find(dashboardRoutesConfig.programs, (_route: any) =>
              _route['requiresPatientEnrollment'] && _route['programUuid'] === program.uuid
            );
            if (_enrolledPrograms.length > 0) {
              _enrolledProgram = _.last(_enrolledPrograms);
            }
            _programs.push({
              program: program,
              concept: program.concept,
              enrolledProgram: _enrolledProgram || null,
              programUuid: program.uuid,
              isFocused: false,
              isEdit: false,
              dateEnrolled: (!_.isNil(_enrolledProgram) && _.isNil(_enrolledProgram.dateCompleted)) ?
                this._datePipe.transform(_enrolledProgram.dateEnrolled, 'yyyy-MM-dd') : null,
              dateEnrolledView: (!_.isNil(_enrolledProgram)
                && _.isNil(_enrolledProgram.dateCompleted)) ?
                this._datePipe.transform(_enrolledProgram.dateEnrolled, 'dd-MM-yyyy') : null,
              dateCompleted: (!_.isNil(_enrolledProgram) && !_.isNil(_enrolledProgram.dateCompleted))
                ? this._datePipe.transform(_enrolledProgram.dateCompleted, 'yyyy-MM-dd') : null,
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
                },
                program_manager: {
                  display: 'Exit',
                  url: route ? '/patient-dashboard/patient/' + patientUuid + '/general/general/program-manager' : null
                }
              },
              isEnrolled: !_.isNil(_enrolledProgram) && _.isNull(_enrolledProgram.dateCompleted)
            });
          });
          return _programs;
        }
      }));

  }

}
