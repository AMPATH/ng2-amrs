import { Component, OnInit, OnDestroy, AfterViewInit, Output,
  EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PatientProgramResourceService } from './../etl-api/patient-program-resource.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { LocationResourceService } from './../openmrs-api/location-resource.service';

@Component({
  selector: 'department-program-filter',
  templateUrl: './department-program-filter.component.html',
  styleUrls: ['./department-program-filter.component.css']
})

export class DepartmentProgramFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  public selectedProgram: string;
  public programs: Array<any> = [];
  public departmenProgramtConfig: any = [];
  public programVisitsConfig: any[];
  public selectedProgramType: any = [];
  public program: any = [];
  public programMap = new Map();
  public department: any = [];
  public departmentMap = new Map();
  public countyMap = new Map();
  public filterSet: boolean = false;
  public departments: any = [];
  public showSelectedPrograms: boolean = true;
  public trackPrograms: any = [];
  public selectedStartDate: string = Moment().startOf('month').format('YYYY-MM-DD');
  public selectedEndDate: string = Moment().endOf('month').format('YYYY-MM-DD');
  public params: any = {
    'startDate': this.selectedStartDate,
    'endDate': this.selectedEndDate,
    'locationUuids': [],
    'programType': [],
    'department': []
  };
  public dropdownSettings: any = {
    'singleSelection': false,
    'enableCheckAll': true,
    'text': 'Select or enter to search',
    'selectAllText': 'Select All',
    'unSelectAllText': 'UnSelect All',
    'enableSearchFilter': true
  };
  public showFilters: boolean = true;
  public locationDropdownSettings: any = {
    'enableCheckAll': false,
    'singleSelection': false,
    'text': 'Select or enter to search',
    'selectAllText': 'Select All',
    'unSelectAllText': 'UnSelect All',
    'enableSearchFilter': true,
  };
  public programDropdownSettings: any = {
    'singleSelection': false,
    'enableCheckAll': true,
    'text': 'Select or enter to search',
    'selectAllText': 'Select All',
    'unSelectAllText': 'UnSelect All',
    'enableSearchFilter': true,
    'badgeShowLimit': 10
  };
  public countyDropdownSettings: any = {
    'enableCheckAll': false,
    'singleSelection': true,
    'text': 'Select or enter to search',
    'selectAllText': 'Select All',
    'unSelectAllText': 'UnSelect All',
    'enableSearchFilter': true,

  };
  public loadingFilters: boolean = true;
  public locations: any = [];
  public location: any = [];
  public multipleLocationsSelected: boolean = false;
  public locationMap = new Map();
  public county: any = [];
  public counties: any = [];
  public selectedLocation: any = [];
  public selectedFiltersOkay: boolean = true;
  public errorMsg: any = {
      'status': false,
      'message': ''
  };

  @Output() public filterSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() public filterReset: EventEmitter<boolean> = new EventEmitter<any>();

  constructor(
    private cd: ChangeDetectorRef,
    private _patientProgramService: PatientProgramResourceService,
    private departmentProgramService: DepartmentProgramsConfigService,
    private _locationResourceService: LocationResourceService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  public ngOnInit() {
    this.loadConfigs().then((result) => {
      if (result) {
        this.loadingFilters = false;
      }
    });
    this.route
    .queryParams
    .subscribe((params) => {
      if (params) {
           setTimeout(() => {
            this.loadFilterFromUrlParams(params);
           }, 500);
         }
     }, (error) => {
        console.error('Error', error);
     });
  }

  public ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  public ngOnDestroy() {

  }
  public loadFilterFromUrlParams(params) {

    let newParams: any = {
      'startDate': '',
      'endDate': '',
      'locationUuids': [],
      'programType': [],

    };

    if (params.locationUuids) {
        this.location = [];
        let locations = this.loadFilterFromMap(params.locationUuids, this.locationMap);
        this.location = locations;
        newParams.locationUuids = params.locationUuids;
    }else {
        newParams.locationUuids = [];
    }
    if (params.startDate) {
        this.selectedStartDate = params.startDate;
        newParams.startDate = params.startDate;
    }else {
         newParams.startDate = this.selectedStartDate;
    }
    if (params.endDate) {
       this.selectedEndDate = params.endDate;
       newParams.endDate = this.params.endDate;
    }else {
      newParams.endDate = this.selectedEndDate;
    }
    if (params.programType) {
       this.program = [];
       let programTypes = this.loadFilterFromMap(params.programType, this.programMap);
       if (this.showSelectedPrograms) {
           this.program = programTypes;
       }
       newParams.programType = params.programType;

    }else {
         newParams.programType = [];
    }
    if (params.department) {
        this.department = [];
        let departmentTypes = this.loadFilterFromMap(params.department, this.departmentMap);
        this.department = departmentTypes;

    }

    this.emitParams(newParams);

}

public isString(value) {
  if (typeof value === 'string') {
    return true;
  } else {
    return false;
  }
}

public loadFilterFromMap(values: any , map) {
 let filterArray = [];
 if (this.isString(values)) {
   let selectedType = map.get(values);
   filterArray.push(selectedType);
   } else {
     for (let value of values){
       let selectedType = map.get(value);
       filterArray.push(selectedType);
     }

   }
 return filterArray;

}

  public loadConfigs() {
    return new Promise((resolve, reject) => {
    this.getLocations();
    this.getDepartmentConfig();
    this.getProgramVisitsConfig();
    this.cd.detectChanges();
    resolve('success');

    });

  }
    // get current location

  public getLocations() {
    this._locationResourceService.getLocations()
    .subscribe((location) => {
        this.setLocations(location);
    });
  }

  public setLocations(locations) {
     let locationsArray: any = [];
     let countiesArray: any = [];
     let trackCounty: any = [];
     let countyNo = 1;
     _.each(locations, (location: any) => {
          let specificCountyObj: any = { 'id': countyNo, 'itemName': location.stateProvince };
          let specificLocation: any = { 'id': location.uuid, 'itemName': location.display};
          if (location.stateProvince !== '') {
            this.locationMap.set(location.uuid, specificLocation);
            this.setCounties(specificCountyObj.itemName, specificLocation);
            locationsArray.push(specificLocation);
            if (_.includes(trackCounty, specificCountyObj.itemName) === false) {
              countiesArray.push(specificCountyObj);
              trackCounty.push(specificCountyObj.itemName);
            }
            countyNo++;

          }
     });
     this.locations = locationsArray;
     this.counties = _.uniq(countiesArray);
  }

  public setCounties(county, location) {
    let countySavedObj: any = this.countyMap.get(county);
    if (typeof countySavedObj === 'undefined') {
          let countyLocations = [];
          countyLocations.push(location);
          this.countyMap.set(county, countyLocations);
    } else {
          let countyLocations = countySavedObj;
          countyLocations.push(location);
          this.countyMap.set(county, countyLocations);
    }

  }

  public getDepartmentConfig() {
    this.departmentProgramService.getDartmentProgramsConfig()
      .subscribe((results) => {
        if (results) {
          this.departmenProgramtConfig = results;
          this.getAllDepartments();
        }
      });

  }

  public getProgramVisitsConfig() {
    this._patientProgramService.getAllProgramVisitConfigs()
      .subscribe((response) => {
        if (response) {
          this.programVisitsConfig = JSON.parse(JSON.stringify(response));
          this.getAllPrograms();
        }
      });
  }

  public initializeParams() {
    this.selectedStartDate = Moment().startOf('month').format('YYYY-MM-DD');
    this.selectedEndDate  = Moment().endOf('month').format('YYYY-MM-DD');
    this.selectedProgramType = [];
    this.selectedProgramType = [];
    this.params = {
      'startDate': this.selectedStartDate,
      'endDate': this.selectedEndDate,
      'locationUuids': [],
      'programType': [],
      'department': []
    };

  }

  public setParams() {

      let startDate = Moment(this.selectedStartDate).format('YYYY-MM-DD');
      let endDate = Moment(this.selectedEndDate).format('YYYY-MM-DD');
      let programUuids = [];
      let departmentUuid = [];

      if (this.department.length > 0 && this.program.length === 0) {
          this.showSelectedPrograms = false;
          _.each(this.programs, (program: any) => {
              programUuids.push(program.id);
          });
          _.each(this.department, (department: any) => {
            departmentUuid.push(department.id);
          });

      }else if (this.department.length > 0 && this.program.length > 0) {
          this.showSelectedPrograms = true;
          _.each(this.program, (program: any) => {
            programUuids.push(program.id);
          });
          _.each(this.department, (department: any) => {
            departmentUuid.push(department.id);
          });
      } else {
        this.showSelectedPrograms = false;

      }
      // get location ids
      let locationUuids = [];
      _.each(this.location, (locationItem: any) => {
          locationUuids.push(locationItem.id);
      });

      this.params = {
        'startDate': startDate,
        'endDate': endDate,
        'locationUuids': locationUuids,
        'programType':  programUuids,
        'department': departmentUuid

      };
      this.passParamsToUrl(this.params);

  }

  public passParamsToUrl(params) {

    const currentParams = this.route.snapshot.queryParams;
    let navigationData = {
        queryParams: params,
        replaceUrl: true
    };

    let currentUrl = this.router.url;
    let routeUrl = currentUrl.split('?')[0];
    this.router.navigate([routeUrl], navigationData);
    this.filterSet = false;

  }
  public emitParams(params) {
    this.filterSelected.emit(params);

  }
  public setFilter() {
    this.filterSet = true;
    let isFilterOkay = this.validateFilterSelected();
    if (isFilterOkay === true) {
        this.setParams();
    } else {
        this.selectedFiltersOkay = false;
    }
    this.filterSet = false;
  }

  public validateFilterSelected() {
        this.errorMsg = { 'status': false, 'message': '' };
        if (this.selectedStartDate === null) {
           this.selectedStartDate = Moment().startOf('month').format('YYYY-MM-DD');
        }
        if (this.selectedEndDate === null) {
          this.selectedEndDate = Moment().endOf('month').format('YYYY-MM-DD');
        }
        if (this.selectedStartDate > this.selectedEndDate) {
           console.log('End Date before start date');
           this.errorMsg = {
            'status': true,
            'message': 'The End Date should not be earlier than the start date'
           };
           return false;
        }
        return true;
  }
  public collapseFilters() {
    this.showFilters = false;
  }
  public expandFilters() {
    this.showFilters = true;
  }
  public getSelectedStartDate($event) {
    this.selectedStartDate = $event;
    this.filterSet = false;
  }
  public getSelectedEndDate($event) {
    this.selectedEndDate = $event;
    this.filterSet = false;
  }

  public selectDepartment(department) {
    this.filterSet = false;
    let departmentsSelected = this.department;
    this.programs = [];
    this.trackPrograms = [];
    _.each(departmentsSelected, (departmentSelected: any) => {
      this.getPrograms(departmentSelected);
    });
    this.cd.detectChanges();
  }
  public onSelectAllDepartments($event) {
    this.filterSet = false;
    this.selectDepartment($event);
  }
  public onDeSelectAllDepartment($event) {
    this.filterSet = false;
  }
  public programDeSelect($event) {
    this.filterSet = false;

  }
  public selectCounty($event) {
    this.filterSet = false;
    this.multipleLocationsSelected = true;
    this.loadLocationsFromCounty($event.itemName);
  }
  public loadLocationsFromCounty(county) {
    let countyLocations = this.countyMap.get(county);
    this.location =  [];
    _.each(countyLocations, (countyLocation) => {
      this.location.push(countyLocation);
    });
  }
  public countyDeselect($event) {
    this.removeCountyLocations($event.itemName);
    this.multipleLocationsSelected = false;

  }
  public removeCountyLocations(county) {

    let countyLocations = (this.countyMap.get(county)).reverse();
    _.each(countyLocations, (countyLocation: any) => {
        let locationId = countyLocation.id;
        _.each(this.location, (location: any, index) => {
              let selectedLocationId = location.id;
              if (selectedLocationId === locationId) {

                  this.location.splice(index, 1);
              }

        });
    });

  }
  public selectLocation($event) {
    this.filterSet = false;
    this.multipleLocationsSelected = true;
    this.county = [];

  }
  public locationDeselect($event) {
    this.filterSet = false;
    if (this.location.length === 0) {
      this.multipleLocationsSelected = false;
    }

  }
  public onSelectAllLocations($event) {
    this.filterSet = false;
  }
  public onDeSelectAllLocations($event) {
    this.filterSet = false;
  }
  public selectProgram($event) {
    this.filterSet = false;
  }
  public resetFilter() {
    this.initializeParams();
    this.department = [];
    this.program = [];
    this.county = [];
    this.location = [];
    this.filterReset.emit(true);
    this.filterSet = false;

  }
  public resetLocationSelected() {
    this.multipleLocationsSelected = false;
    this.location = [];
  }
  public selectAllLocations() {
    this.multipleLocationsSelected = true;
    this.location = [];
  }

  public departmentDeselect($event) {

    let departmentUuid = $event.id;
    let departmentPrograms = [];

    _.each(this.departmenProgramtConfig, (department: any, index) => {
      if (index === departmentUuid) {
        _.each(department.programs, (deptProgram: any) => {
          departmentPrograms.push(deptProgram.uuid);
        });
      }
    });

    this.removeProgramTypes(departmentPrograms);

    this.filterSet = false;

    this.cd.detectChanges();

  }

  public removeProgramTypes(programUuids) {

    for (let i = this.programs.length - 1; i >= 0; i--) {
      let programUuid = this.programs[i].id;
      if (_.includes(programUuids, programUuid) === true) {
        this.programs.splice(i, 1);
      } else {
      }
    }

    for (let i = this.program.length - 1; i >= 0; i--) {
      let programUuid = this.program[i].id;

      if (_.includes(programUuids, programUuid) === true) {
        this.program.splice(i, 1);
      }
    }

  }

  public getAllPrograms() {

    this.programs = [];
    let allPrograms = [];
    let programsVisitsConf = this.programVisitsConfig;

    _.each(programsVisitsConf, (program: any, index) => {
      let specificProgram = { 'id': index,  'itemName': program.name };
      this.programMap.set(index, specificProgram);
      allPrograms.push(specificProgram);
    });

    this.programs = allPrograms;

  }

  public getAllDepartments() {
    let departments = this.departmenProgramtConfig;
    _.each(departments, (department: any, index) => {
      let specificDepartment = { 'itemName': department.name, 'id': index };
      this.departmentMap.set(index, specificDepartment);
      this.departments.push(specificDepartment);
    });
    this.cd.detectChanges();
  }

  public getPrograms(departmentSelected) {
    let departments = this.departmenProgramtConfig;
    let programs = this.programVisitsConfig;
    let programsArray = [];
    this.trackPrograms = [];
    _.each(departments, (department: any, index) => {
      if (index === departmentSelected.id) {
        let deptPrograms = department.programs;
        _.each(deptPrograms, (program: any) => {
          let specificProgram = { 'id': program.uuid, 'itemName': program.name };
          if (_.includes(this.trackPrograms, program.uuid) === false) {
            this.programs.push(specificProgram);
            this.trackPrograms.push(program.uuid);
          }
        });

      }

    });
  }

}
