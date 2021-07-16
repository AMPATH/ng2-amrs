import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "case-management-indicator-definitions",
  templateUrl: "case-management-indicator-definitions.component.html",
  styleUrls: ["./case-management-indicator-definitions.component.css"],
})
export class CaseManagementIndicatorDefinitionComponent implements OnInit {
  constructor() {}
  @Input()
  public indicatorDefinitions: any;
  public ngOnInit() {}
}
