import { take } from "rxjs/operators";
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as Moment from "moment";
import { LocationResourceService } from "../openmrs-api/location-resource.service";
import { ClinicDashboardCacheService } from "src/app/clinic-dashboard/services/clinic-dashboard-cache.service";
import { DepartmentProgramsConfigService } from "./../etl-api/department-programs-config.service";
import { LocalStorageService } from "src/app/utils/local-storage.service";

@Component({
  selector: "department-program-filter",
  templateUrl: "./department-program-filter.component.html",
  styleUrls: ["./department-program-filter.component.css"],
})
export class DepartmentProgramFilterComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public selectedProgram: string;
  public programs: Array<any> = [];
  public departmenProgramtConfig: any = [];
  public currentDepartment = "";
  public defaultLocation = "";
  public programVisitsConfig: any[];
  public selectedProgramType: any = [];
  public program: any = [];
  public departmentPrograms: any;
  public programMap = new Map();
  public department: any = [];
  public departmentMap = new Map();
  public countyMap = new Map();
  public filterSet = false;
  public departments: any = [];
  public showSelectedPrograms = true;
  public trackPrograms: any = [];
  public selectedStartDate: string = Moment()
    .startOf("month")
    .format("YYYY-MM-DD");
  public selectedEndDate: string = Moment().endOf("month").format("YYYY-MM-DD");
  public params: any = {
    startDate: this.selectedStartDate,
    endDate: this.selectedEndDate,
    locationUuids: [],
    programType: [],
    department: [],
  };
  public dropdownSettings: any = {
    singleSelection: false,
    enableCheckAll: true,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
  };
  public showFilters = true;
  public locationDropdownSettings: any = {
    enableCheckAll: false,
    singleSelection: false,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
  };
  public programDropdownSettings: any = {
    singleSelection: false,
    enableCheckAll: true,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    badgeShowLimit: 10,
  };
  public countyDropdownSettings: any = {
    enableCheckAll: false,
    singleSelection: true,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
  };
  public loadingFilters = true;
  public locations: any = [];
  public location: any = [];
  public multipleLocationsSelected = false;
  public locationMap = new Map();
  public county: any = [];
  public counties: any = [];
  public selectedLocation: any = [];
  public selectedFiltersOkay = true;
  public errorMsg: any = {
    status: false,
    message: "",
  };
  public subscriptionsArray = [];

  public showDepartmentFilter = true;

  @Output() public filterSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() public filterReset: EventEmitter<boolean> = new EventEmitter<any>();

  constructor(
    private cd: ChangeDetectorRef,
    private departmentProgramService: DepartmentProgramsConfigService,
    private _locationResourceService: LocationResourceService,
    private _departmentProgramService: DepartmentProgramsConfigService,
    private _clinicDashboardCacheService: ClinicDashboardCacheService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.showHideDepartment().then((success) => {
      this.loadAllFilterParams().then((result) => {
        this.loadingFilters = false;
        this.route.queryParams.subscribe(
          (params) => {
            if (params) {
              this.params = params;
              // cater for endpoints taking long to return data
              setTimeout(() => {
                this.loadFilterFromUrlParams(params);
              }, 1000);
            }
          },
          (error) => {
            console.error("Error", error);
          }
        );
      });
    });
  }

  public showHideDepartment() {
    return new Promise((resolve, reject) => {
      const currentUrl = this.router.url;
      let isClinicDashboard = -1;
      if (currentUrl) {
        isClinicDashboard = currentUrl.indexOf("clinic-dashboard");
      }
      if (isClinicDashboard === -1) {
        this.showDepartmentFilter = true;
        this.getDepartmentConfig().then((success) => {});
      } else {
        this.showDepartmentFilter = false;
        this.getDepartmentConfig();
        // if clinic dashboard do not show departments only programs
        this.getDefaultDepartment();
      }

      resolve("success");
    });
  }

  public getSelectedLocation() {
    const sub = this._clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((clinic) => {
        if (clinic) {
          this.defaultLocation = clinic;
          const locations = this.loadFilterFromMap(clinic, this.locationMap);
          this.location = locations;
        }
      });

    this.subscriptionsArray.push(sub);
  }

  public loadFilterFromUrlParams(params) {
    const newParams: any = {
      startDate: "",
      endDate: "",
      locationUuids: [],
      programType: [],
    };

    if (params.endDate) {
      if (params.locationUuids) {
        this.location = [];
        const locations = this.loadFilterFromMap(
          params.locationUuids,
          this.locationMap
        );
        this.location = locations;
        newParams.locationUuids = params.locationUuids;
      } else {
        newParams.locationUuids = [];
      }
      if (params.endDate) {
        this.selectedEndDate = params.endDate;
        newParams.endDate = this.params.endDate;
      } else {
        newParams.endDate = this.selectedEndDate;
      }
      if (params.department) {
        this.department = [];
        const departmentTypes = this.loadFilterFromMap(
          params.department,
          this.departmentMap
        );
        this.department = departmentTypes;
        let deptArray = [];
        if (this.isString(params.department)) {
          deptArray = params.department.split(",");
        } else {
          deptArray = params.department;
        }
        this.getProgramsFromDeptArray(deptArray);
      }
      if (params.programType) {
        this.program = [];
        const programTypes = this.loadFilterFromMap(
          params.programType,
          this.programMap
        );
        if (this.showSelectedPrograms) {
          this.program = programTypes;
        }
        newParams.programType = params.programType;
      } else {
        newParams.programType = [];
      }

      this.emitParams(newParams);
    } else {
      // if no params is set load default location
      this.getSelectedLocation();
    }
  }

  public isString(value) {
    if (typeof value === "string") {
      return true;
    } else {
      return false;
    }
  }

  public loadFilterFromMap(values: any, map) {
    const filterArray = [];
    if (this.isString(values)) {
      const selectedType = map.get(values);
      filterArray.push(selectedType);
    } else {
      for (const value of values) {
        const selectedType = map.get(value);
        filterArray.push(selectedType);
      }
    }
    return filterArray;
  }

  public getDefaultDepartment() {
    const defaultDepartment: any = JSON.parse(
      this.localStorageService.getItem("userDefaultDepartment")
    );
    if (defaultDepartment) {
      this.currentDepartment = defaultDepartment[0].itemName;
      this.getDepartmentPrograms(defaultDepartment[0].itemName);
    }
  }

  public getDepartmentPrograms(department) {
    const programs = [];

    this._departmentProgramService
      .getDepartmentPrograms(department)
      .pipe(take(1))
      .subscribe((result) => {
        this.departmentPrograms = result;
        this.programs = result.map((program: any) => {
          const specificProgram = {
            id: program.uuid,
            itemName: program.name,
          };
          this.programMap.set(program.uuid, specificProgram);
          return specificProgram;
        });
      });
  }

  public getDepartmentConfig() {
    return new Promise((resolve, reject) => {
      this.departmentProgramService
        .getDartmentProgramsConfig()
        .pipe(take(1))
        .subscribe((results) => {
          if (results) {
            this.departmenProgramtConfig = results;
            this.loadAllDepartments();
            resolve("sucesss");
          }
        });
    });
  }

  public loadAllDepartments() {
    const departments = [];

    _.each(this.departmenProgramtConfig, (department: any, index) => {
      const specificDept = {
        itemName: department.name,
        id: index,
      };
      departments.push(specificDept);
      this.departmentMap.set(index, specificDept);
    });

    this.departments = departments;
  }

  public loadProgramsAndDepartments() {
    const departments = [];
    const programs = [];

    _.each(this.departmenProgramtConfig, (department: any, index) => {
      if (department.name === this.currentDepartment) {
        const specificDept = {
          itemName: department.name,
          id: index,
        };
        departments.push(specificDept);
        this.departmentMap.set(index, specificDept);
        _.each(department.programs, (deptProgram: any) => {
          const specificProgram = {
            itemName: deptProgram.name,
            id: deptProgram.uuid,
          };
          programs.push(deptProgram.uuid, specificProgram);
          this.programMap.set(deptProgram.uuid, specificProgram);
        });
      }
    });

    this.programs = programs;
    this.departments = departments;
  }

  public loadAllFilterParams() {
    return new Promise((resolve, reject) => {
      this.getAllLocations().then((success) => {
        resolve("Success");
      });
    });
  }

  public getAllLocations() {
    return new Promise((resolve, reject) => {
      this._locationResourceService
        .getLocations()
        .pipe(take(1))
        .subscribe((location) => {
          if (location) {
            this.setLocations(location);
            resolve("success");
          }
        });
    });
  }

  public getProgramsFromDeptArray(departments) {
    const programs = [];
    _.each(this.departmenProgramtConfig, (department: any, index) => {
      const departmentProgs = department.programs;
      _.each(departmentProgs, (program) => {
        const specificProgram = {
          itemName: program.name,
          id: program.uuid,
        };
        if (departments.indexOf(index) !== -1) {
          programs.push(specificProgram);
        }
        this.programMap.set(program.uuid, specificProgram);
      });
    });

    this.programs = programs;
  }

  public setLocations(locations) {
    const locationsArray: any = [];
    const countiesArray: any = [];
    const trackCounty: any = [];
    let countyNo = 1;
    _.each(locations, (location: any) => {
      const specificCountyObj: any = {
        id: countyNo,
        itemName: location.stateProvince,
      };
      const specificLocation: any = {
        id: location.uuid,
        itemName: location.display,
      };
      if (location.stateProvince !== "") {
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
    const countySavedObj: any = this.countyMap.get(county);
    if (typeof countySavedObj === "undefined") {
      const countyLocations = [];
      countyLocations.push(location);
      this.countyMap.set(county, countyLocations);
    } else {
      const countyLocations = countySavedObj;
      countyLocations.push(location);
      this.countyMap.set(county, countyLocations);
    }
  }

  public emitParams(params) {
    this.filterSelected.emit(params);
  }
  public setFilter() {
    this.filterSet = true;
    const isFilterOkay = this.validateFilterSelected();
    if (isFilterOkay === true) {
      this.setParams();
    } else {
      this.selectedFiltersOkay = false;
    }
    this.filterSet = false;
  }

  public setParams() {
    const startDate = Moment(this.selectedStartDate).format("YYYY-MM-DD");
    const endDate = Moment(this.selectedEndDate).format("YYYY-MM-DD");
    const programUuids = [];
    const departmentUuid = [];

    if (this.department.length > 0 && this.program.length === 0) {
      this.showSelectedPrograms = false;
      _.each(this.programs, (program: any) => {
        programUuids.push(program.id);
      });
      _.each(this.department, (department: any) => {
        departmentUuid.push(department.id);
      });
    } else if (this.department.length > 0 && this.program.length > 0) {
      this.showSelectedPrograms = true;
      _.each(this.program, (program: any) => {
        programUuids.push(program.id);
      });
      _.each(this.department, (department: any) => {
        departmentUuid.push(department.id);
      });
    } else if (this.department.length === 0 && this.program.length > 0) {
      this.showSelectedPrograms = true;
      _.each(this.program, (program: any) => {
        programUuids.push(program.id);
      });
    } else if (this.department.length === 0 && this.program.length === 0) {
      this.showSelectedPrograms = false;
      _.each(this.programs, (program: any) => {
        programUuids.push(program.id);
      });
    } else {
      this.showSelectedPrograms = false;
    }
    // get location ids
    const locationUuids = [];
    _.each(this.location, (locationItem: any) => {
      locationUuids.push(locationItem.id);
    });

    this.params = {
      startDate: startDate,
      endDate: endDate,
      locationUuids: locationUuids,
      programType: programUuids,
    };
    // only add department if it has been selected
    if (departmentUuid.length > 0) {
      this.params["department"] = departmentUuid;
    }

    this.passParamsToUrl(this.params);
  }

  public validateFilterSelected() {
    this.errorMsg = { status: false, message: "" };
    if (this.selectedEndDate === null) {
      this.selectedEndDate = Moment().endOf("month").format("YYYY-MM-DD");
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
    const departmentsSelected = this.department;
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
    const countyLocations = this.countyMap.get(county);
    this.location = [];
    _.each(countyLocations, (countyLocation) => {
      this.location.push(countyLocation);
    });
  }
  public countyDeselect($event) {
    this.removeCountyLocations($event.itemName);
    this.multipleLocationsSelected = false;
  }
  public removeCountyLocations(county) {
    const countyLocations = this.countyMap.get(county).reverse();
    _.each(countyLocations, (countyLocation: any) => {
      const locationId = countyLocation.id;
      _.each(this.location, (location: any, index) => {
        const selectedLocationId = location.id;
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
    this.errorMsg = {
      status: false,
      message: "",
    };
    this.program = [];
    this.county = [];
    this.location = [];
    this.filterReset.emit(true);
    this.filterSet = false;
  }
  public initializeParams() {
    this.selectedStartDate = Moment().startOf("month").format("YYYY-MM-DD");
    this.selectedEndDate = Moment().endOf("month").format("YYYY-MM-DD");
    this.selectedProgramType = [];
    this.selectedProgramType = [];
    this.params = {
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      locationUuids: [],
      programType: [],
    };
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
    const departmentUuid = $event.id;
    const departmentPrograms = [];

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
      const programUuid = this.programs[i].id;
      if (_.includes(programUuids, programUuid) === true) {
        this.programs.splice(i, 1);
      } else {
      }
    }

    for (let i = this.program.length - 1; i >= 0; i--) {
      const programUuid = this.program[i].id;

      if (_.includes(programUuids, programUuid) === true) {
        this.program.splice(i, 1);
      }
    }
  }

  public passParamsToUrl(params) {
    const navigationData = {
      queryParams: params,
      replaceUrl: true,
    };

    const currentUrl = this.router.url;
    const routeUrl = currentUrl.split("?")[0];
    this.router.navigate([routeUrl], navigationData);
    this.filterSet = false;
  }

  public getPrograms(departmentSelected) {
    const departments = this.departmenProgramtConfig;
    this.trackPrograms = [];
    _.each(departments, (department: any, index) => {
      if (department.name === departmentSelected.itemName) {
        const deptPrograms = department.programs;
        _.each(deptPrograms, (program: any) => {
          const specificProgram = { id: program.uuid, itemName: program.name };
          if (_.includes(this.trackPrograms, program.uuid) === false) {
            this.programs.push(specificProgram);
            this.trackPrograms.push(program.uuid);
          }
        });
      }
    });
  }

  public ngOnDestroy() {
    this.subscriptionsArray.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  public onSelectAllPrograms($event) {}

  public ngAfterViewInit() {}
}
