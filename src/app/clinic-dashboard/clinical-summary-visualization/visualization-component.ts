import { Component, ViewEncapsulation, OnInit, Input, AfterViewInit,
  ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import {
  ClinicDashboardCacheService
} from '../services/clinic-dashboard-cache.service';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../etl-api/clinical-summary-visualization-resource.service';
import { ClinicalSummaryVisualizationService
} from '../services/clinical-summary-visualization.service';

@Component({
  selector: 'clinical-summary-visualization',
  templateUrl: './visualization-component.html',
  styleUrls: ['./visualization-component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VisualizationComponent implements OnInit, AfterViewInit {
  @Input() filterModel: any;
  artChartOptions: any = {};
  startDate: any;
  endDate: any;
  _startDate: any;
  _endDate: any;
  loadingHivCare: boolean = false;
  loadingArt: boolean = false;
  loadingPatientStatus: boolean = false;
  locationUuid: any;
  hivComparativeChartOptions: any = {};
  options: any = {
    date_range: true
  };
  patientStatusChartOptionsFilters: any;
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private changeDetectionRef: ChangeDetectorRef,
              private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService,
              private visualizationResourceService: ClinicalSummaryVisualizationResourceService
  ) {
    this.filterModel = this.filterModel ? this.filterModel : {};

    /**
     * Please note that this is a workaround for the dashboardService
     * delay to give you the location UUID.
     * If a better way can be found, please consider
     */
    let urlPieces = window.location.hash.split('/');
    this.locationUuid = urlPieces[2];
    this.filterModel['locationUuid'] = this.locationUuid;
  }

  ngOnInit() {
    /**
     * Subscribe to the service for consistency when filters change
     */
    this.artChartOptions['data'] = {};
    let _filterModel = this.clinicDashboardCacheService.getByKey('filterModel');
    if (_filterModel) {
      this.startDate = _filterModel.startDate.format();
      this.endDate = _filterModel.endDate.format();
    }
    this.clinicDashboardCacheService.getCurrentClinic().subscribe((clinic) => {
      if (this.locationUuid && clinic !== this.locationUuid && this.filterModel.startDate) {
        this.locationUuid = clinic;
        this.filterModel['locationUuid'] = this.locationUuid;
        this.renderCharts();
      }
    });
  }

  ngAfterViewInit(): void {
     this.changeDetectionRef.detectChanges();
  }

  renderCharts() {
    this.patientStatusChartOptionsFilters = {filtered: this.filterModel,
      };
    // loading: this.loadingArt
    this.clinicDashboardCacheService.add('filterModel', this.filterModel);
    this.generateHIVCareComparativeOverviewChart();
  }

  generateArtOverview() {
    this.loadingArt = true;
    let _options = {};
    let subtitle = '';
    if (this.filterModel.startDate) {
      subtitle = 'Starting from ' + this.filterModel.startDate.format('DD/MM/YYYY');
    }

    if (this.filterModel.endDate) {
      subtitle = subtitle + ' To ' + this.filterModel.endDate.format('DD/MM/YYYY');
    }

    if (subtitle.length > 0) {
      _.merge(_options, {
        title: {
          text: 'A comparative chart showing ARV Drugs consumption statistics'
        },
        subtitle: {
          text: subtitle
        },
        filters: this.filterModel
      });
    }

    this._startDate = this.clinicalSummaryVisualizationService.getMonthDateRange(
      this.filterModel.startDate.clone().year(),
      this.filterModel.startDate.clone().month()
    );

    this._endDate = this.clinicalSummaryVisualizationService.getMonthDateRange(
      this.filterModel.endDate.clone().year(),
      this.filterModel.endDate.clone().month()
    );
    this.visualizationResourceService.getArtOverviewReport({
      endDate: this.filterModel.endDate.endOf('month').format(),
      gender: 'M,F',
      indicators: '',
      groupBy: '',
      locationUuids: this.locationUuid,
      order: 'encounter_datetime|asc',
      report: 'clinical-art-overview',
      startDate: this.filterModel.startDate.startOf('month').format()
    }).subscribe((report) => {
      _.merge(_options,
        { data: report.result },
        { indicatorDefinitions: report.indicatorDefinitions });
      this.artChartOptions = _options;
      this.loadingArt = false;
    });

  }

  generateHIVCareComparativeOverviewChart() {
    this.loadingHivCare = true;
    let _options = {};
    let subtitle = '';
    if (this.filterModel.startDate) {
      subtitle = 'Starting from ' + this.filterModel.startDate.format('DD/MM/YYYY');
    }

    if (this.filterModel.endDate) {
      subtitle = subtitle + ' To ' + this.filterModel.endDate.format('DD/MM/YYYY');
    }

    if (subtitle.length > 0) {
      _.merge(_options, {
        title: {
          text: 'A comparative graph showing HIV Care analysis'
        },
        subtitle: {
          text: subtitle
        },
        locationUuid: this.locationUuid,
        filters: this.filterModel
      });
    }

    this.visualizationResourceService.getHivComparativeOverviewReport({
      endDate: this.filterModel.endDate.format(),
      gender: 'M,F',
      indicators: '',
      groupBy: 'groupByEndDate',
      locationUuids: this.locationUuid,
      order: 'encounter_datetime|asc',
      report: 'clinical-hiv-comparative-overview-report',
      startDate: this.filterModel.startDate.format()
    }).subscribe((report) => {
      _.merge(_options,
        { data: report.result },
        { indicatorDefinitions: report.indicatorDefinitions });
      this.hivComparativeChartOptions = _options;
      this.loadingHivCare = false;
    });
  }
}
