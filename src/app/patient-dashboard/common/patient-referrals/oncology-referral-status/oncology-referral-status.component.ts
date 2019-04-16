import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { DepartmentProgramsConfigService } from 'src/app/etl-api/department-programs-config.service';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { LocationResourceService } from '../../../../openmrs-api/location-resource.service';

@Component({
  selector: 'oncology-referral-status',
  templateUrl: './oncology-referral-status.component.html',
  styleUrls: ['./oncology-referral-status.component.css']
})
export class OncologyReferralStatusComponent implements OnInit {
  public department: string;
  public referralLocation: string;
  @Input()
  public set status(data: any) {
    if (data) {
      this._status = data;
      this.saveReferralData();
    } else {
      this.removeReferralData();
    }
  }

  public get status(): any {
    return this._status;
  }

  private _status: any;

  constructor(
    private departmentProgramService: DepartmentProgramsConfigService,
    private localStorageService: LocalStorageService,
    private locationResourceService: LocationResourceService) { }

  public ngOnInit() {
  }

  private saveReferralData() {
    if (this.status.selectedProgram) {
      this.departmentProgramService.getDartmentProgramsConfig()
        .subscribe((results) => {
          if (results) {
            this.getReferralLocation();
            this.saveProgramAndDepartment(results);
          }
        });
    }
  }

  private removeReferralData() {
    this.localStorageService.remove('pm-data');
  }

  private getReferralLocation() {
    const referralLocationUuid = this.localStorageService.getItem('referralLocation');
    if (referralLocationUuid) {
      this.locationResourceService.getLocationByUuid(referralLocationUuid).subscribe(
        (result) => { this.referralLocation = result.display; },
        (error) => { console.error('Could not get referral location name: ', error); }
      );
    }
  }

  private saveProgramAndDepartment(departmentConfig) {
    _.each(departmentConfig, (config: any) => {
      const departmentProgram = _.find(config.programs, (program) => {
        return program && program.uuid === this.status.selectedProgram.programUuid;
      });
      if (departmentProgram) {
        const currentPmData = this.localStorageService.getObject('pm-data') || {};
        this.department = config.name;
        this.localStorageService.setObject('pm-data', _.merge(currentPmData, {
          department: config.name
        }, this.status));
      }
    });
  }
}
