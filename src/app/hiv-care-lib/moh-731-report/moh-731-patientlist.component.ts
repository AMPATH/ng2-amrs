import { take } from 'rxjs/operators';
import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChange,
  EventEmitter
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Moh731PatientListResourceService } from '../../etl-api/moh-731-patientlist-resource.service';

/** Patients per page: small, so the progress bar moves steadily. */
const PAGE_SIZE = 300;
/** Pages fetched at the same time. */
const CONCURRENT_PAGES = 4;

@Component({
  selector: 'moh-731-patientlist',
  templateUrl: 'moh-731-patientlist.component.html',
  styleUrls: ['moh-731-patientlist.component.css']
})
export class Moh731PatientListComponent
  implements OnInit, OnChanges, OnDestroy {
  /** Patients per page for this list. */
  public pageSize = PAGE_SIZE;
  /** Identifies the current load, so a superseded one stops quietly. */
  private runId = 0;

  /** The figure the list was opened from, when known. */
  public expectedTotal: number = null;

  /** How far the list has got, for the progress bar. */
  public get loadedPercent(): number {
    if (!this.expectedTotal) {
      return null;
    }
    const loaded = this.patientListPerIndicator
      ? this.patientListPerIndicator.length
      : 0;
    return Math.min(100, Math.round((loaded / this.expectedTotal) * 100));
  }

  public patientList: Array<any> = [];
  public patientListPerIndicator: Array<any> = [];
  public dataSource: any;
  public hasError = false;
  public overrideColumns: Array<any> = [];
  public extraColumns: Array<any> = [];
  public startIndex: Array<any> = [];
  public currentStartIndexPerIndicator: number;
  public isLoading = false;
  public hasLoadedAll = false;
  public dataLoadedPerIndicator = false;
  public dataLoaded: Array<any> = [];
  public params: any = {
    startDate: '',
    endDate: '',
    locations: '',
    indicators: '',
    isLegacy: ''
  };
  public _locations = '';
  public _indicator = '';
  public _startDate;
  public _endDate;
  public busyIndicator: any = {
    busy: false,
    message: ''
  };
  public errorObj = {
    error: false,
    message: ''
  };

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private moh731PatientListResourceService: Moh731PatientListResourceService
  ) {}

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // tslint:disable-next-line
    // for (let propName in changes) {
    //   let changedProp = changes[propName];
    //   if (!changedProp.isFirstChange()) {
    //     console.log('redrawing patient list');
    //     this.loadPatientList();
    //   }
    // }
  }

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.params = params;
          this.loadPatientList(this.params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  /** Leaving the page stops any pages still to be fetched. */
  public ngOnDestroy() {
    this.runId++;
  }

  /**
   * Loads the whole list. Up to CONCURRENT_PAGES pages of PAGE_SIZE are fetched
   * at once, one after another, until a page comes back short; rows are kept
   * in page order whatever order they arrive in.
   */
  public loadPatientList(params: any) {
    const runId = ++this.runId;
    this.isLoading = true;
    this.hasLoadedAll = false;
    this.hasError = false;
    this.patientListPerIndicator = [];
    this.expectedTotal =
      params.expected !== undefined &&
      params.expected !== '' &&
      !isNaN(+params.expected)
        ? +params.expected
        : null;
    this.pageSize = PAGE_SIZE;
    this.resetError();
    this.updateProgress();

    const isLegacy = params.isLegacy === true || params.isLegacy === 'true';
    const request = {
      indicator: params.indicators,
      isLegacy: isLegacy,
      limit: String(this.pageSize),
      startDate: moment(params.startDate).format('YYYY-MM-DD'),
      endDate: moment(params.endDate).endOf('day').format('YYYY-MM-DD'),
      reportName: isLegacy ? 'MOH-731-report' : 'MOH-731-report-2017',
      locationUuids: _.isArray(params.locations)
        ? params.locations.join(',')
        : params.locations
    };
    const pages = new Map<number, Array<any>>();
    let next = 0;
    let end: number = null;
    let failed = false;
    let described = false;

    const worker = async () => {
      while (runId === this.runId && !failed && end === null) {
        const start = next;
        next += this.pageSize;
        let data: any;
        try {
          data = await this.moh731PatientListResourceService
            .getMoh731PatientListReport(
              Object.assign({}, request, { startIndex: String(start) })
            )
            .pipe(take(1))
            .toPromise();
        } catch (err) {
          data = null;
        }
        if (runId !== this.runId) {
          return;
        }
        if (!data || data.errorMessage) {
          failed = true;
          this.hasError = !!(data && data.errorMessage);
          this.errorObj = {
            error: true,
            message:
              'An error occurred while trying to load the report.Please reload page'
          };
          return;
        }
        const page = data.result || [];
        pages.set(start, page);
        if (page.length < this.pageSize) {
          end = end === null ? start : Math.min(end, start);
        }
        if (!described) {
          described = true;
          this.describeList(data, params);
        }
        this.patientListPerIndicator = Array.from(pages.keys())
          .sort((a, b) => a - b)
          .filter((key) => end === null || key <= end)
          .reduce((rows, key) => rows.concat(pages.get(key)), []);
        this.updateProgress();
      }
    };

    const workers = [];
    for (let i = 0; i < CONCURRENT_PAGES; i++) {
      workers.push(worker());
    }
    Promise.all(workers).then(() => {
      if (runId !== this.runId) {
        return;
      }
      this.hasLoadedAll = !failed;
      this.patientList[params.indicators] = this.patientListPerIndicator;
      this.isLoading = false;
      this.busyIndicator = { busy: false, message: '' };
    });

    this.addOverrideColumns();
  }

  private addOverrideColumns() {
    if (this.overrideColumns.length > 0) {
      return;
    }
    this.overrideColumns.push({
      field: 'identifiers',
      onCellClicked: (column) => {
        this.goTopatientInfo(column.data.patient_uuid);
      },
      cellRenderer: (column) => {
        return (
          '<a href="javascript:void(0);" title="Identifiers">' +
          column.value +
          '</a>'
        );
      }
    });
  }

  private updateProgress() {
    const loaded = this.patientListPerIndicator
      ? this.patientListPerIndicator.length
      : 0;
    this.busyIndicator = {
      busy: true,
      message:
        loaded.toLocaleString() +
        (this.expectedTotal
          ? ' of ' + this.expectedTotal.toLocaleString()
          : '') +
        ' patients loaded'
    };
  }

  /** Heading, locations and columns, taken from the first page that arrives. */
  private describeList(data: any, params: any) {
    this._startDate = moment(params.startDate);
    this._endDate = moment(params.endDate);
    if (data.locations) {
      this._locations = _.map(data.locations, (location: any) => location.name)
        .filter((name: string) => !!name)
        .join(', ');
    }
    if (data.indicators) {
      this.searchIndicator(data.indicators, params.indicators).then(
        (matchingIndicator: Array<any>) => {
          if (matchingIndicator.length > 0) {
            this._indicator = matchingIndicator[0]['label'];
          }
        }
      );
    }
    if (this.extraColumns.length === 0) {
      this.addExtraColumns(data.indicators);
    }
  }

  public goTopatientInfo(patientUuid: string) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/landing-page'
    ]);
  }

  public addExtraColumns(indicators: Array<any>) {
    const extraColumns = {
      weight: 'Weight',
      height: 'Height',
      stage: 'WHO Stage',
      patient_categorization: 'Patient Categorization',
      service_delivery_model: 'Service Model',
      dsd_model: 'DSD Model',
      location: 'Location',
      cd4_1: 'CD4',
      cd4_date: 'CD4 Date',
      enrollment_date: 'Enrollment Date',
      arv_first_regimen_start_date: 'ARVs Initial Start Date',
      cur_regimen_arv_start_date: 'Current ARV Regimen Start Date (edited)',
      cur_arv_line: 'Current ARV Line (edited)',
      cur_arv_meds: 'Current ARV Regimen',
      has_pending_vl_test: 'Pending Viral Load Test',
      phone_number: 'Phone Number',
      last_appointment: 'Latest Appointment',
      patient_category: 'Patient Category',
      latest_rtc_date: 'Latest RTC Date',
      latest_vl: 'Latest VL',
      vl_category: 'VL Category',
      latest_vl_date: 'Latest VL Date',
      previous_vl: 'Previous VL',
      previous_vl_date: 'Previous VL Date',
      ipt_start_date: 'IPT Start Date',
      ipt_completion_date: 'IPT Completion Date',
      ipt_stop_date: 'IPT Stop Date',
      ovcid_id: 'OVCID',
      hiv_disclosure_status: 'Hiv Disclosure Status',
      discordant_status: 'Discordant Status',
      tb_screening_date: 'TB Screening Date',
      tb_screening_result: 'TB Screening Result',
      covid_19_vaccination_status: 'Covid-19 Assessment Status',
      cervical_screening_date: 'Cervical Screening Date',
      cervical_screening_method: 'Cervical Screening Method',
      cervical_screening_result: 'Cervical Screening Result',
      sms_consent_provided: 'SMS Consent Provided',
      sms_receive_time: 'SMS Time',
      nearest_center: 'Nearest Center'
    };

    // tslint:disable-next-line
    for (let indicator in extraColumns) {
      this.extraColumns.push({
        headerName: extraColumns[indicator],
        field: indicator
      });
    }

    /*_.each(extraColumns, (indicator) => {
      this.searchIndicator(indicators, indicator).then((matchingIndicator: Array<any>) => {
        if (matchingIndicator.length > 0) {
          this.extraColumns.push({
            headerName: matchingIndicator[0]['label'],
            field: indicator
          });
        }
      });
    });*/
  }

  public searchIndicator(indicators: Array<any>, trackedIndicator: string) {
    const matchingIndicator = _.filter(indicators, (_indicator) => {
      const search = _indicator['indicator'];
      return search && search.match(new RegExp(trackedIndicator));
    });
    return new Promise((resolve) => {
      resolve(matchingIndicator);
    });
  }

  public resetError() {
    this.errorObj = {
      error: false,
      message: ''
    };
  }
}
