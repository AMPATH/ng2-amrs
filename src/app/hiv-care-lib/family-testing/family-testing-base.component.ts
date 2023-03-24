import { take } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { DepartmentProgramsConfigService } from 'src/app/etl-api/department-programs-config.service';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { SelectDepartmentService } from './../../shared/services/select-department.service';
import { Location } from '@angular/common';

@Component({
  selector: 'family-testing-base-report',
  templateUrl: './family-testing-base.component.html',
  styleUrls: ['./family-testing-base.component.css']
})
export class FamilyTestingBaseComponent implements OnInit {
  public selectedProgramTagsSelectedAll = false;
  public programs: any;
  public isLoading: boolean;
  public enabledControls = 'familyTestingControls';
  public endDate: Date = new Date();
  public locationUuid: string;
  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public params: any;
  public familyTestingPatientList: Array<any>;
  public reportName = 'FamilyTesting';
  public isEligible = '';
  public childStatus = '';
  public elicitedClients = '';
  public hasLoadedAll = false;
  public limit = 2000;
  public startIndex = 0;
  public showIndicatorDefinitions = false;
  public elicitedStartDate = '';
  public elicitedEndDate = '';
  public departmentPrograms: any;
  public disableGenerateButton = false;
  public selectedPrograms: any;
  public programOptions: Array<any>;
  public _locationUuids: any = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }

  public isEligibleOptions = [
    {
      label: '',
      value: ''
    },
    {
      label: 'Yes',
      value: '1065'
    },
    {
      label: 'No',
      value: '1066'
    }
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
      label: 'All screened for contacts',
      value: 0
    },
    {
      label: 'Screened and reviewed for children',
      value: 1
    },
    {
      label: 'Screened not reviewed for children',
      value: 2
    },
    {
      label: 'Reviewed with Children 19yrs and below',
      value: 8
    },
    {
      label: 'Reviewed with sexual partners',
      value: 9
    },
    {
      label: 'Clients not screened',
      value: 3
    },
    {
      label: 'Children 19yrs and below',
      value: 4
    },
    {
      label: 'Sexual partners',
      value: 5
    },
    {
      label: 'Siblings',
      value: 6
    },
    {
      label: 'Uncategorized contacts',
      value: 7
    },
    {
      label: 'All contacts',
      value: ''
    }
  ];
  public indicators = [
    {
      name: 'All screened for contacts',
      def: 'All index clients who have been screened for contacts'
    },
    {
      name: 'Screened and reviewed for children',
      def: 'All index clients who have been screened for children 19 years and below'
    },
    {
      name: 'Screened not reviewed for children',
      def: 'All index clients who have been screened but children status was not captured'
    },
    {
      name: 'Clients not screened',
      def: 'Clients without any contact tracing information'
    },
    {
      name: 'Children 19yrs and below',
      def: 'All elicited contacts below 20 years'
    },
    {
      name: 'Sexual partners',
      def: 'Sexual partners elicited'
    },
    {
      name: 'Siblings',
      def: 'Siblings elicited'
    },
    {
      name: 'Uncategorized contacts',
      def: 'Clients whose relationship to index was not captured, should be used for cleanup'
    },
    { name: 'All contacts', def: 'All contacts elicited' },
    { name: 'Eligible for Testing', def: 'Contacts eligible for testing' },
    { name: 'Children Status', def: 'Captured child status' }
  ];

  @Output() public resetPrograms = new EventEmitter<any>();

  public ngOnInit() {
    this.getCurrentDepartment();
    this.loadReport();
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public familyTestingService: FamilyTestingService,
    public departmentProgramService: DepartmentProgramsConfigService,
    public localStorage: LocalStorageService,
    public location: Location,
    public _selectDepartmentService: SelectDepartmentService
  ) {}

  public loadReport() {
    this.route.queryParams.subscribe((params: any) => {
      if (_.isEmpty(params)) {
        this.route.parent.parent.params.subscribe((urlParams: any) => {
          this.locationUuid = urlParams.location_uuid;

          if (this.locationUuid) {
            this.resetFilters();
          }
        });
      } else {
        this.locationUuid = params.location_uuid ? params.location_uuid : '';
        this.elicitedStartDate = params.start_date ? params.start_date : '';
        this.elicitedEndDate = params.end_date ? params.end_date : '';
        this.isEligible = params.eligible ? params.eligible : '';
        this.childStatus = params.childStatus ? params.childStatus : '';
        this.elicitedClients = params.elicitedClients
          ? params.elicitedClients
          : '';
        if (this.locationUuid) {
          this.generateReport();
        }
      }
    });
  }

  public generateReport() {
    this.resetStartIndex();
    this.setParams();
    const path = this.router.parseUrl(this.location.path());
    if (!path.queryParams['state']) {
      this.storeParamsInUrl();
    }
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
          this.appendData(data.result);
          this.checkOrderLimit(data.result.length);
        }
      });
  }

  public checkOrderLimit(resultCount: number): void {
    this.hasLoadedAll = false;
    if (this.elicitedClients === '3' && resultCount < 300) {
      this.hasLoadedAll = true;
    } else if (resultCount < this.limit && !(this.elicitedClients === '3')) {
      this.hasLoadedAll = true;
    }
  }

  public loadMorePatients() {
    if (this.elicitedClients === '3') {
      this.startIndex += 300;
    } else {
      this.startIndex += 2000;
    }
    this.generateReport();
  }

  private appendData(data) {
    if (this.startIndex === 0) {
      this.familyTestingPatientList = data;
    } else {
      this.familyTestingPatientList = this.familyTestingPatientList.concat(
        data
      );
    }
  }

  public openDefinitions() {
    this.showIndicatorDefinitions = true;
  }

  public onClickCancel(event) {
    if(!event) {
      this.showIndicatorDefinitions = false;
    }
  }

  private resetStartIndex() {
    this.startIndex = 0;
    this.familyTestingPatientList = [];
  }

  public storeParamsInUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        location_uuid: this.locationUuid,
        eligible: this.isEligible,
        childStatus: this.childStatus,
        elicitedClients: this.elicitedClients,
        start_date: this.elicitedStartDate,
        end_date: this.elicitedEndDate,
        program_type: this.programs
      }
    });
  }

  public onLocationChange(location_uuid) {
    this.locationUuid = location_uuid;
    this.resetFilters();
  }

  public onPatientSelected(params: any) {
    this.router.navigate(['contact-list'], {
      relativeTo: this.route,
      queryParams: {
        patient_uuid: params.patient_uuid,
        eligible: this.isEligible,
        childStatus: this.childStatus,
        elicitedClients: this.elicitedClients,
        start_date: this.elicitedStartDate,
        end_date: this.elicitedEndDate,
        program_type: this.programs
      }
    });
  }

  public onIsEligibleChange($event) {
    this.isEligible = $event;
    this.resetStartIndex();
  }

  public childStatusChange($event) {
    this.childStatus = $event;
    this.resetStartIndex();
  }

  public onElicitedClientsChange(val) {
    this.elicitedClients = val;
    this.resetStartIndex();
  }

  public getSelectedElicitedStartDate($event) {
    this.elicitedStartDate = Moment($event).format('YYYY-MM-DD');
    this.resetStartIndex();
  }

  public getSelectedElicitedEndDate($event) {
    this.elicitedEndDate = Moment($event).format('YYYY-MM-DD');
    this.resetStartIndex();
  }

  public setParams() {
    this.params = {
      locationUuids: this.locationUuid,
      isEligible: this.isEligible,
      childStatus: this.childStatus,
      elicitedClients: this.elicitedClients,
      start_date: this.elicitedStartDate,
      end_date: this.elicitedEndDate,
      startIndex: this.startIndex
    };

    if (!_.isUndefined(this.programs)) {
      _.extend(this.params, {
        programType: this.programs
      });
    }
  }

  public getCurrentDepartment() {
    const department = this._selectDepartmentService.getUserSetDepartment();
    this.getDepartmentPrograms(department);
  }
  public getDepartmentPrograms(department) {
    this.departmentProgramService
      .getDepartmentPrograms(department)
      .pipe(take(1))
      .subscribe((results) => {
        if (results) {
          this.programOptions = _.map(results, (result) => {
            return { value: result.uuid, label: result.name };
          });
        }
      });
  }

  public selectAllPrograms() {
    if (this.programOptions.length > 0) {
      if (this.selectedProgramTagsSelectedAll === false) {
        this.selectedProgramTagsSelectedAll = true;
        this.selectedPrograms = this.programOptions;
      } else {
        this.selectedProgramTagsSelectedAll = false;
        this.selectedPrograms = [];
      }
    }
    this.resetStartIndex();
  }

  public resetFilters() {
    this.isEligible = '';
    this.childStatus = '';
    this.elicitedClients = '';
    this.elicitedStartDate = '';
    this.elicitedEndDate = '';
    this.programs = '';
    this.selectedPrograms = [];
    this.generateReport();
    this.resetStartIndex();
  }

  public getSelectedPrograms(programsUuids): string {
    this.resetStartIndex();
    if (!programsUuids || programsUuids.length === 0) {
      this.programs = '';
      return this.programs;
    }

    let selectedPrograms = '';

    for (let i = 0; i < programsUuids.length; i++) {
      if (i === 0) {
        selectedPrograms = selectedPrograms + programsUuids[0].value;
      } else {
        selectedPrograms = selectedPrograms + ',' + programsUuids[i].value;
      }
    }

    this.programs = selectedPrograms.length > 0 ? selectedPrograms : undefined;
    return this.programs;
  }
}
