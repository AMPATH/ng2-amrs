import { Component, OnInit } from '@angular/core';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { ActivatedRoute } from '@angular/router';
import { DefaulterListResourceService } from '../../../etl-api/defaulter-list-resource.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

interface ReportParams {
  maxDefaultPeriod: number;
  minDefaultPeriod: number;
  locationUuids: string;
}

@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.css']
})
export class DefaulterListComponent implements OnInit {
  public errors: any[] = [];
  public defaulterList: any[] = [];
  public locationUuids: string;
  public params: any;
  public routeSub: Subscription = new Subscription();
  public loadingDefaulterList = false;

  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private defaulterListResource: DefaulterListResourceService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params.locationUuids) {
          this.params = params;
          this.locationUuids = params.locationUuids;
          this.getDefaulterList();
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
    this.subScribeToClinicLocationChange();
    this.subscribeToRouteParamsChange();
  }

  public extraColumns() {
    return [
      {
        headerName: 'Program',
        field: 'program',
        width: 150,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Rtc Date',
        field: 'rtc_date',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Days sinc Rtc',
        field: 'days_since_rtc',
        width: 100
      },
      {
        headerName: 'Filing Id',
        field: 'filed_id',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Phone Number',
        field: 'phone_number',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Latest Appointment',
        width: 200,
        field: 'last_appointment'
      },
      {
        headerName: 'Patient Category',
        width: 150,
        field: 'patient_category'
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date'
      },
      {
        headerName: 'Current Regimen',
        width: 200,
        field: 'cur_meds'
      },
      {
        headerName: 'OVCID',
        field: 'ovcid_id',
        width: 150
      },
      {
        headerName: 'Latest VL',
        width: 75,
        field: 'latest_vl'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'latest_vl_date'
      },
      {
        headerName: 'Previous VL',
        width: 75,
        field: 'previous_vl'
      },
      {
        headerName: 'Previous VL Date',
        width: 150,
        field: 'previous_vl_date'
      },
      {
        headerName: 'Nearest Center',
        width: 150,
        field: 'nearest_center'
      }
    ];
  }
  public getReportParams(): ReportParams {
    const params: ReportParams = {
      maxDefaultPeriod: this.params.maxDefaultPeriod,
      minDefaultPeriod: this.params.minDefaultPeriod,
      locationUuids: this.locationUuids
    };

    return params;
  }
  public getDefaulterList(): void {
    this.loadingDefaulterList = true;
    const params = this.getReportParams();
    this.defaulterListResource.getDefaulterList(params).subscribe(
      (result: any) => {
        this.defaulterList = result;
        this.loadingDefaulterList = false;
      },
      (error: any) => {
        this.loadingDefaulterList = false;
      }
    );
  }
  public subScribeToClinicLocationChange(): void {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
      });
  }
  public subscribeToRouteParamsChange(): void {
    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.locationUuids = params['location_uuid'];
      this.clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });
  }
  public resetFilter($event: Boolean): void {
    if ($event) {
      this.defaulterList = [];
    }
  }
}
