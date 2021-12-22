import { take } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import * as Moment from "moment";
import { DepartmentProgramsConfigService } from "src/app/etl-api/department-programs-config.service";
import { FamilyTestingService } from "src/app/etl-api/family-testing-resource.service";
import { LocalStorageService } from "src/app/utils/local-storage.service";

@Component({
  selector: "family-testing-base-report",
  templateUrl: "./family-testing-base.component.html",
  styleUrls: ["./family-testing-base.component.css"],
})
export class FamilyTestingBaseComponent implements OnInit {
  public isLoading: boolean;
  public enabledControls: Array<string> = [];
  public endDate: Date = new Date();
  public locationUuid: string;
  public statusError = false;
  public errorMessage = "";
  public showInfoMessage = false;
  public params: any;
  public familyTestingPatientList: Array<any>;
  public reportName = 'FamilyTesting';
  public isEligible = '';
  public childStatus = '';
  public elicitedClients = '';
  public elicitedStartDate = '';
  public elicitedEndDate = '';
  public programDropdownSettings: any = {
    singleSelection: false,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    maxHeight: 200,
  };
  public departmentPrograms: any;
  public programs: Array<any> = [];
  public program: any = [];
  public showSelectedPrograms = true;
  public programUuids = [];
  public disableGenerateButton = false;

  public isEligibleOptions = [
    {
      label: "",
      value: "",
    },
    {
      label: "Yes",
      value: "1065",
    },
    {
      label: "No",
      value: "1066",
    },
  ];

  public childStatusOptions = [
    {
      label: '',
      value: ''
    },
    {
      label: 'No Child',
      value: 0
    },
    {
      label: 'Children Above 19yrs',
      value: 1
    }
  ];

  public elicitedClientsOptions = [
    {
      label: '',
      value: ''
    },
    {
      label: 'All Index',
      value: 0
    },
    {
      label: 'Index Without Contacts',
      value: -1
    },
    {
      label: 'Index With Contacts',
      value: 1
    },
    {
      label: 'All contacts',
      value: ''
    }
  ];

  public ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (_.isEmpty(params)) {
        this.route.parent.parent.params.subscribe((urlParams: any) => {
          this.locationUuid = urlParams.location_uuid;
          localStorage.setItem(
            "familyTestingSCurrentLocation",
            this.locationUuid
          );

          if (this.locationUuid) {
            this.resetFilters();
          }
        });
      } else {
        if (
          localStorage.getItem("familyTestingSCurrentLocation") !==
          params.location_uuid
        ) {
          this.resetFilters();
          localStorage.setItem(
            "familyTestingSCurrentLocation",
            this.locationUuid
          );
        } else {
          this.locationUuid = params.location_uuid ? params.location_uuid : '';
          this.elicitedStartDate = params.start_date ? params.start_date : '';
          this.elicitedEndDate = params.end_date ? params.end_date : '';
          this.isEligible = params.eligible ? params.eligible : '';
          this.childStatus = params.childStatus ? params.childStatus : '';
          this.elicitedClients = params.elicitedClients
            ? params.elicitedClients
            : '';
          const cachedPrograms = this.localStorage.getItem(
            "familyTestingSelectedPrograms"
          );
          this.programUuids = cachedPrograms ? cachedPrograms.split(",") : [];

          if (this.programUuids.length > 0) {
            this.disableGenerateButton = true;
          } else {
            this.disableGenerateButton = false;
          }

          this.setParams();
          if (this.locationUuid) {
            this.generateReport();
          }
        }
      }
    });
    this.getDepartmentPrograms();
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private familyTestingService: FamilyTestingService,
    private departmentProgramService: DepartmentProgramsConfigService,
    private localStorage: LocalStorageService
  ) {}

  public generateReport() {
    this.setParams();
    this.storeParamsInUrl();
    this.isLoading = true;
    this.familyTestingService
      .getFamilyTreePatientList(this.params)
      .subscribe((data) => {
        if (data.error) {
          this.showInfoMessage = true;
          this.errorMessage = `There has been an error while loading the report, please retry again`;
          this.isLoading = false;
        } else {
          this.showInfoMessage = false;
          this.isLoading = false;
          this.familyTestingPatientList = data.result;
        }
      });
  }

  public storeParamsInUrl() {
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        location_uuid: this.locationUuid,
        eligible: this.isEligible,
        childStatus: this.childStatus,
        elicitedClients: this.elicitedClients,
        start_date: this.elicitedStartDate,
        end_date: this.elicitedEndDate,
        program_type: this.programUuids.toString(),
      },
    });

    if (!_.isEmpty(this.programUuids)) {
      this.localStorage.setItem(
        "familyTestingSelectedPrograms",
        this.programUuids.toString()
      );
    }
  }

  public onLocationChange(location_uuid) {
    this.locationUuid = location_uuid;
    this.resetFilters();
  }

  public onPatientSelected(params: any) {
    this.router.navigate(["contact-list"], {
      relativeTo: this.route,
      queryParams: { patient_uuid: params.patient_uuid },
    });
  }

  public onIsEligibleChange($event) {
    this.isEligible = $event;
  }

  public childStatusChange($event) {
    this.childStatus = $event;
  }

  public onElicitedClientsChange($event) {
    this.elicitedClients = $event;
  }

  public getSelectedElicitedStartDate($event) {
    this.elicitedStartDate = Moment($event).format("YYYY-MM-DD");
  }

  public getSelectedElicitedEndDate($event) {
    this.elicitedEndDate = Moment($event).format("YYYY-MM-DD");
  }

  public setParams() {
    const programUuids = [];

    if (this.program.length > 0) {
      this.showSelectedPrograms = true;
      _.each(this.program, (program: any) => {
        programUuids.push(program.id);
      });
    }

    if (_.isEmpty(this.programUuids)) {
      this.programUuids = programUuids;
    }

    this.params = {
      locationUuid: this.locationUuid,
      isEligible: this.isEligible,
      childStatus: this.childStatus,
      elicitedClients: this.elicitedClients,
      start_date: this.elicitedStartDate,
      end_date: this.elicitedEndDate,
      programType: this.programUuids.toString(),
    };
  }

  public resetFilters() {
    this.isEligible = '';
    this.childStatus = '';
    this.elicitedClients = '';
    this.elicitedStartDate = '';
    this.elicitedEndDate = '';
    this.programUuids = [];
    this.program = [];
    this.localStorage.remove("familyTestingSelectedPrograms");
    this.generateReport();
  }

  public getDepartmentPrograms() {
    this.departmentProgramService
      .getDepartmentPrograms("HIV")
      .pipe(take(1))
      .subscribe((result) => {
        this.departmentPrograms = result;
        this.loadProgramFilter(result);
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
    });

    this.programs = programsArray;
  }

  public loadProgramsFromParams(programs) {
    if (programs !== undefined) {
      const selectedPrograms = [];
      this.getDepartmentPrograms();
      programs = programs.split(",");
      _.each(this.departmentPrograms, (p: any) => {
        if (programs.includes(p.uuid)) {
          selectedPrograms.push(p);
        }
      });
      this.loadProgramFilter(selectedPrograms);
    }
  }

  public selectProgram($event) {}

  public DeSelectProgram($event) {}

  public onSelectAllPrograms($event) {}

  public onDeSelectAllPrograms($event) {}
}
