import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "program-manager-container",
  templateUrl: "./program-manager-container.component.html",
  styleUrls: ["./program-manager-container.component.css"],
})
export class ProgramManagerContainerComponent implements OnInit {
  public queryParams = {};
  constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
  }
}
