import { take } from 'rxjs/operators';
import {
  Component,
  ViewEncapsulation,
  Input,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { ClinicalSummaryVisualizationResourceService } from '../../../../etl-api/clinical-summary-visualization-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as Moment from 'moment';
import { ClinicDashboardCacheService } from '../../../services/clinic-dashboard-cache.service';
@Component({
  selector: 'patient-status-overview-chart',
  styleUrls: [],
  templateUrl: './patient-status-overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PatientStatusOverviewComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() public data: any;
  @Input() public indicatorDef: any;
  public loadingPatientStatus = false;
  private patientStatusData: any;
  private startDate: any;
  private endDate: any;
  private location: any;
  private startIndex: any = 0;
  private limit: any = 0;
  private fetchError = false;
  private patientList: any;
  private patientCounts: any;
  private chartTitle =
    'A comparative chart showing patient care status statistics';
  private _data = new BehaviorSubject<any>([]);
  private subs: Subscription[] = [];
  constructor(
    private visualizationResourceService: ClinicalSummaryVisualizationResourceService,
    private router: Router,
    private route: ActivatedRoute,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    if (!this.options) {
      this.options = {};
    }
    const urlPieces = window.location.hash.split('/');
    this.location = urlPieces[2];
  }
  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  public ngOnInit() {
    if (this._data) {
      this._data.subscribe((x) => {
        if (this.options) {
          if (this.options.filtered) {
            if (this.loadingPatientStatus === false) {
              this.startDate = this.options.filtered.startDate._i;
              this.endDate = this.options.filtered.endDate._i;
              const sub = this.clinicDashboardCacheService
                .getCurrentClinic()
                .subscribe((clinic) => {
                  this.location = clinic;
                  this.getPatientStatusOverviewData();
                });
              this.subs.push(sub);
            }
          }
        }
      });
    }
  }
  public ngAfterViewInit(): void {
    this.changeDetectionRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public getPatientStatusOverviewData() {
    this.loadingPatientStatus = true;
    this.visualizationResourceService
      .getPatientCareStatusReport({
        startDate: this.startDate,
        startIndex: this.startIndex,
        locationUuids: this.location,
        limit: this.limit,
        endDate: this.endDate,
        gender: 'M,F',
        groupBy: '',
        indicators: '',
        order: 'encounter_datetime%257Casc'
      })
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.patientStatusData = data.result;
          this.indicatorDef = data.indicatorDefinitions;
          this.generatePatientStatusOverviewChart(this.patientStatusData);
          this.loadingPatientStatus = false;
        },
        (error) => {
          this.fetchError = true;
        }
      );
  }
  public generatePatientStatusOverviewChart(result) {
    const startDate = Moment(this.startDate).format('DD/MM/YYYY');
    const endDate = Moment(this.endDate).format('DD/MM/YYYY');
    let chartData = [];
    const that = this;
    _.each(result, (data: any) => {
      chartData = [
        {
          y: data.patients_continuing_care,
          name: 'Patients In Care',
          color: '#1f77b4',
          indicator: 'patients_continuing_care'
        },
        {
          y: data.transferred_out_patients,
          name: 'Transferred Out Patients',
          color: '#FF7F0E',
          indicator: 'transferred_out_patients'
        },
        {
          y: data.deceased_patients,
          name: 'Deceased Patients',
          color: '#2CA02C',
          indicator: 'deceased_patients'
        },
        {
          y: data.untraceable_patients,
          name: 'Untraceable Patients',
          color: '#d62728',
          indicator: 'untraceable_patients'
        },
        {
          y: data.hiv_negative_patients,
          name: 'HIV Negative Patients',
          color: '#9467bd',
          indicator: 'hiv_negative_patients'
        },
        {
          y: data.self_disengaged_from_care,
          name: 'Self Disengaged From Care',
          color: '#8c564b',
          indicator: 'self_disengaged_from_care'
        },
        {
          y: data.defaulters,
          name: 'Defaulters',
          color: '#e377c2',
          indicator: 'defaulters'
        },
        {
          y: data.other_patient_care_status,
          name: 'Others',
          color: '#7F7F7F',
          indicator: 'other_patient_care_status'
        }
      ];
      this.patientCounts = data.patients;
    });

    this.options = {
      title: { text: this.chartTitle },
      subtitle: {
        text: 'Starting from ' + startDate + ' To ' + endDate
      },
      chart: { type: 'pie' },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              // color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          },
          showInLegend: true
        }
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'top',
        y: 100,
        labelFormatter: function () {
          return this.name + ' (' + this.percentage.toFixed(2) + '%)';
        }
      },
      credits: {
        text:
          '<strong><b>Total Patients: ' + this.patientCounts + '</b></strong>',
        position: {
          align: 'right',
          y: -5 // position of credits
        },
        style: {
          fontSize: '1.5em'
        }
      },
      series: [
        {
          name: '#',
          data: chartData,
          point: {
            events: {
              click: function () {
                that.generatePatientList(this);
              }
            }
          }
        }
      ]
    };
  }
  public generatePatientList(point) {
    const startDate = Moment(this.startDate).format('DD/MM/YYYY');
    const endDate = Moment(this.endDate).format('DD/MM/YYYY');
    this.router.navigate(
      [
        './patient-list',
        'clinical-patient-care-status-overview',
        point.indicator,
        startDate + '|' + endDate
      ],
      { relativeTo: this.route }
    );
  }
}
