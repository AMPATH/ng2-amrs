import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import {
  PatientStatusVisualizationResourceService
} from
  '../../etl-api/patient-status-change-visualization-resource.service';
import {
  ClinicDashboardCacheService
} from '../services/clinic-dashboard-cache.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

@Component({
  selector: 'patient-status-change-list',
  templateUrl: 'patient-status-change-list.component.html',
  styleUrls: ['./patient-status-change-visualization.container.component.css']
})

export class PatientStatusChangeListComponent implements OnInit {
  public options: any = {
    date_range: true
  };
  public extraColumns: Array<any> = [];
  private columns = [];
  private filterParams: any;
  private startIndex: number = 0;
  private startDate = new Date();
  private endDate = new Date();
  private data = [];
  private indicator = '';
  private selectedIndicator = '';
  private analysis = '';
  private loading = false;
  private error = false;
  private dataLoaded: boolean = false;
  private overrideColumns: Array<any> = [];
  private progressBarTick: number = 30;
  private timerSubscription: Subscription;
  private subscription = new Subscription();


  constructor(private route: ActivatedRoute, private router: Router,
              private patientStatusResourceService: PatientStatusVisualizationResourceService,
              private clinicDashboardCacheService: ClinicDashboardCacheService) {
  }

  ngOnInit() {
    this.startDate = new Date(this.route.snapshot.queryParams['startDate']);
    this.endDate = new Date(this.route.snapshot.queryParams['endDate']);
    this.indicator = this.route.snapshot.queryParams['indicator'];
    this.selectedIndicator = this.snakeToTitle(this.indicator);
    this.analysis = this.route.snapshot.queryParams['analysis'];
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public filtersChanged(event) {
    let params = {};
    this.startDate = new Date(event.startDate.format('YYYY-MM-DD'));
    this.endDate = new Date(event.endDate.format('YYYY-MM-DD'));
    params['startDate'] = event.startDate.format('YYYY-MM-DD');
    params['endDate'] = event.endDate.format('YYYY-MM-DD');
    params['indicator'] = this.indicator;
    params['analysis'] = this.analysis;
    params['startIndex'] = this.startIndex;
    this.filterParams = params;
    this.getPatients();
  }

  public triggerBusyIndicators(interval: number, show: boolean, hasError: boolean = false): void {
    if (show) {
      this.loading = true;
      this.error = false;
      this.progressBarTick = 30;
      if (this.timerSubscription) this.timerSubscription.unsubscribe();
      this.timerSubscription =
        TimerObservable.create(2000 * interval, 1000 * interval).subscribe(t => {
          if (this.progressBarTick > 100) this.progressBarTick = 30;
          this.progressBarTick++;
        });
    } else {
      this.error = hasError;
      this.progressBarTick = 100;
      if (this.timerSubscription) this.timerSubscription.unsubscribe();
      this.loading = false;
    }
  }

  private getFilters() {
    let params = {};
    params['startDate'] = moment(this.startDate).format('YYYY-MM-DD');
    params['endDate'] = moment(this.endDate).format('YYYY-MM-DD');
    params['indicator'] = this.indicator;
    params['analysis'] = this.analysis;
    params['startIndex'] = this.startIndex;
    return params;
  }

  private getPatients() {
    this.triggerBusyIndicators(1, true, false);
    this.subscription = this.clinicDashboardCacheService.getCurrentClinic().flatMap((location) => {
      if (location) {
        this.filterParams = this.getFilters();
        this.filterParams['locationUuids'] = location;
        return this.patientStatusResourceService
          .getPatientList(this.filterParams);
      }
      return [];
    }).subscribe((results) => {
      let data = this.data ? this.data.concat(results.result) : results.result;
      this.data = _.uniqBy(data, 'patient_uuid');
      this.startIndex += results.result.length;
      this.triggerBusyIndicators(1, false, false);
      if (results.result.length < 300 || results.result.length > 300) {
        this.dataLoaded = true;
      }
    }, (error) => {
      this.triggerBusyIndicators(1, false, true);
    });

  }

  private snakeToTitle(str) {
    return str.split('_').map(function (item) {
      return item.charAt(0).toUpperCase() + item.substring(1);
    }).join(' ');
  }


  private redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/' + patientUuid + '/general/landing-page']);
  }
}
