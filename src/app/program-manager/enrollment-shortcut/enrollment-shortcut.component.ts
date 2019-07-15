import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { DepartmentProgramsConfigService } from 'src/app/etl-api/department-programs-config.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { ProgramService } from 'src/app/patient-dashboard/programs/program.service';
import { Patient } from 'src/app/models/patient.model';

@Component({
    moduleId: module.id,
    selector: 'enrollment-shortcut',
    templateUrl: 'enrollment-shortcut.component.html',
    styleUrls: ['enrollment-shortcut.component.scss']
})
export class EnrollmentShortcutComponent implements OnInit {
    public patient: Patient = null;
    public defaultDepartment: string = null;
    public allDepartmentsProgramsConf: any[] = null;
    public allProgramsInDefaultDepartmentConf: any[] = null;
    public patientEnrollablePrograms: any[] = null;
    public patientEnrolledPrograms: any[] = null;
    public isLoading: boolean;
    private patientSub: Subscription;

    constructor(public patientService: PatientService,
        public programService: ProgramService,
        public localStorageService: LocalStorageService,
        public router: Router,
        public route: ActivatedRoute,
        public departmentProgramService: DepartmentProgramsConfigService) {

    }

    public ngOnInit() {
        this.isLoading = true;
        this.subscribeToPatientChanges();
        this.fetchAllProgramsAndDepartments();
        this.determineUserDefaultDepartment();
    }

    public subscribeToPatientChanges() {
        this.patientSub = this.patientService.currentlyLoadedPatient.subscribe((patient) => {
            if (patient) {
                this.patient = patient;
            } else {
                this.patient = null;
            }
            this.determineProgramsPatientEnrolledIn();
        });
    }

    public determineProgramsPatientEnrolledIn() {
        this.patientEnrolledPrograms = null;
        if (this.patient !== null) {
            this.patientEnrolledPrograms =
                _.filter(this.patient.enrolledPrograms, 'isEnrolled');
            this.determinePossibleProgramsForPatient();
        }
    }

    public determineUserDefaultDepartment() {
        this.defaultDepartment = null;
        const department = JSON.parse(this.localStorageService.getItem('userDefaultDepartment'));
        if (Array.isArray(department) && department.length > 0) {
            this.defaultDepartment = department[0].itemName;
        } else {
            this.defaultDepartment = 'HIV';
        }
        this.filterProgramsByDefaultDepartment();
    }

    public fetchAllProgramsAndDepartments() {
        this.isLoading = true;
        this.departmentProgramService.getDartmentProgramsConfig().pipe(
            take(1)).subscribe((results) => {
                if (results) {
                  this.allDepartmentsProgramsConf =
                  _.orderBy(results,
                    ['name'], ['asc']);
                } else {
                    this.allDepartmentsProgramsConf = [];
                }
                this.filterProgramsByDefaultDepartment();
            }, (error) => {
                // TODO: Error handling
            });
    }

    public filterProgramsByDefaultDepartment() {
        this.allProgramsInDefaultDepartmentConf = null;
        if (this.defaultDepartment !== null && this.allDepartmentsProgramsConf !== null) {
            const department = _.find(this.allDepartmentsProgramsConf, (config: any) => {
                return config.name === this.defaultDepartment;
            });
            this.allProgramsInDefaultDepartmentConf = department.programs;
            this.determinePossibleProgramsForPatient();
        }
    }

    // this determines the actual possible programs that the selected patients
    // can be enrolled in. It populates the list of programs avaliable for selecting.
    public determinePossibleProgramsForPatient() {
      this.patientEnrollablePrograms = null;

      // check for whether all data requirements are loaded
      if (this.patientEnrolledPrograms !== null &&
        this.allProgramsInDefaultDepartmentConf !== null) {
          const availablePrograms = _.filter(this.allProgramsInDefaultDepartmentConf,
            (program) => {
              const enrolledProgUuids = _.map(this.patientEnrolledPrograms, (a) => a.programUuid);
              return !_.includes(enrolledProgUuids, program.uuid);
            }
          );

          this.patientEnrollablePrograms = this.filterOutIncompatiblePrograms(availablePrograms);
      }
    }

    public filterOutIncompatiblePrograms(avaliablePrograms: any[]) {
      let enrollablePrograms: any[];
      const genderIncompatiblePrograms = [
        'cad71628-692c-4d8f-8dac-b2e20bece27f', // Cervical cancer screening program
        '43b42170-b3ce-4e03-9390-6bd78384ac06', // Gyn-oncology treatment program
        '781d897a-1359-11df-a1f1-0026b9348838' // PMTCT program
      ];

      enrollablePrograms = _.filter(avaliablePrograms, p => {
        return p.uuid !== '781d8880-1359-11df-a1f1-0026b9348838'; // Express Care Program
      });

      const gender = this.patient.openmrsModel.person.gender;
      if (gender === 'M') {
        enrollablePrograms = _.filter(enrollablePrograms, program => {
          return !genderIncompatiblePrograms.includes(program.uuid);
        });
      }

      return enrollablePrograms;
    }

    public triggerEnrollment(program) {
        const enrollMentUrl = ['patient-dashboard', 'patient', this.patient.uuid,
         'general', 'general', 'program-manager', 'new-program', 'step', 3];

         const redirectUrl = this.router.url;

        const queryParams = {
            program: program.uuid,
            // redirectUrl: redirectUrl
        };
        this.router.navigate(enrollMentUrl, {queryParams: queryParams});
    }

}
