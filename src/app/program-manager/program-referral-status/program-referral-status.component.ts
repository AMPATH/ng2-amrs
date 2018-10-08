import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import * as _ from 'lodash';

import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { LocalStorageService } from '../../utils/local-storage.service';

@Component({
  selector: 'program-referral-status',
  templateUrl: './program-referral-status.component.html',
  styleUrls: []
})
export class ProgramReferralStatusComponent implements OnInit {
  public department: string;
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
  constructor(private departmentProgramService: DepartmentProgramsConfigService,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit() {
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
    _.each(departmentConfig, (config: any) => {
      let departmentProgram = _.find(config.programs, (program) => {
        return program && program.uuid === this.status.selectedProgram.programUuid;
      });
      if (departmentProgram) {
        let currentPmData = this.localStorageService.getObject('pm-data') || {};
        this.department = config.name;
        this.localStorageService.setObject('pm-data', _.merge(currentPmData, {
          department: config.name
        }, this.status));
      }
    });
  }
}
