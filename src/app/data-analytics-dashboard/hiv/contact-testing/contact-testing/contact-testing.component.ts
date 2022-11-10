import { SelectDepartmentService } from './../../../../shared/services/select-department.service';
import { DataAnalyticsDashboardService } from './../../../services/data-analytics-dashboard.services';
import { LocalStorageService } from './../../../../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../../../../etl-api/department-programs-config.service';
import { FamilyTestingService } from './../../../../etl-api/family-testing-resource.service';
import { FamilyTestingBaseComponent } from './../../../../hiv-care-lib/family-testing/family-testing-base.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import * as rison from 'rison-node';

@Component({
  selector: 'app-contact-testing',
  templateUrl:
    './../../../../hiv-care-lib/family-testing/family-testing-base.component.html',
  styleUrls: [
    './../../../../hiv-care-lib/family-testing/family-testing-base.component.css'
  ]
})
export class ContactTestingComponent
  extends FamilyTestingBaseComponent
  implements OnInit {
  public enabledControls = 'familyTestingControls,locationControl';
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public familyTestingService: FamilyTestingService,
    public departmentProgramService: DepartmentProgramsConfigService,
    public localStorage: LocalStorageService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    public _selectDepartmentService: SelectDepartmentService,
    public location: Location
  ) {
    super(
      router,
      route,
      familyTestingService,
      departmentProgramService,
      localStorage,
      location,
      _selectDepartmentService
    );
  }

  ngOnInit() {
    this.getCurrentDepartment();
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.storeUrlParams();
    this.locationUuid = this.getSelectedLocations(this.locationUuids);
    super.generateReport();
  }

  public storeUrlParams() {
    this.setSelectedLocation();
    const state = {
      locationUuids: this.getSelectedLocations(this.locationUuids),
      eligible: this.isEligible,
      childStatus: this.childStatus,
      elicitedClients: this.elicitedClients,
      start_date: this.elicitedStartDate,
      end_date: this.elicitedEndDate,
      program_type: this.programs
    };
    const stateUrl = rison.encode(state);
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      state: stateUrl
    };

    this.location.replaceState(path.toString());
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    if (path.queryParams['state']) {
      const state = rison.decode(path.queryParams['state']);
      this.locationUuid = state.locations;
      (this.isEligible = state.eligible),
        (this.childStatus = state.childStatus),
        (this.elicitedClients = state.elicitedClients),
        (this.elicitedStartDate = state.start_date),
        (this.elicitedEndDate = state.end_date),
        (this.programs = state.program_type);
    }

    if (path.queryParams['state']) {
      this.generateReport();
    }
  }

  public setSelectedLocation() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          this.locationUuids = data.locations;
        }
      });
  }

  private getSelectedLocations(locationUuids: Array<any>): string {
    return locationUuids.map((location) => location.value).join(',');
  }
}
