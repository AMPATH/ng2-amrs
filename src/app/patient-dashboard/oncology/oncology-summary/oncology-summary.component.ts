import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { ProgramResourceService } from "../../../openmrs-api/program-resource.service";
@Component({
  selector: "app-oncology-summary",
  templateUrl: "./oncology-summary.component.html",
  styles: [],
})
export class OncologySummaryComponent implements OnInit {
  public program: any;
  public programUuid: string;
  constructor(
    private route: ActivatedRoute,
    private programService: ProgramResourceService
  ) {}

  public ngOnInit() {
    this.route.params.subscribe((response) => {
      this.programUuid = response["program"];
    });
    if (this.programUuid) {
      this.programService
        .getProgramByUuid(this.programUuid)
        .subscribe((response: any) => {
          this.program = _.startCase(_.lowerCase(response.name));
        });
    }
  }
}
