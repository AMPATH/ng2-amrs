import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-moh-412-report-view',
  templateUrl: './moh-412-report-view.component.html',
  styleUrls: ['./moh-412-report-view.component.css']
})
export class MOH412ReportViewComponent implements OnInit, OnChanges {
  public title = 'Cervical Cancer Screening Monthly Summary';
  @Input() public sectionDefs = [];
  public colHeaders = [];
  @Input() public reportData = [];
  @Input() public params: any;
  @Input() public totalsData: Array<any> = [];

  public sectionData = [];

  constructor(private router: Router, public route: ActivatedRoute) {}

  public ngOnInit() {}
  public ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.reportData) {
      if (simpleChanges.reportData.currentValue !== null) {
        const sectionDefs = simpleChanges.sectionDefs.currentValue;
        const reportData = simpleChanges.reportData.currentValue;
        const totalResultsData = simpleChanges.totalsData.currentValue[0]
          ? simpleChanges.totalsData.currentValue[0]
          : [];
        const reportAndTotalResults = [...reportData, totalResultsData];
        this.generateLocationsColumnHeader(reportAndTotalResults);
        this.addLocationDataToIndicatorSection(
          sectionDefs,
          reportAndTotalResults
        );
      }
    }
  }
  public generateLocationsColumnHeader(results: Array<any>): void {
    const colHeaders = results.map((r: any) => {
      return {
        location: r.location ? r.location : ''
      };
    });

    this.colHeaders = colHeaders;
  }
  public addLocationDataToIndicatorSection(
    sectionDef: any,
    results: any
  ): void {
    const sectionDefWithData = sectionDef.map((section: any) => {
      section.pageBody.map((pb: any) => {
        pb.sections.map((s: any) => {
          s.body.map((b: any) => {
            b.indicators.map((i: any) => {
              i['indicatorData'] = [];
              results.forEach((r: any) => {
                const indicatorData = {
                  location: r.location,
                  locationUuid: r.location_uuid,
                  count: r[i.indicator] ? r[i.indicator] : 0,
                  reportingMonth: r.reporting_month
                };
                i['indicatorData'].push(indicatorData);
              });
              return i;
            });
            return b;
          });
          return s;
        });
        return pb;
      });
      return section;
    });
    this.sectionData = sectionDefWithData;
  }

  public generateUrlParams(params: any, indicator: string) {
    return {
      startDate: this.params.startDate,
      endDate: this.params.endDate,
      locationUuids: params.locationUuid,
      locationType: this.params.locationType,
      indicators: indicator
    };
  }

  public navigateToPatientList(params: any, indicator: string) {
    const urlParams = this.generateUrlParams(params, indicator);
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: urlParams
    });
  }
}
