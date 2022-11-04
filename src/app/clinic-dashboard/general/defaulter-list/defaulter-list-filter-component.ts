import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-defaulter-list-filter',
  templateUrl: './defaulter-list-filter.component.html',
  styleUrls: ['./defaulter-list-filter-component.css']
})
export class DefaulterListFilterComponent implements OnInit {
  public minDefaultPeriod: number;
  public maxDefaultPeriod: number;
  public filterData = {
    minDefaultPeriod: 0,
    maxDefaultPeriod: 0,
    locationUuids: ''
  };
  @Input() public currentLocation: string;
  @Output() public resetFilter: EventEmitter<Boolean> =
    new EventEmitter<Boolean>();
  public params = {
    minDefaultPeriod: 0,
    maxDefaultPeriod: 0,
    locationUuid: ''
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.params = params;
          if (params.locationUuids) {
            this.setFilterDataFromUrlParams(params);
          }
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }
  public setFilter(): void {
    this.filterData.maxDefaultPeriod = this.maxDefaultPeriod;
    this.filterData.minDefaultPeriod = this.minDefaultPeriod;
    this.filterData.locationUuids = this.currentLocation;
    this.setFilterParamsToUrl(this.filterData);
  }

  public setFilterParamsToUrl(params: any) {
    const navigationData = {
      queryParams: params,
      replaceUrl: true
    };

    const currentUrl = this.router.url;

    const routeUrl = currentUrl.split('?')[0];
    this.router.navigate([routeUrl], navigationData);
  }

  public setFilterDataFromUrlParams(params: any): void {
    this.minDefaultPeriod = params.minDefaultPeriod;
    this.maxDefaultPeriod = params.maxDefaultPeriod;
  }
  public resetFilters(): void {
    this.minDefaultPeriod = 0;
    this.maxDefaultPeriod = 0;
    this.resetFilter.emit(true);
  }
}
