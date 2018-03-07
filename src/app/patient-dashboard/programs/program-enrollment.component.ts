import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import * as _ from 'lodash';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'program-enrollment',
  templateUrl: './program-enrollment.component.html'
})
export class ProgramEnrollmentComponent implements OnInit {
  @Output() public onManageProgram: EventEmitter<any> = new EventEmitter();
  @Input() public onReloadPrograms: Subject<boolean>;
  public loadingPatientPrograms: boolean = false;
  public enrolledPrograms: ProgramEnrollment[];
  private patient: Patient;
  constructor(private patientService: PatientService,
              private userDefaultPropertiesService: UserDefaultPropertiesService) {}

  public ngOnInit() {
    this._init();
  }

  public updateState(enrolledProgram: any, state: any) {
    this.onManageProgram.emit({
      program: enrolledProgram,
      actionState: state
    });
  }

  public visible(state: any, row: any): boolean {
    let userLocation = (this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject())
      .uuid;
    let programLocation = row.enrolledProgram.location.uuid;
    let activeState: any = _.first(row.enrolledProgram.states);
    if (activeState) {
      return state.concept.uuid !== activeState.state.concept.uuid
        && !((userLocation !== programLocation) &&
          (
            (state.concept.uuid === '78526af3-ef12-4f53-94de-51c455ef0a88')
            ||
            (state.concept.uuid === 'e293229b-4e74-445c-bfd2-602bbe4a91fb')
          )
        );
    }
    return false;
  }

  private _init() {
    this.onReloadPrograms.subscribe((reload) => {
      if (reload) {
        this.patientService.fetchPatientByUuid(this.patient.uuid);
      }
    });
    this.loadingPatientPrograms = true;
    this.patientService.currentlyLoadedPatient.subscribe((patient) => {
        if (patient) {
          this.loadingPatientPrograms = false;
          this.patient = patient;
          this.enrolledPrograms = _.filter(patient.enrolledPrograms, 'isEnrolled');
        }
      }
    );
  }

  private _programEnrolledInCurrentLocation(program) {
    let currentLocation = (this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject())
      .uuid;
    let programLocation = program.location.uuid;

    return currentLocation === programLocation;
  }
}
