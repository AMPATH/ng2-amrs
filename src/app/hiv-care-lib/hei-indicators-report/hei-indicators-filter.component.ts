import { take } from "rxjs/operators";
import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Subject } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import * as Moment from "moment";

@Component({
  selector: "hei-indicators-filter",
  templateUrl: "./hei-indicators-filter.component.html",
  styleUrls: ["./hei-indicators-filter.component.css"],
})
export class HeiIndicatorsFilterComponent implements OnInit {
  public showLocationsControl = false;
  public isMonthMode = true;
  public showIsAggregateControl = false;
  public endDateString = "";
  public startDateString = "";
  public monthString = "";
  public locationUuids = [];
  public params = {
    locationUuids: [],
    startDate: "",
    endDate: "",
  };
  public filterCollapsed = false;
  public parentIsBusy = false;
  @Output() public selectedFilter: EventEmitter<any> = new EventEmitter();
  @Input() public locations: any;

  constructor(private _router: Router, private _route: ActivatedRoute) {}

  public ngOnInit() {
    this._route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.params = params;
          // cater for endpoints taking long to return data
          setTimeout(() => {
            this.loadFilterFromUrlParams(params);
          }, 1000);
        }
      },
      (error) => {
        console.error("Error", error);
      }
    );
  }

  public loadFilterFromUrlParams(params) {
    const newParams: any = {
      startDate: "",
      endDate: "",
      locationUuids: [],
    };
    if (params.startDate) {
      if (params.endDate) {
        newParams.endDate = params.endDate;
      }
      if (params.startDate) {
        newParams.startDate = params.startDate;
        this.monthString = Moment(params.startDate).format("YYYY-MM");
      }
      if (params.locationUuids && params.locationUuids.length > 0) {
        this.locations = params.locationUuids;
        newParams.locationUuids = params.locationUuids;
      }

      this.params = newParams;
      this.selectedFilter.emit(this.params);
    }
  }

  public onClickedGenerate() {
    this.setQueryParams();
  }

  public setQueryParams() {
    this.params = {
      locationUuids: this.locations,
      startDate: Moment(this.monthString, "YYYY-MM")
        .startOf("month")
        .format("YYYY-MM-DD"),
      endDate: Moment(this.monthString, "YYYY-MM")
        .endOf("month")
        .format("YYYY-MM-DD"),
    };

    this.passParamsToUrl(this.params);
  }

  public passParamsToUrl(params) {
    const navigationData = {
      queryParams: params,
      replaceUrl: true,
    };

    const currentUrl = this._router.url;
    const routeUrl = currentUrl.split("?")[0];
    this._router.navigate([routeUrl], navigationData);
  }

  public getQueryParams() {
    return this.params;
  }
}
