
import {
  Component,
  OnInit , OnDestroy , AfterViewInit,
  Output , EventEmitter, Input , ChangeDetectorRef,
  ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import * as _ from 'lodash';
import { PatientProgramResourceService } from './../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';

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
    public activePrograms: any = [];
    public filterdepartment: string = 'hiv';
    public departmentKey: string = 'department';
    public filterParams: string = '';
    public encounters: any = [];
    public savedDepts: any  = [];
    public dropdownSettings: any = {
                                  'singleSelection': false,
                                  'text': 'Select or enter to search',
                                  'selectAllText': 'Select All',
                                  'unSelectAllText': 'UnSelect All',
                                  'enableSearchFilter': true
                                };
    public loadingFilters: boolean = true;

    @Output() public filterSelected: EventEmitter<any> = new EventEmitter<any>();

    constructor(
      private cd: ChangeDetectorRef,
      private router: Router,
      private route: ActivatedRoute,
      private _patientProgramService: PatientProgramResourceService,
      private localStorageService: LocalStorageService,
      private departmentProgramService: DepartmentProgramsConfigService) {

    }

    public ngOnInit() {

        this.getProgramVisitsConfig();
        // console.log('Form List', formList);
        this.getDepartmentConfig();
    }

    public getDepartmentConfig() {

     this.departmentProgramService.getDartmentProgramsConfig()
     .subscribe((results) => {
         if (results) {
              this.programDepartments = results;
              this.getSavedDepartment();
          }
     });

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
                    this.programVisitsEncounters = JSON.parse(JSON.stringify(response));
                    this.getSavedFilters();
              }
        });
    }

  public getSavedDepartment() {

       // check if department is stored in local storage
       let savedDepartment = this.localStorageService.getItem(this.departmentKey);

       let departmentsConf = this.programDepartments;

       if (savedDepartment == null) {

           /*
           if no department has been saved then load all departments
           */
           this.getAllDepartments();

       } else {

            /*
             if department was saved then use the saved value
            */

            this.getAllDepartments();

            let tempDept = [];

            setTimeout(() => {

              let departmentStored = JSON.parse(savedDepartment);

              _.each(departmentStored, (department: any, index) => {
                  this.department.push(department);

              });

              this.cd.detectChanges();

            }, 500);

            this.getAllPrograms();

       }

     }

     // get all the departments

    public getAllDepartments() {

        let departments = this.programDepartments;

        _.each(departments, ( department: any , index) => {

           let specificDepartment = {
                 'itemName': department.name,
                 'id': index
           };

           this.departments.push(specificDepartment);

        });

    }

public getSavedFilters() {

      let savedFilters = this.localStorageService.getItem('programVisitEncounterFilter');

      if (savedFilters === null) {

          // no filters have been saved
           this.loadingFilters = false;

       } else {

        this.loadSavedFilterItems()
          .then((success) => {
              this.loadingFilters = false;
          });
       }

 }

// load all the saved filter items

public loadSavedFilterItems() {

  return new Promise((resolve, reject) => {

            let savedFilters = this.localStorageService.getItem('programVisitEncounterFilter');
            let filterCount = 0;

           /*
            decode saved filters to respective program, visittypes and encounter types
           */

            let decodedFilters = JSON.parse((decodeURI(savedFilters)));

            // load filters to respective visit types and encountertypes ui

            let programTypes = decodedFilters.programType;
            let visitTypes = decodedFilters.visitType;
            let encounterTypes = decodedFilters.encounterType;
            let progVisitsEncounters = this.programVisitsEncounters;

            // get program label and id

            // load programs based on saved departments

            this.getAllPrograms();

            let programsArray = [];
            this.program = [];

            _.each(programTypes, (programType) => {
              _.each(progVisitsEncounters, (progVisits: any, index) => {

                if (index.toString() === programType) {

                  let specificProgram = {
                    'id': programType,
                    'itemName': progVisits.name
                  };

                  programsArray.push(specificProgram);

                }

              });

            });

            this.program = programsArray;

            this.cd.detectChanges();

            // load visit types based on programs saved

            this.loadVisitTypesFromPrograms();

            // load selected visit types

            this.visitType = [];
            let trackVisitTypes = [];

            _.each(visitTypes, (visitType) => {
              _.each(progVisitsEncounters, (progVisits: any, index) => {

                   let visits = progVisits.visitTypes;

                   _.each(visits, (visit: any) => {

                      if (visit.uuid === visitType &&
                      _.includes(trackVisitTypes, visitType) === false) {

                            let specificVisitType = {
                              'itemName': visit.name,
                              'id': visitType
                            };

                            this.visitType.push(specificVisitType);
                            trackVisitTypes.push(visitType);

                       }

                   });

              });

            });

            // load encounter types based on visitTypes available

            this.loadEncounterTypesFromVisitTypes();
            let trackEncounters = [];
            this.encounterType = [];

            // load selected encounter types if any

            _.each(encounterTypes, (encounterType) => {
              _.each(progVisitsEncounters, (progVists: any, index) => {

                let visits = progVists.visitTypes;

                _.each(visits, (visit: any) => {

                    let encounters = visit.encounterTypes;

                    _.each(encounters, (encounter: any) => {

                      if (encounterType === encounter.uuid
                        && _.includes(trackEncounters, encounter.uuid) === false) {

                            let specificEncounterType = {
                              'itemName': encounter.display,
                              'id': encounter.uuid
                            };
                            this.encounterType.push(specificEncounterType);
                            trackEncounters.push(encounter.uuid);
                      }
                    });

                });

              });

            });

            filterCount++;

            resolve('success');

  });

}

        // load all programs

  public getAllPrograms() {

        this.programs = [];

        let allPrograms  = [];

        let programsVisitsConf = this.programVisitsEncounters;

        _.each(programsVisitsConf, (program: any, index) => {

            let specificProgram = {
              'id': index,
              'itemName': program.name
            };

            allPrograms.push(specificProgram);

          });

        this.programs = allPrograms;

    }

    public selectDepartment(department) {

        let departmentsSelected = this.department;

        this.programs = [];
        this.trackPrograms = [];

        _.each(departmentsSelected, (departmentSelected: any) => {
           this.getPrograms(departmentSelected);
        });

    }

    public onDeSelectAllDepartment($item) {
    }

    public selectProgram(item) {
      this.filterSet = false;
      this.loadVisitTypesFromPrograms();
    }

    public onSelectAllPrograms(item) {

      this.filterSet = false;
      this.loadVisitTypesFromPrograms();

    }

    public onDeSelectAllPrograms(item) {

      this.filterSet = false;
      this.visitType = [];
      this.visitTypes = [];
      this.encounterType = [];
      this.encounterTypes = [];

    }

  public getPrograms(departmentSelected) {

        let departments = this.programDepartments;
        let programs = this.programVisitsEncounters;
        let programsArray = [];

        _.each(departments, (department: any, index) => {

          if (index === departmentSelected.id) {

          let deptPrograms = department.programs;

          _.each(deptPrograms, (program: any) => {

            let specificProgram = {
              'id': program.uuid,
              'itemName': program.name
            };

            if (_.includes(this.trackPrograms, program.uuid ) === false) {
                 this.programs.push(specificProgram);
                 this.trackPrograms.push(program.uuid);

            }else {
            }

          });

          }

        });

        this.loadProgramFromPrograms();

    }

    public loadProgramFromPrograms() {

        this.program = [];
        this.selectedProgramType = [];

        _.each(this.programs, (program: any , index) => {
              let specificProgram = {
                'itemName': program.itemName,
                'id': program.id
              };
              this.program.push(specificProgram);
        });

        setTimeout(() => {
          this.loadVisitTypesFromPrograms();
        }, 500);

    }

    public loadVisitTypesFromPrograms() {

      let programsSelected = this.program;
      let programVisitEncounters = this.programVisitsEncounters;

      _.each(programsSelected, (program: any) => {
             let progUuid = program.id;

             _.each(programVisitEncounters, (programVisit: any, index) => {

               if (index === progUuid) {
                   // load all the visittypes for the program
                   let visitTypes = programVisit.visitTypes;

                   _.each(visitTypes, (visitType: any) => {
                     let specificVisitType = {
                       'itemName': visitType.name,
                       'id': visitType.uuid
                     };

                     this.visitTypes.push(specificVisitType);
                   });
               }
             });

      });

    }

    public addEncounterTypes(visitTypeSelected) {

       let programVisitEnounters = this.programVisitsEncounters;

       let visitTypeUuid = visitTypeSelected.id;

       _.each(programVisitEnounters, (programVisit: any, index) => {

         let visitTypes = programVisit.visitTypes;

         _.each(visitTypes, (visitType: any) => {

           if (visitType.uuid === visitTypeUuid) {

             // load the visitTypes encounterTypes
             let encounterTypes = visitType.encounterTypes;
             _.each(encounterTypes, (encounterType: any) => {

               let specificEncounterType = {
                 'id': encounterType.uuid,
                 'itemName': encounterType.display
               };

               this.encounterTypes.push(specificEncounterType);

             });

           }
         });
       });

    }

    public loadEncounterTypesFromVisitTypes() {

      /*
         checks the available saved selected visit type and
         loads the available encounter types for the
         visit types
      */

        let programVisitEnounters = this.programVisitsEncounters;
        let visits = this.visitType;
        this.encounterTypes = [];

        _.each(visits, (visit: any) => {

            _.each(programVisitEnounters, (programVisit: any, index) => {

                let visitTypes = programVisit.visitTypes;

                _.each(visitTypes, (visitType: any) => {

                  if (visitType.uuid === visit.id) {

                    // load the visitTypes encounterTypes
                    let encounterTypes = visitType.encounterTypes;
                    _.each(encounterTypes, (encounterType: any) => {

                      let specificEncounterType = {
                        'id': encounterType.uuid,
                        'itemName': encounterType.display
                      };

                      this.encounterTypes.push(specificEncounterType);

                    });

                  }
                });
              });

        });

    }

    public selectVisitType($event) {

      // add the visitTypes encounter types
      this.addEncounterTypes($event);

      this.filterSet = false;

    }

    public selectEncounterType($event) {

       this.filterSet = false;

    }

    public encounterTypeDeSelect($event) {

      this.filterSet = false;

    }

    public onSelectAllDepartments($event) {

      this.selectDepartment($event);
      this.filterSet = false;

    }

    public onSelectAllVisitTypes($event) {

      let selectedVisitTypes = $event;

      _.each(selectedVisitTypes, (visitType: any) => {
            this.addEncounterTypes(visitType);
      });

    }

    public programDeSelect($event) {

      /*
      get visit types, encounter types under the program
      and remove them
      */

      let progaramVisitEncounters = this.programVisitsEncounters;
      let programVisitTypes = [];
      let programEncounterTypes = [];
      let selectedProgramUuid = $event.id;

      _.each(progaramVisitEncounters, (pve: any, index) => {
        let programUuid = index.toString();
        if (programUuid === selectedProgramUuid) {
          let visitTypes = pve.visitTypes;
          _.each(visitTypes, (visitType: any) => {
            programVisitTypes.push(visitType.uuid);

            let encounterTypes = visitType.encounterTypes;
            _.each(encounterTypes, (encounterType: any) => {
              programEncounterTypes.push(encounterType.uuid);
            });
          });

        }
      });

      this.removeVisitTypes(programVisitTypes);

      this.removeEncounterTypes(programEncounterTypes);

      this.filterSet = false;

    }

    public visitTypeDeSelect($event) {

      let progaramVisitEncounters = this.programVisitsEncounters;
      let visitEncounterTypes = [];
      let selectedVisitTypeUuid = $event.id;

      _.each(progaramVisitEncounters, (pve: any, index) => {
        let programUuid = index.toString();
        let visitTypes = pve.visitTypes;
        _.each(visitTypes, (visitType: any) => {
          if (selectedVisitTypeUuid === visitType.uuid) {
            let encounterTypes = visitType.encounterTypes;
            _.each(encounterTypes, (encounterType: any) => {
              visitEncounterTypes.push(encounterType.uuid);
            });

          }

        });
      });

      this.filterSet = false;

      this.removeEncounterTypes(visitEncounterTypes);

    }

    public OnItemDeSelect($event) {

    }

    public sendNewRequest() {

      this.setFilterParams();

      let params = {
        'programType': this.selectedProgramType,
        'visitType': this.selectedVisitType,
        'encounterType': this.selectedEncounterType
      };

      let encodedParams = encodeURI(JSON.stringify(params));

      this.emitParams(params);

      this.localStorageService.setItem('department', JSON.stringify(this.department));

      const currentParams = this.route.snapshot.queryParams;
      let navigationData = {
        queryParams: {
          filter: encodedParams
        },
        replaceUrl: true
      };

      let currentUrl = this.router.url;

      let routeUrl = currentUrl.split('?')[0];
      this.router.navigate([routeUrl], navigationData);

    }

    public setFilter() {

      this.sendNewRequest();

      this.filterSet = true;

    }

     public emitParams(params) {

           let urlParams = encodeURI(JSON.stringify(params));

           let cookieKey = 'programVisitEncounterFilter';

           let cookieVal =  urlParams;

           let programVisitStored = this.localStorageService.getItem(cookieKey);

           if (programVisitStored === null) {

           } else {

             this.localStorageService.remove('programVisitEncounterFilter');

           }

           this.localStorageService.setItem('programVisitEncounterFilter', cookieVal);

           this.filterSelected.emit(params);

    }

    /*
     on deselecting a department remove its associated programs,
     visit types and encounter types
    */

    public departmentDeselect($event) {

         let departmentUuid = $event.id;
         let departmentPrograms = [];
         let programVisitEncounters = this.programVisitsEncounters;
         let departmentVisitTypes = [];
         let departmentEncounterTypes = [];

         // get all the programs under the department

         _.each(this.programDepartments, (department: any, index) => {
                  if (index === departmentUuid) {
                         _.each(department.programs, (deptProgram: any) => {
                           departmentPrograms.push(deptProgram.uuid);
                         });
                     }
         });

         // get all visit types and encountertypes in the department

         _.each(programVisitEncounters, (progVisitsEncounters, index) => {
                  let programUuid = index.toString();
                  if (_.includes(departmentPrograms, programUuid) === true) {

                      let visitTypes = progVisitsEncounters.visitTypes;
                      _.each(visitTypes, (visitType: any) => {
                            departmentVisitTypes.push(visitType.uuid);

                            let encounterTypes = visitType.encounterTypes;
                            _.each(encounterTypes, (encounterType: any) => {
                                    departmentEncounterTypes.push(encounterType.uuid);
                            });
                      });

                   }
         });

         this.removeProgramTypes(departmentPrograms);

         this.removeVisitTypes(departmentVisitTypes);

         this.removeEncounterTypes(departmentEncounterTypes);

         this.filterSet = false;

         this.cd.detectChanges();

    }
    /*
     remove programs on removing parent
    */

    public removeProgramTypes(programUuids) {

       // remove programsType in the department removed

         for (let i = this.programs.length - 1; i >= 0; i--) {
           let programUuid = this.programs[i].id;
           if (_.includes(programUuids, programUuid) === true) {
             this.programs.splice(i, 1);
           } else {
           }
         }

         // remove from program

         for (let i = this.program.length - 1; i >= 0; i--) {
           let programUuid = this.program[i].id;

           if (_.includes(programUuids, programUuid) === true) {
             this.program.splice(i, 1);
           }
         }

    }

    /*
     remove visitTypes on removing their parent

    */

    public removeVisitTypes(visitTypesUuids) {

       // remove from visitTypes model

         for (let i = this.visitTypes.length - 1; i >= 0; i--) {
           let visitTypeUuid = this.visitTypes[i].id;

           if (_.includes(visitTypesUuids, visitTypeUuid) === true) {
             this.visitTypes.splice(i, 1);
           }
         }

         // remove from visitType model

         for (let i = this.visitType.length - 1; i >= 0; i--) {
           let visitTypeId = this.visitType[i].id;

           if (_.includes(visitTypesUuids, visitTypeId) === true) {
             this.visitType.splice(i, 1);
           }
         }

    }

    /*
     remove encounterTypes on removing their parent

    */

    public removeEncounterTypes(enconterTypeUuids) {

       // remmove from encounter types model
         for (let i = this.encounterTypes.length - 1; i >= 0; i--) {
           let encounterTypeUuid = this.encounterTypes[i].id;

           if (_.includes(enconterTypeUuids, encounterTypeUuid) === true) {
             this.encounterTypes.splice(i, 1);
           }
         }

         // remmove from encounter type model
         for (let i = this.encounterType.length - 1; i >= 0; i--) {
           let encounterTypeid = this.encounterType[i].id;

           if (_.includes(enconterTypeUuids, encounterTypeid) === true) {
             this.encounterType.splice(i, 1);
           }
         }

    }

    public setFilterParams() {

      let selectedProgram = this.program;
      let programArray  = [];
      let selectedVisitType = this.visitType;
      let visitTypeArray = [];
      let selectedEncounterType = this.encounterType;
      let encounterTypeArray = [];

      // strip property names and remain with array of uuids

      _.each(selectedProgram, (program: any) => {
           programArray.push(program.id);
      });

      _.each(selectedVisitType, (visitType: any) => {
           visitTypeArray.push(visitType.id);
      });

      _.each(selectedEncounterType, (encounterType: any) => {
           encounterTypeArray.push(encounterType.id);
      });

      this.selectedProgramType = programArray;
      this.selectedVisitType = visitTypeArray;
      this.selectedEncounterType = encounterTypeArray;

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
       let programVisitStored = this.localStorageService.getItem(cookieKey);
       let departmentStored = this.localStorageService.getItem('department');

       if (programVisitStored === null) {

       } else {

         this.localStorageService.remove(cookieKey);

       }

       if (departmentStored === null) {

       } else {

         this.localStorageService.remove('department');

       }

       this.sendNewRequest();

       // this.emitParams(params);

    }

}
