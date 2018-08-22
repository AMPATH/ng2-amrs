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
  public selectedTab: any = 0;
  public hasError: boolean = false;
  public dataLoading: boolean = false;
  @Input('locations') public locationUuids: any;
  @Input('date') public selectedDate: any;
  private currentLocationSubscription: Subscription;
    constructor(private clinicFlowCacheService: ClinicFlowCacheService,
                private route: ActivatedRoute,
                @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource) { }

    public ngOnInit() {
      this.clinicFlowCacheService.isLoading.subscribe((status) => {
        this.dataLoading = status;
      });
      this.currentLocationSubscription = this.clinicFlowCacheService.getSelectedLocation()
        .subscribe((clinic) => {
          // check if its not clinic dashboard
          if (!clinic) {
            if ((!this.locationUuids || this.locationUuids === '')) {
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
}
