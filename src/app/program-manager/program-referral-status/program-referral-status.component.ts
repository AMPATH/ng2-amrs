import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';

@Component({
  selector: 'program-referral-status',
  templateUrl: './program-referral-status.component.html',
  styleUrls: []
})
export class ProgramReferralStatusComponent implements OnInit {
  public department: string;
  public referralLocation: string;
  public selectedProgram: string;

  @Input()
  public set status(data: any) {
    if (data) {
      this._status = data;
    }
  }

  public get status(): any {
    return this._status;
  }

  private _status: any;

  constructor(
    private departmentProgramService: DepartmentProgramsConfigService,
    private localStorageService: LocalStorageService,
    private locationResourceService: LocationResourceService,
    private programResourceService: ProgramResourceService) { }

  public ngOnInit() {
    if (this._status) {
      this.saveReferralData();
    } else {
      this.removeReferralData();
    }
    this.getReferralLocation();
    this.getSelectedProgram();
  }

  private getSelectedProgram() {
    let programUuid;
    if (_.has(this.status.selectedProgram, 'programUuid')) {
      programUuid = this.status.selectedProgram.programUuid;
    } else {
      programUuid = this.status.selectedProgram;
    }
    this.programResourceService.getProgramByUuid(programUuid).subscribe(
      (program: any) => {
        this.selectedProgram = program.name;
      }, (error) => { console.error('Could not get the program name: ', error); }
    );
  }

  private getReferralLocation() {
    const referralLocationUuid = this.status.referralLocation;
    if (referralLocationUuid) {
      this.locationResourceService.getLocationByUuid(referralLocationUuid).subscribe(
        (result) => { this.referralLocation = result.display; },
        (error) => { console.error('Could not get referral location name: ', error); }
      );
    }
  }

  private saveReferralData() {
    if (this.status.selectedProgram) {
      this.departmentProgramService.getDartmentProgramsConfig()
        .subscribe((results) => {
          if (results) {
            this.saveProgramAndDepartment(results);
          }
        });
    }
  }


  private removeReferralData() {
    this.localStorageService.remove('pm-data');
  }

  private saveProgramAndDepartment(departmentConfig) {
    const programUuidToSave = _.has(this.status.selectedProgram, 'programUuid')
      ? this.status.selectedProgram.programUuid
      : this.status.selectedProgram;

    _.each(departmentConfig, (config: any) => {
      const departmentProgram = _.find(config.programs, (program) => {
        return program && program.uuid === programUuidToSave;
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
