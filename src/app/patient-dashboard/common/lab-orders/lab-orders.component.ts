import { Component, OnInit } from "@angular/core";
import { AppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytics.service";
@Component({
  selector: "app-lab-orders",
  templateUrl: "./lab-orders.component.html",
  styleUrls: ["./lab-orders.component.css"],
})
export class LabOrdersComponent implements OnInit {
  constructor(private appFeatureAnalytics: AppFeatureAnalytics) {}

  public ngOnInit() {
    this.appFeatureAnalytics.trackEvent(
      "Patient Dashboard",
      "Lab Orders Loaded",
      "ngOnInit"
    );
  }
}
