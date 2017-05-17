import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PatientStatusVisualizationResourceService } from
    '../../etl-api/patient-status-change-visualization-resource.service';
import {
    ClinicDashboardCacheService
} from '../services/clinic-dashboard-cache.service';


@Component({
    selector: 'patient-status-change-list',
    templateUrl: 'patient-status-change-list.component.html',
    styleUrls: ['./patient-status-change-visualization.container.component.css']
})

export class PatientStatusChangeListComponent implements OnInit {
    public options: any = {
      date_range: true
    };
    public extraColumns: Array<any> = [
      {
        headerName: 'RTC Date',
        field: 'rtc_date',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Days Since RTC',
        field: 'days_since_last_RTC',
        width: 200,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'HIV Start Date',
        field: 'hiv_start_date',
        width: 150,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Death Date',
        field: 'death_date',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        },
      },
      {
        headerName: 'Transfer Out',
        field: 'transfer_out',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Last Encounter',
        field: 'encounter_datetime',
        width: 150,
        cellStyle: {
          'white-space': 'normal'
        }
      },
    ];
    private columns = [];
    private filterParams: any;
    private startIndex: number = 0;
    private startDate = new Date();
    private endDate = new Date();
    private data = [];
    private indicator = '';
    private loading = false;
    private error = false;
    private dataLoaded: boolean = false;
    private overrideColumns: Array<any> = [];
    constructor(private route: ActivatedRoute,  private router: Router,
    private patientStatusVisualizationResourceService: PatientStatusVisualizationResourceService,
        private clinicDashboardCacheService: ClinicDashboardCacheService) { }

    ngOnInit() {
        this.startDate = new Date(this.route.snapshot.queryParams['startDate']);
        this.endDate = new Date(this.route.snapshot.queryParams['endDate']);
        this.indicator = this.route.snapshot.queryParams['indicator'];
        this.overrideColumns.push({
          field: 'identifiers',
          onCellClicked: (column) => {
            this.redirectTopatientInfo(column.data.patient_uuid);
          },
          cellRenderer: (column) => {
            return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
          }
        });

    }
    public filtersChanged(event) {
      console.log(event);
      let params = {};
      params['startDate'] = event.startDate.format('YYYY-MM-DD');
      params['endDate'] = event.endDate.format('YYYY-MM-DD');
      params['indicator'] = this.indicator;
      params['startIndex'] = this.startIndex;
      this.filterParams = params;
      this.getPatients();
    }

    private getPatients() {
        this.loading = true;
        this.error = false;
        this.clinicDashboardCacheService.getCurrentClinic().flatMap((location) => {
            if (location) {
                this.filterParams['locationUuids'] = location;
                return this.patientStatusVisualizationResourceService
                .getPatientList(this.filterParams);
            }
            return [];
        }).subscribe((results) => {
            this.loading = false;
            this.data = this.data ? this.data.concat(results.result) : results.result;
            this.startIndex += results.result.length;
            if (results.result.length < 300) {
              this.dataLoaded = true;
            }
        }, (error) => {
            this.error = true;
            this.loading = false;
        });

    }
  private redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/' + patientUuid + '/general/landing-page']);
  }
}
