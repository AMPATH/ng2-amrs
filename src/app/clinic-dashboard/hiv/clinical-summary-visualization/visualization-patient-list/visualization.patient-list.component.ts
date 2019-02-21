
import {take} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import {
  ClinicalSummaryVisualizationResourceService
} from '../../../../etl-api/clinical-summary-visualization-resource.service';
import {
  ClinicalSummaryVisualizationService
} from '../../../../hiv-care-lib/services/clinical-summary-visualization.service';

@Component({
  selector: 'visualization-patient-list',
  templateUrl: 'visualization-patientlist.component.html'
})
export class VisualizationPatientListComponent implements OnInit, OnDestroy {
  public patientData: any;
  public translatedIndicator: string;
  public overrideColumns: Array<any> = [];
  public isLoading = false;
  public dataLoaded = false;
  public startDate: any;
  public endDate: any;
  public isLoadingPatientList = false;
  private startIndex = 0;
  private locationUuid: any;
  private reportName: string;
  private currentIndicator: string;
  private routeSub = new Subscription();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private visualizationResourceService: ClinicalSummaryVisualizationResourceService,
              private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService) {
    /**
     * Please note that this is a workaround for the dashboardService delay
     * to give you the location UUID.
     * If a better way can be found, please consider
     */
    const urlPieces = window.location.hash.split('/');
    this.locationUuid = urlPieces[2];
  }

  public ngOnInit() {

    this.routeSub = this.route.params.subscribe((params) => {
      if (params) {
        const monthYear = params['period'].split('|');
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

  public ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  public setDateRange(monthYear) {
    const startDate = monthYear[0].split('/');
    const endDate = monthYear[1].split('/');
    this.startDate = moment([startDate[2], startDate[1] - 1, startDate[0]]);
    this.endDate = moment([endDate[2], endDate[1] - 1, endDate[0]]);
  }

  public loadPatientData(reportName: string) {
    this.isLoadingPatientList = true;
    this.visualizationResourceService.getReportOverviewPatientList(reportName, {
      endDate: this.endDate.endOf('month').format(),
      indicator: this.currentIndicator,
      locationUuids: this.locationUuid,
      startIndex: this.startIndex,
      startDate: this.startDate.format()
    }).pipe(take(1)).subscribe((report) => {
      this.patientData = this.patientData ? this.patientData.concat(report) : report;
      this.isLoading = false;
      this.isLoadingPatientList = false;
      this.startIndex += report.length;
      if (report.length < 300) {
        this.dataLoaded = true;
      }
    });
  }

  public loadMorePatients() {
    this.isLoading = true;
    this.isLoadingPatientList = true;
    this.loadPatientData(this.reportName);
  }

  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/general/general/landing-page']);
  }

}
