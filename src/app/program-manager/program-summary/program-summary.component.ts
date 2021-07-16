import { take } from "rxjs/operators";
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ProgramManagerBaseComponent } from "../base/program-manager-base.component";
import { PatientService } from "../../patient-dashboard/services/patient.service";
import { ProgramService } from "../../patient-dashboard/programs/program.service";
import { DepartmentProgramsConfigService } from "../../etl-api/department-programs-config.service";
import { UserDefaultPropertiesService } from "../../user-default-properties/user-default-properties.service";
import { PatientProgramResourceService } from "../../etl-api/patient-program-resource.service";
import { LocalStorageService } from "../../utils/local-storage.service";

@Component({
  selector: "program-summary",
  templateUrl: "./program-summary.component.html",
  styleUrls: ["./program-summary.component.css"],
})
export class ProgramSummaryComponent
  extends ProgramManagerBaseComponent
  implements OnInit {
  constructor(
    public patientService: PatientService,
    public programService: ProgramService,
    public router: Router,
    public route: ActivatedRoute,
    public departmentProgramService: DepartmentProgramsConfigService,
    public userDefaultPropertiesService: UserDefaultPropertiesService,
    public patientProgramResourceService: PatientProgramResourceService,
    public cdRef: ChangeDetectorRef,
    public localStorageService: LocalStorageService
  ) {
    super(
      patientService,
      programService,
      router,
      route,
      departmentProgramService,
      userDefaultPropertiesService,
      patientProgramResourceService,
      cdRef,
      localStorageService
    );
  }

  public ngOnInit() {
    this.getDepartmentConf();
    this.loadPatientProgramConfig()
      .pipe(take(1))
      .subscribe(
        (loaded) => {
          if (loaded) {
            this.mapEnrolledProgramsToDepartment();
          }
        },
        (error) => {
          this.loaded = true;
          this.hasError = true;
        }
      );
  }

  public goToProgramLandingPage(department) {
    const programs = department.programs;
    // just use the first program. Every program has a landing page url set in 'buttons' property
    const url = programs[0].buttons.landing.url;
    this.router.navigate([url], {});
  }
}
