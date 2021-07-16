import { take } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FeedBackService } from "./feedback.service";
import { UserService } from "../openmrs-api/user.service";
import { UserDefaultPropertiesService } from "../user-default-properties/user-default-properties.service";
import { Subscription } from "rxjs";
import * as _ from "lodash";
import { DepartmentProgramsConfigService } from "../etl-api/department-programs-config.service";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "feedback",
  templateUrl: "feedback.component.html",
  styleUrls: ["feedback.component.css"],
  providers: [FeedBackService, UserService, UserDefaultPropertiesService],
})
export class FeedBackComponent implements OnInit, OnDestroy {
  public success = false;
  public error = false;
  public programDepartments: any = [];
  public department: string;
  public selectedDepartment: string;
  public departmentIsSelected = false;
  public isBusy = false;
  public payload = {
    name: "",
    phone: "",
    message: "",
    location: "",
    department: "",
  };
  public postSub: Subscription;
  public errorMessage = "";
  public hasError = false;
  public r1 = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))/;
  public r2 = /(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
  public patterns = new RegExp(this.r1.source + this.r2.source);
  public departmentConf: any[];
  constructor(
    private feedBackService: FeedBackService,
    private userService: UserService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private departmentProgramService: DepartmentProgramsConfigService
  ) {}

  public ngOnInit() {
    this.getDepartmentConf();
  }

  public ngOnDestroy() {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }

  public sendFeedBack() {
    if (this.isBusy) {
      return;
    }
    this.validatePhoneNumberField(this.payload.phone);
    this.payload.name = this.userService.getLoggedInUser().person.display;
    const location =
      this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject() ||
      {};
    this.payload.location = location.display || "Default location not set";
    this.payload.department =
      this.selectedDepartment || "Department not selected";
    this.isBusy = true;
    this.postSub = this.feedBackService
      .postFeedback(this.payload)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.success = true;
          this.isBusy = false;
          console.log("this.payload", this.payload.phone);
          this.payload = {
            name: "",
            phone: "",
            message: "",
            location: "",
            department: "",
          };
        },
        (error) => {
          console.log("Error");
          this.error = true;
          this.isBusy = false;
        }
      );
  }

  public goBack() {
    window.history.back();
  }

  public dismissSuccess() {
    this.success = false;
  }

  public dismissError() {
    this.error = false;
  }
  public getDepartmentConf() {
    this.departmentProgramService
      .getDartmentProgramsConfig()
      .pipe(take(1))
      .subscribe((results) => {
        console.log("results===", results);
        if (results) {
          this.departmentConf = results;
          this._filterDepartmentConfigByName();
        }
      });
  }
  public getSelectedDepartment(dep) {
    this.selectedDepartment = dep;
    if (dep) {
      this.departmentIsSelected = true;
    }
  }

  private setErroMessage(message) {
    this.hasError = true;
    this.errorMessage = message;
  }

  private validatePhoneNumberField(phone) {
    if (this.isNullOrUndefined(phone)) {
      this.setErroMessage("Phone number is required.");
      return false;
    }

    return true;
  }

  private isNullOrUndefined(val) {
    return (
      val === null ||
      val === undefined ||
      val === "" ||
      val === "null" ||
      val === "undefined"
    );
  }
  private _filterDepartmentConfigByName() {
    this.programDepartments = _.map(this.departmentConf, (config: any) => {
      return { name: config.name };
    });
  }
}
