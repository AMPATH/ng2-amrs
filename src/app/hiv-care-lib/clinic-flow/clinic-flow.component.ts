import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClinicFlowResource } from '../../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'clinic-flow',
  templateUrl: './clinic-flow.component.html'
})
export class ClinicFlowComponent implements OnInit, OnDestroy {
  public selectedTab = 0;
  public hasError = false;
  public dataLoading = false;
  public params: any;
  // tslint:disable-next-line:no-input-rename
  @Input('locations') public locationUuids: any;
  // tslint:disable-next-line:no-input-rename
  @Input('date') public selectedDate: any;
  private currentLocationSubscription: Subscription;
  constructor(
    private clinicFlowCacheService: ClinicFlowCacheService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.params = params;
          if (params.selectedTab) {
            this.selectedTab = params.selectedTab;
          }
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
    this.clinicFlowCacheService.isLoading.subscribe((status) => {
      this.dataLoading = status;
    });
    this.currentLocationSubscription = this.clinicFlowCacheService
      .getSelectedLocation()
      .subscribe((clinic) => {
        // check if its not clinic dashboard
        if (!clinic) {
          if (!this.locationUuids || this.locationUuids === '') {
            this.hasError = true;
          } else {
            this.clinicFlowCacheService.setSelectedLocation(this.locationUuids);
          }
        }
      });
    if (this.selectedDate) {
      this.clinicFlowCacheService.setSelectedDate(this.selectedDate);
    }
  }

  public ngOnDestroy() {
    this.hasError = false;
  }
  public selectedTabChange($event: any): void {
    this.selectedTab = $event.index;
    this.addSelectedTabParamsToUrl(this.selectedTab);
  }
  public addSelectedTabParamsToUrl(selectedTabIndex: number): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        selectedTab: selectedTabIndex
      },
      queryParamsHandling: 'merge'
    });
  }
}
