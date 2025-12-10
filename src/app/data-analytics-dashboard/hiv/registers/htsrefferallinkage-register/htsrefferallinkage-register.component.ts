import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { zhCnLocale } from 'ngx-bootstrap';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';
// import { HtsrefferallinkageRegisterService } from './htsrefferallinkage-register.service';
import { HtsReferralLinkageService } from 'src/app/etl-api/hts-refferal-linkage.service';

@Component({
  selector: 'app-htsrefferallinkage-register',
  templateUrl: './htsrefferallinkage-register.component.html',
  styleUrls: ['./htsrefferallinkage-register.component.css']
})
export class HtsrefferallinkageRegisterComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public htsLabData: any;
  public htsLinkageData: any;
  public columnDefs: any = [];
  public reportName = 'HTS Lab Refferal & Linkage Register';
  public currentView = 'monthly';
  public currentViewBelow = 'pdf';
  public month: string;
  public year: number;
  public quarter: string;
  public eDate: string;
  public sDate: string;
  public jointLocationUuids: string;

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;
  // public enabledControls = 'locationControl,monthControl';
  public enabledControls = 'datesControl, locationControl';
  public pinnedBottomRowData: any = [];
  public _month: string;
  public isReleased = true;

  public _locationUuids: any = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }

  private _startDate: Date = Moment().toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = new Date();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private htsService: HtsReferralLinkageService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService
  ) {
    this.route.queryParams.subscribe((data) => {
      data.month === undefined
        ? (this._month = Moment()
            .subtract(1, 'M')
            .endOf('month')
            .format('YYYY-MM-DD'))
        : (this._month = data.month);

      this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {}

  public onMonthChange(value): any {
    this._month = Moment(value).endOf('month').format('YYYY-MM-DD');
  }

  public storeParamsInUrl() {
    this.params = {
      locationUuids: this.jointLocationUuids,
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public generateReport(): any {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .subscribe((data) => {
        const locationValues = data.locations.map(
          (location) => `'${location.value}'`
        );
        this.jointLocationUuids = locationValues.join(', ');
      });

    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl();
    });
    this.htsLabData = [];
    this.htsLinkageData = [];
    this.getHtsReferralLinkageReport(this.params);
    // this.generated = true;
  }

  public getHtsReferralLinkageReport(params: any) {
    this.isLoading = true;
    this.htsService.getHtsReferralLinkageReport(params).subscribe(
      (data) => {
        if (data.error) {
          this.showInfoMessage = true;
          this.errorMessage = `There has been an error while loading the report, please retry again`;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.showInfoMessage = false;
          const transformedData = this.transformApiData(data);
          this.htsLabData = transformedData.htsLabData || [];
          this.htsLinkageData = transformedData.htsLinkageData || [];
          this.pinnedBottomRowData = transformedData.pinnedBottomRowData || [];
          this.calculateTotalSummary();
          this.isLoading = false;
          this.showDraftReportAlert(this._month);
        }
      },
      (error) => {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      }
    );
  }

  public transformApiData(apiData: any[]) {
    return {
      htsLabData: apiData.map((item) => ({
        serialNumber: item.serial_number || '',
        amrsID: item.amrsID || '',
        nupiNumber: item.nupi || '',
        nationalId: item.id_number || '',
        visitDate: item.date_of_visit
          ? new Date(item.date_of_visit).toISOString().split('T')[0]
          : '',
        clientName: `${item.first_name || ''} ${item.middle_name || ''} ${
          item.last_name || ''
        }`.trim(),
        age: item.age || '',
        sex: item.sex || '',
        telephoneNumber: item.telephone || '',
        maritalStatus: item.marital_status || '',
        populationType: item.population_type || '',
        subPopulation: item.sub_population || '',
        setting: item.setting || '',
        hivTest1: {
          kitName: item.kit1_name || '',
          lotNumber: item.lot1 || '',
          expiryDate: item.expiry1
            ? new Date(item.expiry1).toISOString().split('T')[0]
            : '',
          result: item.hiv_test1 || ''
        },
        hivTest2: {
          kitName: item.kit2_name || '',
          lotNumber: item.lot2 || '',
          expiryDate: item.expiry2
            ? new Date(item.expiry2).toISOString().split('T')[0]
            : '',
          result: item.hiv_test2 || ''
        },
        hivTest3: {
          kitName: item.kit3_name || '',
          lotNumber: item.lot3 || '',
          expiryDate: item.expiry3
            ? new Date(item.expiry3).toISOString().split('T')[0]
            : '',
          result: item.hiv_test3 || ''
        },
        finalHivResult: item.final_result || '',
        discordantCouple: '', // Not available in API data
        referredForPrevention: item.referral_services || '',
        htsProvider: item.hts_provider || '',
        remarks: item.initial_remarks || ''
      })),
      htsLinkageData: apiData.map((item) => ({
        serialNumber: item.serial_number || '',
        amrsID: item.amrsID || '',
        nupiNumber: item.nupi || '',
        nationalId: item.id_number || '',
        clientName: `${item.first_name || ''} ${item.middle_name || ''} ${
          item.last_name || ''
        }`.trim(),
        telephoneNumber: item.telephone || '',
        residence: '', // Not available in API data
        identificationStrategy: item.client_tested_as || '',
        patientReferredTo: item.referral_to || '',
        handedOverTo: item.handed_to || '',
        cadre: '', // Not available in API data
        artStartDate: item.art_start_date
          ? new Date(item.art_start_date).toISOString().split('T')[0]
          : '',
        cccNumber: item.ccc_number || '',
        remarks: item.screening_remarks || ''
      })),
      pinnedBottomRowData: [
        {
          totalLinked: apiData.filter((item) => item.art_start_date).length
        }
      ]
    };
  }

  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.htsLinkageData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.htsLinkageData, (row) => {
        Object.keys(row).map((key) => {
          if (Number.isInteger(row[key]) === true) {
            if (totalObj[key]) {
              totalObj[key] = row[key] + totalObj[key];
            } else {
              totalObj[key] = row[key];
            }
          } else {
            if (Number.isNaN(totalObj[key])) {
              totalObj[key] = 0;
            }
            if (totalObj[key] === null) {
              totalObj[key] = 0;
            }
            totalObj[key] = 0 + totalObj[key];
          }
        });
      });
      totalObj.location = 'Totals';
      totalsRow.push(totalObj);
      this.pinnedBottomRowData = totalsRow;
    }
  }

  public onIndicatorSelected(value) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: value.field,
        indicatorHeader: value.headerName,
        indicatorGender: value.gender,
        month: this._month,
        locationUuids: value.location,
        currentView: this.currentView
      }
    });
  }

  public showDraftReportAlert(date) {
    if (date != null && date >= Moment().endOf('month').format('YYYY-MM-DD')) {
      this.isReleased = false;
    } else {
      this.isReleased = true;
    }
  }
  getTotal(summaryData: any[], gender: string) {
    return summaryData.filter((data) => data['sex'] === gender).length || '';
  }
  getMaleAndFemaleTotal(summaryData: any[], minAge: number, maxAge?: number) {
    return (
      summaryData.filter(
        (data) =>
          data['age'] >= minAge &&
          (maxAge === undefined || data['age'] <= maxAge)
      ).length || ''
    );
  }
  getPositiveMaleAndFemaleTotalWithAge(
    summaryData: any[],
    minAge: number,
    maxAge?: number
  ) {
    return (
      summaryData.filter(
        (data) =>
          data['final_result'] === 'P' &&
          data['age'] >= minAge &&
          (maxAge === undefined || data['age'] <= maxAge)
      ).length || ''
    );
  }
  getPositiveTotal(summaryData: any[]) {
    return (
      summaryData.filter((data) => data['final_result'] === 'P').length || ''
    );
  }
  getTotals(
    summaryData: any[],
    gender: string,
    minAge: number,
    maxAge?: number
  ) {
    return (
      summaryData.filter(
        (data) =>
          data['age'] >= minAge &&
          (maxAge === undefined || data['age'] <= maxAge) &&
          data['sex'] === gender
      ).length || ''
    );
  }
  getParameterTotalsWithAge(
    summaryData: any[],
    parameter: string,
    parameterValue: string,
    gender: string,
    minAge: number,
    maxAge?: number
  ) {
    return (
      summaryData.filter(
        (data) =>
          data['age'] >= minAge &&
          data[parameter] === parameterValue &&
          data['sex'] === gender &&
          (maxAge === undefined || data['age'] <= maxAge)
      ).length || ''
    );
  }

  getParameterTotals(
    summaryData: any[],
    parameter: string,
    parameterValue: string,
    gender?: string
  ) {
    return (
      summaryData.filter(
        (data) =>
          data[parameter] === parameterValue &&
          (gender === undefined || data['sex'] === gender)
      ).length || ''
    );
  }

  getHivTestTypesAndTotals(
    summaryData: any[],
    testType: string,
    value: string
  ) {
    return (
      summaryData.filter(
        (data) => data[testType] && data[testType]['result'] === value
      ).length || ''
    );
  }
}
