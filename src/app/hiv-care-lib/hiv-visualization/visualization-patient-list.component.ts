import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { ClinicalSummaryVisualizationResourceService } from '../../etl-api/clinical-summary-visualization-resource.service';
import { ClinicalSummaryVisualizationService } from '../services/clinical-summary-visualization.service';
import { DataAnalyticsDashboardService } from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';

@Component({
  selector: 'visualization-patient-list',
  templateUrl: 'visualization-patient-list.component.html'
})
export class VisualizationPatientListComponent implements OnInit, OnDestroy {
  public patientData: any;
  public startDate: any;
  public isLoading = false;
  public dataLoaded = false;
  public endDate: any;
  public translatedIndicator: string;
  public overrideColumns: Array<any> = [];
  private startIndex = 0;
  private locationUuids: any;
  private reportName: string;
  private currentIndicator: string;
  private routeParamsSubscription: Subscription;
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private visualizationResourceService: ClinicalSummaryVisualizationResourceService,
    private clinicalSummaryVisualizationService: ClinicalSummaryVisualizationService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService
  ) {
    /**
     * Please note that this is a workaround for the dashboardService delay
     * to give you the location UUID.
     * If a better way can be found, please consider
     */
    const urlPieces = window.location.hash.split('/');
    const loc = { value: urlPieces[2] };
    this.locationUuids = loc.value;
  }

  public ngOnInit() {
    this.getCachedLocations();
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      if (params) {
        const monthYear = params['period'].split('|');
        this.reportName = params['report'];
        this.currentIndicator = params['indicator'];
        this.translatedIndicator =
          this.clinicalSummaryVisualizationService.translateColumns[
            this.reportName
          ][this.currentIndicator];
        this.setDateRange(monthYear);
        this.overrideColumns.push({
          field: 'identifiers',
          onCellClicked: (column) => {
            this.redirectTopatientInfo(column.data.patient_uuid);
          },
          cellRenderer: (column) => {
            return (
              '<a href="javascript:void(0);" title="Identifiers">' +
              column.value +
              '</a>'
            );
          }
        });
        this.isLoading = true;
        this.loadPatientData(this.reportName);
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  public getCachedLocations() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .subscribe((data) => {
        if (data) {
          console.log('data---->>viz', data);
          this.locationUuids = this.getSelectedLocations(data.locations);
        }
      });
  }

  public setDateRange(monthYear) {
    const startDate = monthYear[0].split('/');
    const endDate = monthYear[1].split('/');
    this.startDate = moment([startDate[2], startDate[1] - 1, startDate[0]]);
    this.endDate = moment([endDate[2], endDate[1] - 1, endDate[0]]);
  }

  public loadPatientData(reportName: string) {
    this.visualizationResourceService
      .getReportOverviewPatientList(reportName, {
        endDate: this.endDate.endOf('month').format(),
        indicator: this.currentIndicator,
        locationUuids: this.locationUuids,
        startIndex: this.startIndex,
        startDate: this.startDate.format()
      })
      .pipe(take(1))
      .subscribe((report) => {
        this.patientData = this.patientData
          ? this.patientData.concat(report)
          : report;
        this.isLoading = false;
        this.startIndex += report.length;
        if (report.length < 300) {
          this.dataLoaded = true;
        }
      });
  }

  public loadMorePatients() {
    this.isLoading = true;
    this.loadPatientData(this.reportName);
  }

  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/landing-page'
    ]);
  }
  private getSelectedLocations(locationUuids: Array<string>): string {
    if (!locationUuids || locationUuids.length === 0) {
      return '';
    }

    let selectedLocations = '';

    for (let i = 0; i < locationUuids.length; i++) {
      if (i === 0) {
        selectedLocations = selectedLocations + (locationUuids[0] as any).value;
      } else {
        selectedLocations =
          selectedLocations + ',' + (locationUuids[i] as any).value;
      }
    }
    return selectedLocations;
  }
}
