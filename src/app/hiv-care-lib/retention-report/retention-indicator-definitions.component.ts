import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "retention-indicator-definitions",
  templateUrl: "retention-indicator-definitions.component.html",
  styleUrls: ["./retention-indicator-definitions.component.css"],
})
export class RetentionIndicatorDefComponent implements OnInit {
  constructor() {}
  @Input()
  public indicatorDefinitions: any;
  public ngOnInit() {}
}
