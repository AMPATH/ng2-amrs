import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from "@angular/core";
import { take } from "rxjs/operators/take";
import { RetentionReportResourceService } from "../../etl-api/retention-report-resource.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ChangeDetectorStatus } from "@angular/core/src/change_detection/constants";
import { BsModalService, BsModalRef } from "ngx-bootstrap";

@Component({
  selector: "retention-report",
  templateUrl: "./retention-report.component.html",
  styleUrls: ["./retention-report.component.css"],
})
export class RetentionReportComponent implements OnInit, OnChanges {
  public title = "Retention Report Indicators";
  @Input() public location = [];
  @Input() public dashboardType = "";
  public params: any;
  public sectionDefs: any;
  public busyIndicator: any = {
    busy: false,
    message: "Please wait...", // default message
  };
  public startDate: string;
  public endDate: string;
  public startAge: string;
  public endAge: string;
  public period: string;
  public gender: any;
  public errorObj = {
    isError: false,
    message: "",
  };
  public retentionSummary: any;
  public locationUuids: any;
  public indicatorDefinitions: any;
  public modalRef: BsModalRef;
  public currentView = "weekly";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private retentionReportService: RetentionReportResourceService,
    private modalService: BsModalService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.params = params;
          if (params.startDate) {
            this.setQueryParams();
            this.fetchReport();
          }
          this.setReportData(params);
        }
      },
      (error) => {
        console.error("Error", error);
      }
    );

    this.retentionReportService
      .getRetentionIndicatorDefinitions()
      .subscribe((result) => {
        if (result) {
          this.indicatorDefinitions = result;
        }
      });
  }

  public ngOnChanges(change: SimpleChanges) {
    if (
      change.location &&
      typeof change.location.previousValue !== "undefined"
    ) {
      this.setQueryParams();
      this.fetchReport();
    }
  }

  public setReportData(params: any) {
    this.title = params.report;
    if (params.startDate) {
      this.startDate = params.startDate;
    }
    if (params.endDate) {
      this.endDate = params.endDate;
    }
    if (params.startAge) {
      this.startAge = params.startAge;
    }
    if (params.endAge) {
      this.endAge = params.endAge;
    }
    if (params.period) {
      this.period = params.period;
    }

    if (params.locationUuids && this.dashboardType === "analytics-dashboard") {
      this.location = params.locationUuids;
    }
    if (typeof params.gender === "string") {
      const genderArray = [];
      genderArray.push(params.gender);
      this.gender = genderArray;
    } else {
      this.gender = params.gender;
    }
  }

  public setQueryParams() {
    this.params = {
      startAge: this.params.startAge,
      endAge: this.params.endAge,
      startDate: this.params.startDate,
      endDate: this.params.endDate,
      gender: this.params.gender,
      period: this.params.period,
      type: this.params.type,
      reportUuid: this.params.reportUuid,
      indicators: this.params.indicators,
      locationUuids: this.location,
    };
  }
  public getQueryParams() {
    this.setQueryParams();
    return this.params;
  }
  public generateReport() {
    this.getQueryParams();
  }

  public fetchReport() {
    this.loading();
    this.resetErrorMsg();
    this.retentionReportService
      .getRetentionReport(this.params)
      .pipe(take(1))
      .subscribe(
        (result: any) => {
          if (result) {
            this.retentionSummary = result.result;
            this.sectionDefs = result.sectionDefinitions;
          }
          this.endLoading();
        },
        (err) => {
          this.endLoading();
          this.errorObj = {
            isError: true,
            message:
              "An error occurred while trying to load the report.Please reload page",
          };
        }
      );
  }

  public loading() {
    this.busyIndicator = {
      busy: true,
      message: "Fetching report...please wait",
    };
  }

  public endLoading() {
    this.busyIndicator = {
      busy: false,
      message: "",
    };
  }
  public showModal(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal);
  }
  public resetErrorMsg() {
    this.errorObj = {
      isError: false,
      message: "",
    };
  }

  public onTabChanged($event) {}
}
