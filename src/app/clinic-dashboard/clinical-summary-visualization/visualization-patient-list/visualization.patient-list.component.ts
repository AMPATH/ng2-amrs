import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../../etl-api/clinical-summary-visualization-resource.service';
import { ClinicalSummaryVisualizationService
} from '../../services/clinical-summary-visualization.service';

@Component({
  selector: 'visualization-patient-list',
  templateUrl: 'visualization-patientlist.component.html'
})
export class VisualizationPatientListComponent implements OnInit {
  patientData: any;
  startDate: any;
  endDate: any;
  startIndex: number = 0;
  locationUuid: any;
  reportName: string;
  isLoading: boolean = false;
  dataLoaded: boolean = false;
  isLoadingPatientList: boolean = false;
  currentIndicator: string;
  translatedIndicator: string;
  overrideColumns: Array<any> = [];
  routeParamsSubscription: Subscription;
  private subscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private visualizationResourceService: ClinicalSummaryVisualizationResourceService,
              private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService) {
    /**
     * Please note that this is a workaround for the dashboardService delay
     * to give you the location UUID.
     * If a better way can be found, please consider
     */
    let urlPieces = window.location.hash.split('/');
    this.locationUuid = urlPieces[2];
  }

  ngOnInit() {

    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      if (params) {
        let monthYear = params['period'].split('|');
        this.reportName = params['report'];
        this.currentIndicator = params['indicator'];
        this.translatedIndicator =
          this.clinicalSummaryVisualizationService
            .translateColumns[this.reportName][this.currentIndicator];
        this.setDateRange(monthYear);
        this.overrideColumns.push({
          field: 'identifiers',
          onCellClicked: (column) => {
            this.redirectTopatientInfo(column.data.patient_uuid);
          },
          cellRenderer: (column) => {
            return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
          }
        });

        this.loadPatientData(this.reportName);
      }

    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setDateRange(monthYear) {
    let startDate = monthYear[0].split('/');
    let endDate = monthYear[1].split('/');
    this.startDate = moment([startDate[2], startDate[1] - 1, startDate[0]]);
    this.endDate = moment([endDate[2], endDate[1] - 1, endDate[0]]);
  }

  loadPatientData(reportName: string) {
    this.isLoadingPatientList = true;
    this.subscription = this.visualizationResourceService.getReportOverviewPatientList(reportName, {
      endDate: this.endDate.endOf('month').format(),
      indicator: this.currentIndicator,
      locationUuids: this.locationUuid,
      startIndex: this.startIndex,
      startDate: this.startDate.format()
    }).subscribe((report) => {
      this.patientData = this.patientData ? this.patientData.concat(report) : report;
      this.isLoading = false;
      this.isLoadingPatientList = false;
      this.startIndex += report.length;
      if (report.length < 300) {
        this.dataLoaded = true;
      }
    });
  }

  loadMorePatients() {
    this.isLoading = true;
    this.isLoadingPatientList = true;
    this.loadPatientData(this.reportName);
  }

  redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/' + patientUuid + '/general/landing-page']);
  }

}
