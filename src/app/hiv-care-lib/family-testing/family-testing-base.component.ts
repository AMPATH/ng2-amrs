import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';

@Component({
  selector: 'family-testing-base-report',
  templateUrl: './family-testing-base.component.html',
  styleUrls: ['./family-testing-base.component.css']
})
export class FamilyTestingBaseComponent implements OnInit {
  public isLoading: boolean;
  public enabledControls: Array<string> = [];
  public endDate: Date = new Date();
  public locationUuid: string;
  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public params: object;
  public familyTestingPatientList: Array<any>;
  public reportName = 'FamilyTesting';

  public ngOnInit() {
    this.route.parent.parent.params.subscribe((params: any) => {
      this.locationUuid = params.location_uuid;
      if (this.locationUuid) {
        this.generateReport();
      }
    });
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private familyTestingService: FamilyTestingService
  ) {}
  public generateReport() {
    this.storeParamsInUrl();
    this.isLoading = true;
    this.familyTestingService
      .getFamilyTreePatientList(this.locationUuid)
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
      queryParams: { locationUuid: this.locationUuid }
    });
  }

  public onLocationChange(location_uuid) {
    this.locationUuid = location_uuid;
  }

  public onPatientSelected(params: any) {
    this.router.navigate(['contact-list'], {
      relativeTo: this.route,
      queryParams: { patient_uuid: params.patient_uuid }
    });
  }
}
