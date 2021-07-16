import { Router } from "@angular/router";
import { LocalStorageService } from "../utils/local-storage.service";
import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "department-select",
  templateUrl: "department-select.component.html",
  styleUrls: ["./department-select.component.css"],
})
export class DepartmentSelectComponent implements OnInit {
  public departments: any;
  public currentDepartment = "";
  public dashRoute: string;

  constructor(
    public locaStorageService: LocalStorageService,
    public router: Router
  ) {}

  public ngOnInit() {
    this.getCurrentDepartment();
  }
  public clinicDashboardDepts(departments, route) {
    this.dashRoute = route;
    this.departments = [];
    _.each(departments, (department: any) => {
      if (department.baseRoute !== "general") {
        const specDept = {
          name: department.departmentName,
          baseRoute: department.baseRoute,
        };
        this.departments.push(specDept);
      }
    });
  }

  public setDefaultDepartment(department) {
    const departmentObj = [
      {
        itemName: department.name,
        id: "",
      },
    ];
    this.locaStorageService.setItem(
      "userDefaultDepartment",
      JSON.stringify(departmentObj)
    );
    this.router.navigate([this.dashRoute]);
  }

  public getCurrentDepartment() {
    const currentDepartmentObj: any = JSON.parse(
      this.locaStorageService.getItem("userDefaultDepartment")
    );
    if (typeof currentDepartmentObj !== "undefined") {
      this.currentDepartment = currentDepartmentObj[0].itemName;
    } else {
      this.currentDepartment = "HIV";
    }
  }
}
