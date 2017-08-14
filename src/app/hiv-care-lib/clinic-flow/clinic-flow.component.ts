import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClinicFlowResource } from '../../etl-api/clinic-flow-resource-interface';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'clinic-flow',
    templateUrl: './clinic-flow.component.html'
})

export class ClinicFlowComponent implements OnInit, OnDestroy {
  selectedTab: any = 0;
  currentLocationSubscription: Subscription;
  hasError: boolean = false;
  @Input('locations') locationUuids: any;
  @Input('date') selectedDate: any;
    constructor(private clinicFlowCacheService: ClinicFlowCacheService,
                private route: ActivatedRoute,
        @Inject('ClinicFlowResource') private clinicFlowResource: ClinicFlowResource) { }

    ngOnInit() {

      this.currentLocationSubscription = this.clinicFlowCacheService.getSelectedLocation()
        .subscribe(clinic => {
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

    ngOnDestroy() {
      this.hasError = false;
    }
}