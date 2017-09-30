import {
  Component,
  OnInit , OnDestroy , AfterViewInit,
  Output , EventEmitter, Input , ChangeDetectorRef }
  from '@angular/core';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie';
import { PatientProgramResourceService } from './../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';

@Component({
  selector: 'program-visit-encounter-search',
  templateUrl: './program-visit-encounter-search.component.html',
  styleUrls: ['./program-visit-encounter-search.component.css']
})

export class ProgramVisitEncounterSearchComponent implements OnInit, OnDestroy , AfterViewInit {

    public selectedProgram: string;
    public programs: Array <any> = [];
    public visitTypes: Array <any> = [];
    public encounterTypes: any = [];
    public departmentConf: any[] = require('./department-programs-config.json');
    public programDepartments: any = [];
    public programVisitsEncounters: any[];
    public selectedEncounterType: any = [];
    public selectedProgramType: any = [];
    public selectedVisitType: any  = [];
    public params: any = [];
    public filterKeys: any = [];
    public program: any = [];
    public department: any = [];
    public visitType: any  = [];
    public visits = [];
    public encounterType: any = [];
    public filterSet: boolean = false;
    public departments: any = [];
    public trackPrograms: any = [];
    public trackVisitTypes: any = [];
    public trackEncounterTypes: any = [];
    public filterError: boolean = false;

    @Output() public filterSelected: EventEmitter<any> = new EventEmitter<any>();

    constructor(
      private cd: ChangeDetectorRef,
      private _cookieService: CookieService,
      private _patientProgramService: PatientProgramResourceService,
      private localStorageService: LocalStorageService) {

    }

    public ngOnInit() {
      this.clearEncounterCookie();
      this.getProgramVisitsConfig();
      this.getDepartmentConfig();
    }

    public getDepartmentConfig() {
        this.programDepartments = JSON.parse(JSON.stringify(this.departmentConf));
        if (this.programDepartments) {
            this.getAllDepartments();
        }

    }

    public ngOnDestroy() {

    }

    public ngAfterViewInit(): void {
      this.cd.detectChanges();
    }

    public getProgramVisitsConfig() {
       this._patientProgramService.getAllProgramVisitConfigs()
        .subscribe((response) => {
              if (response) {
                    console.log('ProgramVisitsConfig ', response);
                    this.programVisitsEncounters = JSON.parse(JSON.stringify(response));
              }
        });
    }

     // get all the programs

    public getAllDepartments() {

        let departments = this.programDepartments;

        _.each(departments, ( department: any , index) => {

           let specificDepartment = {
                 'label': department.name,
                 'value': index
           };

           // console.log('Department', specificDepartment);
           this.departments.push(specificDepartment);

        });

    }

    public getPrograms(departmentUuid) {

        // console.log('Get Departments', departmentUuid);

        let departments = this.programDepartments;
        let programs = this.programVisitsEncounters;

        _.each(departments, (department: any, index) => {
          // console.log('Department', index);

          if (index === departmentUuid) {

          let deptPrograms = department.programs;

          _.each(deptPrograms, (program: any) => {

            let specificProgram = {
              'label': program.name,
              'value': program.uuid
            };

            if (_.includes(this.trackPrograms, program.uuid ) === false) {
                 console.log('');
                 this.programs.push(specificProgram);
                 this.trackPrograms.push(program.uuid);

            }else {
               // console.log('Program already selected');
            }

          });

          }

        });

    }

    // get visitType Selected based on program selected

    public  getVisitTypes(progUuid) {

      console.log('Get Visit Types', progUuid);

      let programs = this.programVisitsEncounters;

      _.each(programs, (program: any, index) => {
        if (progUuid === index) {

          let visitTypes = program.visitTypes;

          _.each(visitTypes, (visitType: any) => {

             let specificVisitType = {
               'label': visitType.name,
               'value': visitType.uuid
             };
             if (_.includes(this.trackVisitTypes, visitType.uuid) === false) {
               console.log('');
               this.visits.push(specificVisitType);
               this.trackVisitTypes.push(visitType.uuid);

             } else {
               console.log('VisitType already selected');
             }

          });

          this.visitTypes = this.visits;

        }

      });

      console.log('Visit Types', this.visitTypes);

    }

    public getEncounterTypes(visitTypeUuid) {

       let programs = this.programVisitsEncounters;

       _.each(programs, (program: any, index) => {

         let visitTypes = program.visitTypes;

         _.each(visitTypes, (visitTyp: any) => {

           let visitUuid = visitTyp.uuid;

           if (visitTypeUuid === visitUuid) {

             let encounterTypes = visitTyp.encounterTypes;

             _.each(encounterTypes, (encounterType: any) => {

               let specificEncounterType = {
                 'label': encounterType.display,
                 'value': encounterType.uuid
               };

               if (_.includes(this.trackEncounterTypes, encounterType.uuid ) === false) {
                    console.log('Encounter Type is already there');
                    this.encounterTypes.push(specificEncounterType);
                    this.trackEncounterTypes.push(encounterType);

               }else {
                   console.log('Encounter Type already selected');
                }

             });

           }

         });

       });

    }

    public selectDepartment(department) {

        console.log('Department Selected', department);

        let departmentsSelected = this.department;

        this.programs = [];
        this.trackPrograms = [];

        _.each(departmentsSelected, (departmentSelected: any) => {
           console.log('Department Selected', departmentSelected);
           this.getPrograms(departmentSelected);
        });

    }

    public selectProgram(program) {

       // console.log('Program Selected', program);

       // get list of programs selected

       let programsSelected = this.program;

       this.visits = [];
       this.trackVisitTypes = [];

       _.each(programsSelected, (programSelected: any) => {
             console.log('Program Selected', programSelected);
             this.getVisitTypes(programSelected);
       });

       // let programUuid = program.value;

       // console.log('Program Uuid', programUuid);

       this.selectedProgramType = this.program;

       this.filterSet = false;

    }

    public selectVisitType(visitType) {

       console.log('Visit Type Selected', visitType);

       // get a list of visitTypes selected

       this.encounterTypes = [];

       let selectedVisitTypes = this.visitType;

       _.each(selectedVisitTypes, (selectedVisit: any) => {
             console.log('Visit Selected', selectedVisit);
             this.getEncounterTypes(selectedVisit);
       });

       let visitTypeUuid = visitType.value;

       this.selectedVisitType = this.visitType;
       this.filterSet = false;

    }

    public departmentChange($event) {
       console.log('Department Change', $event);
       this.updatePrograms($event);
       this.filterSet = false;
    }

    public programChange($event) {
        console.log('Program Change', $event);
        this.updateVisitTypes($event);
        this.filterSet = false;
        this.selectedProgramType = $event;

    }

    public encounterTypeChange($event) {
        console.log('EncounterType Change', $event);
        // this.updateEncounterTypes($event);
        this.selectedEncounterType = $event;
        this.filterSet = false;

    }

    public updatePrograms(departments) {

        this.programs = [];
        this.trackPrograms = [];
        _.each(departments, (department: any, index) => {
            this.getPrograms(department);
        });

    }

    public updateVisitTypes(programs) {
          this.visits = [];
          this.trackVisitTypes = [];
          _.each(programs, (program: any, index) => {
            this.getVisitTypes(program);
          });
    }

    public visitTypeChange($event) {
          console.log('Visit Type Change', $event);
          this.updateEncounterTypes($event);
          this.selectedVisitType = this.visitType;

    }

    public updateEncounterTypes(visitTypes) {
      this.encounterTypes = [];
      _.each(visitTypes, (visitType: any, index) => {
        this.getEncounterTypes(visitType);
      });

    }

    public selectAllDepartments() {

      this.department = [];

      _.each(this.departments, (department: any, index) => {
        this.department.push(department.value);
      });

    }

    public clearDepartments() {

       this.department = [];
       this.programs = [];
       this.program = [];
       this.visitType = [];
       this.visitTypes = [];
       this.encounterTypes = [];
       this.encounterType = [];
       this.selectedProgramType = [];
       this.filterSet = false;

    }

    public clearPrograms() {

       this.program = [];
       this.visitType = [];
       this.visitTypes = [];
       this.encounterTypes = [];
       this.encounterType = [];
       this.selectedProgramType = [];
       this.filterSet = false;

    }

    public clearVisitTypes() {
      this.visitType = [];
      this.encounterType = [];
      this.encounterTypes = [];
      this.filterSet = false;

    }

    public clearEncounterTypes() {

      this.encounterType = [];
      this.filterSet = false;

    }
    public selectAllPrograms() {

        // load all the programs to programs select module

         console.log('Select all Programs');

         this.program = [];

         _.each(this.programs, ( program, index) => {
                this.program.push(program.value);
         });

         this.selectedProgramType = this.program;

         console.log('Selected Program Types', this.selectedProgramType);

    }
    public selectAllVisitTypes() {

        // load all the programs to programs select module

         console.log('Select all Visit Types');

         this.visitType = [];

         _.each(this.visitTypes, ( visit: any , index) => {
                this.visitType.push(visit.value);
         });

         this.selectedVisitType = this.visitType;

         console.log('Selected Visit Type', this.selectedVisitType);

    }
    public selectAllEncouterTypes() {

         console.log('Select All Encounter Types');

         // load all the programs to programs select module

         this.encounterType = [];

         _.each(this.encounterTypes, ( encounter: any , index) => {
                this.encounterType.push(encounter.value);
         });

         this.selectedEncounterType = this.encounterType;

         console.log('Selected Encounter Type', this.selectedEncounterType);

    }

    public selectEncounterType(encounterType) {

      let encounterUuid = encounterType.uuid;

      let filterKey = {
        'type': 'Encounter Type',
        'value': encounterType.name
      };

      this.filterKeys.push(filterKey);

      this.selectedEncounterType = this.encounterType;
      this.filterSet = false;

    }

    // load all the programs when it loads

    public  allProgramsInitialLoad() {

       let params = {
         'programType': [],
         'visitType': [],
         'encounterType': []
       };

       // load inital params

       this.emitParams(params);

    }

    public emitParams(params) {

           let urlParams = encodeURI(JSON.stringify(params));

           let cookieKey = 'programVisitEncounterFilter';

           let cookieVal =  urlParams;

           let programVisitCookie = this._cookieService.get(cookieKey);

           console.log('Cookie val', urlParams);

           if (typeof programVisitCookie === 'undefined') {

                console.log('Set Cookie val');

           } else {

             console.log('Change Cookie val');

             this._cookieService.remove(cookieKey);

             this.localStorageService.remove('programVisitEncounterFilter');

           }

           this.localStorageService.setItem('programVisitEncounterFilter', cookieVal);

           this._cookieService.put(cookieKey, 'true');

           // let decodedUrlParams = decodeURI(urlParams);

           this.filterSelected.emit(params);

           console.log('Emit Params', params);

           this.filterSet = true;

           // console.log('Decoded Params', decodedUrlParams);

    }

    public getMonthlyScheduleParameters() {

      console.log('Get Monthly Params');

      let params = {
        'programType': this.selectedProgramType,
        'visitType': this.selectedVisitType,
        'encounterType': this.selectedEncounterType
      };

      this.emitParams(params);

    }

    public clearEncounterCookie() {

       let cookieKey = 'programVisitEncounterFilter';
       let programVisitCookie = this._cookieService.get(cookieKey);

       console.log('Clearing filter data..');

       if (typeof programVisitCookie === 'undefined') {

       } else {

         this._cookieService.remove(cookieKey);

         this.localStorageService.remove(cookieKey);

       }

    }

    public resetFilter() {
       this.department = [];
       this.program = [];
       this.visitType = [];
       this.visitTypes = [];
       this.encounterTypes = [];
       this.encounterType = [];
       this.selectedProgramType = [];
       this.selectedEncounterType = [];
       this.selectedVisitType = [];
       this.filterSet = false;

       let cookieKey = 'programVisitEncounterFilter';
       let programVisitCookie = this._cookieService.get(cookieKey);

       console.log('Cookie Val', typeof programVisitCookie);

       if (typeof programVisitCookie === 'undefined') {

       } else {

         this._cookieService.remove(cookieKey);

         this.localStorageService.remove(cookieKey);

       }

       let params = {
         'programType': this.selectedProgramType,
         'visitType': this.selectedVisitType,
         'encounterType': this.selectedEncounterType
       };

       // this.emitParams(params);

    }

}
