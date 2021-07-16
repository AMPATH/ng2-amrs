import { take } from "rxjs/operators";

import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Params,
} from "@angular/router";
import * as _ from "lodash";
import * as Moment from "moment";
import { PatientProgramResourceService } from "./../etl-api/patient-program-resource.service";
import { LocalStorageService } from "../utils/local-storage.service";
import { DepartmentProgramsConfigService } from "./../etl-api/department-programs-config.service";
import { SelectDepartmentService } from "./../shared/services/select-department.service";
import { ItemsList } from "@ng-select/ng-select/ng-select/items-list";

@Component({
  selector: "program-visit-encounter-search",
  templateUrl: "./program-visit-encounter-search.component.html",
  styleUrls: ["./program-visit-encounter-search.component.css"],
})
export class ProgramVisitEncounterSearchComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public programs: Array<any> = [];
  public message: any = {
    message: "",
  };
  public visitTypes: Array<any> = [];
  public encounterTypes: any = [];
  public params: any;
  public filterKeys: any = [];
  public program: any = [];
  public department: any = [];
  public visitType: any = [];
  public visits = [];
  public encounterType: any = [];
  public filterSet = false;
  public filterReset = false;
  public departments: any = [];
  public encounters: any = [];
  public dropdownSettings: any = {
    singleSelection: false,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    maxHeight: 200,
  };
  public programDropdownSettings: any = {
    singleSelection: true,
    text: "Select or enter to search",
    enableSearchFilter: true,
    maxHeight: 200,
  };
  public loadingFilters = true;
  public myDepartment;
  public showFilters = true;
  public programVisitMap = new Map();
  public programMaps = new Map();
  public visitMaps = new Map();
  public encounterMaps = new Map();
  public visitTypeMap = new Map();
  public visitTypeEncounterTypeMap = new Map();
  public programVisitsConfig: any;
  public departmentPrograms: any;
  public selectedEncounterType: any;
  public selectedVisitType: any;
  public selectedProgramType;
  public minDefaultPeriod: number;
  public maxDefaultPeriod: number;
  @Input() public calendarType: string;
  @Input() public controlLocation = "";
  public showProgramFilters = true;
  public filterMonth = Moment().format("YYYY-MM");
  public filterDate = Moment().format("YYYY-MM-DD");

  @Output() public filterSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() public monthControl: boolean;
  @Input() public dateControl: boolean;
  @Input() public defaultersControl: boolean;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private _patientProgramService: PatientProgramResourceService,
    private _departmentProgramService: DepartmentProgramsConfigService,
    private selectDepartmentService: SelectDepartmentService
  ) {}

  public ngOnInit() {
    this.loadingFilters = true;
    this.getProgramVisitsConfig()
      .then((result) => {
        this.route.queryParams.subscribe(
          (params: any) => {
            if (params) {
              this.params = params;
              if (params.startDate) {
                this.getParamsFromUrl(params);
              }
              this.loadingFilters = false;
            }
          },
          (error) => {
            console.error("Error", error);
            this.loadingFilters = false;
          }
        );
      })
      .catch((error) => {
        console.error("ERROR", error);
        this.loadingFilters = false;
      });
  }
  public ngOnDestroy() {}
  public ngAfterViewInit() {}

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
  public getParamsFromUrl(params) {
    const newParams = {
      department: "",
      programType: [],
      visitType: [],
      encounterType: [],
      startDate: "",
      endDate: "",
      resetFilter: false,
    };
    if (params.department) {
      newParams.department = params.department;
    }
    if (params.programType) {
      newParams.programType = params.programType;
      const selectedPrograms = this.loadFilterFromMap(
        params.programType,
        this.programMaps
      );
      this.program = selectedPrograms;
      this.loadProgramVisitTypes(params.programType);
    }
    if (params.visitType) {
      newParams.visitType = params.visitType;
      const selectedVisitType = this.loadFilterFromMap(
        params.visitType,
        this.visitMaps
      );
      const isVisitString = this.isString(params.visitType);
      if (isVisitString) {
        this.loadEncounterTypeFromVisitType(params.visitType);
      } else {
        _.each(params.visitType, (visitType) => {
          this.loadEncounterTypeFromVisitType(visitType);
        });
      }
      this.visitType = selectedVisitType;
    }
    if (params.encounterType) {
      newParams.encounterType = params.encounterType;
      const selectedEncounterType = this.loadFilterFromMap(
        params.encounterType,
        this.encounterMaps
      );
      this.encounterType = selectedEncounterType;
    }
    if (params.startDate) {
      newParams.startDate = params.startDate;
    }
    if (params.startDate) {
      newParams.startDate = params.startDate;
    }
    if (params.resetFilter) {
      newParams.resetFilter = params.resetFilter;
    }

    this.emitParams(newParams);
  }

  public setFiltersFromUrlParams(params, mapObj) {
    const filterArray = [];

    _.each(params, (item) => {
      const filterItem = mapObj.get(item);
      filterArray.push(filterItem);
    });

    return filterArray;
  }
  public showFilter() {
    this.showFilters = true;
  }
  public hideFilter() {
    this.showFilters = false;
  }
  public getCurrentDepartment() {
    this.selectDepartmentService.getDepartment().subscribe((d) => {
      this.myDepartment = d;
      this.showProgramFilter(d);
      this.getDepartmentPrograms(d);
    });
  }
  public showProgramFilter(department) {
    if (department === "HIV" && this.controlLocation === "clinic-dashboard") {
      this.showProgramFilters = false;
    } else {
      this.showProgramFilters = true;
    }
  }
  public getDepartmentPrograms(department) {
    this._departmentProgramService
      .getDepartmentPrograms(department)
      .pipe(take(1))
      .subscribe((result) => {
        this.departmentPrograms = result;
        this.loadProgramFilter(result);
      });
  }
  public getProgramVisitsConfig() {
    return new Promise((resolve, reject) => {
      this._patientProgramService
        .getAllProgramVisitConfigs()
        .pipe(take(1))
        .subscribe((response) => {
          if (response) {
            this.programVisitsConfig = JSON.parse(JSON.stringify(response));
            this.getCurrentDepartment();
            this.setProgramVisitEncounterMaps();
            resolve("success");
          }
        });
    });
  }
  public setProgramVisitEncounterMaps() {
    const programVisitsConfig = this.programVisitsConfig;

    _.each(programVisitsConfig, (program: any, index) => {
      const programObj = {
        id: index,
        itemName: program.name,
      };
      this.programMaps.set(index, programObj);
      const visitTypes = program.visitTypes;
      this.programVisitMap.set(index, visitTypes);
      _.each(visitTypes, (visitType: any) => {
        const visitTypeObj = {
          id: visitType.uuid,
          itemName: visitType.name,
        };
        this.visitMaps.set(visitType.uuid, visitTypeObj);
        const encounterTypes = visitType.encounterTypes;
        this.visitTypeEncounterTypeMap.set(visitType.uuid, encounterTypes);
        _.each(encounterTypes, (encounterType) => {
          const encounterObj = {
            id: encounterType.uuid,
            itemName: encounterType.display,
          };
          this.encounterMaps.set(encounterType.uuid, encounterObj);
        });
      });
    });
  }
  public loadProgramFilter(departmentPrograms) {
    const programsArray = [];
    _.each(departmentPrograms, (program: any) => {
      const programUuid = program.uuid;
      const programName = program.name;
      const programObj = {
        id: programUuid,
        itemName: programName,
      };
      programsArray.push(programObj);
      const programItem: any = this.programVisitsConfig[programUuid];
      const visitTypes: any = programItem.visitTypes;
      this.programVisitMap.set(programUuid, visitTypes);
      this.mapVisitTypeToEncounterTypes(visitTypes);
    });

    this.programs = programsArray;
  }
  public mapVisitTypeToEncounterTypes(visitTypes) {
    _.each(visitTypes, (visitType: any) => {
      const encounterTypes = visitType.encounterTypes;
      const visitTypeUuid = visitType.uuid;
      this.visitTypeEncounterTypeMap.set(visitTypeUuid, encounterTypes);
    });
  }
  public selectProgram($event) {
    this.loadProgramVisitTypes($event.id);
    this.filterSet = false;
  }
  public loadProgramVisitTypes(program) {
    const programVisitTypes = this.programVisitMap.get(program);
    const programVisitArray = [];
    this.visitTypes = [];
    if (typeof programVisitTypes !== "undefined") {
      _.each(programVisitTypes, (visitType: any) => {
        const visitTypeUuid = visitType.uuid;
        const visitTypeName = visitType.name;
        const visitTypeObj = {
          id: visitTypeUuid,
          itemName: visitTypeName,
        };
        this.visitTypes.push(visitTypeObj);
      });
    }
  }

  public selectVisitType($event) {
    this.loadEncounterTypeFromSelectedVisitType($event.id);
    this.filterSet = false;
  }
  public loadEncounterTypeFromVisitType(visitType) {
    const encounterTypes = this.visitTypeEncounterTypeMap.get(visitType);
    if (typeof encounterTypes !== "undefined") {
      _.each(encounterTypes, (encounterType: any) => {
        const encounterTypeUuid = encounterType.uuid;
        const encounterTypeName = encounterType.display;
        const encounterTypeObj = {
          id: encounterTypeUuid,
          itemName: encounterTypeName,
        };
        this.encounterTypes.push(encounterTypeObj);
      });
    }
  }
  public loadEncounterTypeFromSelectedVisitType(visitType) {
    const encounterTypes = this.visitTypeEncounterTypeMap.get(visitType);
    const currentEncounterTypes = _.map(this.encounterTypes, "id");
    if (typeof encounterTypes !== "undefined") {
      _.each(encounterTypes, (encounterType: any) => {
        const encounterTypeUuid = encounterType.uuid;
        const encounterTypeName = encounterType.display;
        const encounterTypeObj = {
          id: encounterTypeUuid,
          itemName: encounterTypeName,
        };
        if (_.includes(currentEncounterTypes, encounterTypeUuid) === false) {
          this.encounterTypes.push(encounterTypeObj);
        } else {
        }
      });
    }
  }

  public selectEncounterType($event) {
    this.filterSet = false;
  }
  public encounterTypeDeSelect($event) {
    this.filterSet = false;
  }
  public onSelectAllEncounterTypes($event) {
    this.filterSet = false;
  }
  public onDeSelectAllEncounterTypes($event) {
    this.filterSet = false;
  }
  public programDeSelect($event) {
    this.resetFilters();
    this.filterSet = false;
  }
  public removeProgramVisits(program) {
    const programVisitTypes = this.programVisitMap.get(program);
    if (typeof programVisitTypes !== "undefined") {
      const visitTypesArray = _.map(programVisitTypes, "uuid");
      this.visitTypes = _.filter(this.visitTypes, (visitType: any) => {
        const visitTypeUuid = visitType.id;
        if (_.includes(visitTypesArray, visitTypeUuid) === false) {
          return true;
        } else {
          this.removeVisitEncounterTypes(visitTypeUuid);
          return false;
        }
      });
      this.visitType = _.filter(this.visitType, (visitType: any) => {
        const visitTypeUuid = visitType.id;
        return _.includes(visitTypesArray, visitTypeUuid) === false;
      });
    }
  }

  public visitTypeDeSelect($event) {
    this.removeVisitEncounterTypes($event.id);
    this.filterSet = false;
  }

  public removeVisitEncounterTypes(visitType) {
    const visitEncounterTypes = this.visitTypeEncounterTypeMap.get(visitType);
    if (typeof visitEncounterTypes !== "undefined") {
      const encounterTypesArray = _.map(visitEncounterTypes, "uuid");
      this.encounterTypes = _.filter(
        this.encounterTypes,
        (encounterType: any) => {
          const encounterTypeUuid = encounterType.id;
          return _.includes(encounterTypesArray, encounterTypeUuid) === false;
        }
      );
      this.encounterType = _.filter(
        this.encounterType,
        (encounterType: any) => {
          const encounterTypeUuid = encounterType.id;
          return _.includes(encounterTypesArray, encounterTypeUuid) === false;
        }
      );
    }
  }

  public onSelectAllPrograms($event) {
    const programsSelected = $event;
    _.each(programsSelected, (program: any) => {
      const programUuid = program.id;
      this.loadProgramVisitTypes(programUuid);
    });
    this.filterSet = false;
  }

  public onDeSelectAllPrograms($event) {
    this.resetFilters();
  }
  public onSelectAllVisitTypes($event) {
    const deselectedVisitTypes = $event;
    _.each(deselectedVisitTypes, (visitType: any) => {
      const visitTypeUuid = visitType.id;
      this.loadEncounterTypeFromVisitType(visitTypeUuid);
    });
    this.filterSet = false;
  }
  public resetFilters() {
    this.program = [];
    this.visitTypes = [];
    this.visitType = [];
    this.encounterType = [];
    this.encounterTypes = [];
    this.filterSet = false;
    this.filterReset = true;
    this.minDefaultPeriod = 0;
    this.maxDefaultPeriod = 0;
    const params = this.getParams();
    this.emitParams(params);
    this.message = {
      message: "",
    };
  }

  public setUrlParams(params) {
    const navigationData = {
      queryParams: params,
      replaceUrl: true,
    };

    const currentUrl = this.router.url;

    const routeUrl = currentUrl.split("?")[0];
    this.router.navigate([routeUrl], navigationData);
  }

  public setParams() {
    let selectedProgramType: any = [];
    let selectedVisitType: any = [];
    let selectedEncounterType: any = [];
    let selectedStartDate: string;
    let selectedEndDate: string;
    const selectedDepartment = this.myDepartment;
    this.message = {
      message: "",
    };

    if (this.program.length === 0 && this.showProgramFilters === true) {
      this.message = {
        message: "Kindly select at least one program",
      };
    } else {
      selectedProgramType = _.map(this.program, "id");

      if (this.dateControl) {
        selectedStartDate = Moment(this.filterDate).format("YYYY-MM-DD");
        selectedEndDate = Moment(this.filterDate).format("YYYY-MM-DD");
      }
      if (this.monthControl) {
        selectedStartDate = Moment(this.filterMonth, "YYYY-MM")
          .startOf("month")
          .format("YYYY-MM-DD");
        selectedEndDate = Moment(this.filterMonth, "YYYY-MM")
          .endOf("month")
          .format("YYYY-MM-DD");
      }

      selectedVisitType = _.map(this.visitType, "id");
      selectedEncounterType = _.map(this.encounterType, "id");

      if (this.defaultersControl) {
        this.params = {
          programType: selectedProgramType,
          minDefaultPeriod: this.minDefaultPeriod,
          maxDefaultPeriod: this.maxDefaultPeriod,
          resetFilter: this.filterReset,
        };
      } else {
        this.params = {
          programType: selectedProgramType,
          visitType: selectedVisitType,
          encounterType: selectedEncounterType,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          department: selectedDepartment,
          resetFilter: this.filterReset,
        };
      }

      const navigationData = {
        queryParams: this.params,
        replaceUrl: true,
      };

      const currentUrl = this.router.url;
      const routeUrl = currentUrl.split("?")[0];
      this.router.navigate([routeUrl], navigationData);
    }
  }

  public getParams() {
    this.setParams();
    return this.params;
  }

  public setFilter() {
    this.filterReset = false;
    const params = this.getParams();
    this.emitParams(params);
    this.filterSet = true;
  }

  public emitParams(params) {
    this.filterSelected.emit(params);
  }

  public previousMonth() {
    const currentMonth = this.filterMonth;
    const prevMonth = Moment(currentMonth, "YYYY-MM")
      .subtract(1, "month")
      .format("YYYY-MM");
    this.filterMonth = prevMonth;
    this.setFilter();
  }
  public nextMonth() {
    const currentMonth = this.filterMonth;
    const nextMonth = Moment(currentMonth, "YYYY-MM")
      .add(1, "month")
      .format("YYYY-MM");
    this.filterMonth = nextMonth;
    this.setFilter();
  }
  public getSelectedDate($event) {
    const newDate: string = Moment($event).format("YYYY-MM-DD");
    this.filterDate = newDate;
    this.filterSet = false;
  }
  public previousDay() {
    const currentDay = this.filterDate;
    const newDate = Moment(currentDay).subtract(1, "day").format("YYYY-MM-DD");
    this.filterDate = newDate;
    this.setFilter();
  }
  public nextDay() {
    const currentDay = this.filterDate;
    const newDate = Moment(currentDay).add(1, "day").format("YYYY-MM-DD");
    this.filterDate = newDate;
    this.setFilter();
  }
  public onMonthChange($event) {
    this.filterMonth = $event;
    this.filterSet = false;
  }
}
