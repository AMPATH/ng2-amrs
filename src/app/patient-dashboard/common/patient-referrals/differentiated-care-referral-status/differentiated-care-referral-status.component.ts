import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "diff-care-referral-status",
  templateUrl: "./differentiated-care-referral-status.component.html",
  styleUrls: ["./differentiated-care-referral-status.component.css"],
})
export class DifferentiatedCareReferralStatusComponent implements OnInit {
  @Input()
  public status: any = undefined;

  constructor() {}

  public ngOnInit() {}
}
