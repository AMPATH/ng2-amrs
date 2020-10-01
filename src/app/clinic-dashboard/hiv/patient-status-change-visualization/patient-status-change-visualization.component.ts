import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { PatientStatuChangeVisualizationService } from './patient-status-change-visualization.service';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { AgGridNg2 } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import * as moment from 'moment/moment';

@Component({
  selector: 'patient-status-change-visualization',
  templateUrl: './patient-status-change-visualization.component.html',
  providers: [PatientStatuChangeVisualizationService],
  styleUrls: ['./patient-status-change-visualization.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientStatusChangeVisualizationComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {
  @Input()
  public renderType: string;
  @Input()
  public showAnalysisTypeSelector = false;
  @Input()
  public data: Array<any> = [];
  @Input()
  public indicatorDefinitions: Array<any> = [];
  public dataTable: Array<any> = [];
  public chartOptions: any;
  public columns: Array<any> = [];
  public analysisTypes: Array<any> = [];
  public selectedAnalysisType: string = null;
  public gridOptions: GridOptions;
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  @Output() public filterModelChange = new EventEmitter<any>();

  public filterModel: any;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public options: any = {
    date_range: true
  };
  public showIndicatorDefinitions = false;
  public showTable = true;
  public error = false;
  public loading;
  public progressBarTick = 30;
  public timerSubscription: Subscription;

  constructor(
    private patientStatusService: PatientStatuChangeVisualizationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.analysisTypes = this.patientStatusService.indicatorsKeys;
    this.selectedAnalysisType = this.analysisTypes[0].value;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.renderView();
    }
  }

  public ngOnInit() {
    this.loading = false;
    this.initRoutesParam();
  }

  public ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  public ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  public ngAfterViewInit() {
    this.renderView();
  }

  public onAnalysisTypeChange($event) {
    if ($event) {
      this.selectedAnalysisType = $event;
      const path = this.router.parseUrl(this.location.path());
      path.queryParams['analysis'] = $event;
      this.location.replaceState(path.toString());
      this.renderView();
    }
  }

  public onFilterModelChange(event) {
    const params = {};
    params['startDate'] = event.startDate.format('YYYY-MM-DD');
    params['endDate'] = event.endDate.format('YYYY-MM-DD');
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = params;
    this.location.replaceState(path.toString());
    this.filterModelChange.emit(event);
  }

  public renderChart(): void {
    this.chartOptions = {};
    const immutableData = [...this.data]; // making sure it is immutable
    const data = this.patientStatusService.processData(
      this.selectedAnalysisType,
      immutableData,
      this.renderType,
      true
    );
    this.chartOptions = this.patientStatusService.generateChart({
      renderType: this.renderType,
      data: data,
      analysisType: this.selectedAnalysisType
    });
  }

  public renderDataTable(): void {
    const immutableData = [...this.data]; // making sure it is immutable
    this.dataTable = this.patientStatusService.processData(
      this.selectedAnalysisType,
      immutableData,
      this.renderType,
      false
    );
    const indicatorDefinitions = _.keyBy(this.indicatorDefinitions, 'name');
    this.columns = this.patientStatusService.generateColumnDefinitions(
      this.renderType,
      this.selectedAnalysisType,
      indicatorDefinitions
    );
    this.gridOptions = {} as GridOptions;
    this.gridOptions.columnDefs = this.columns;

    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(this.columns);
    }
    this.gridOptions.onGridReady = (event) => {
      this.gridOptions.enableColResize = true;
      this.gridOptions.enableSorting = true;
      this.gridOptions.enableFilter = true;
      this.gridOptions.showToolPanel = false;
      this.gridOptions.getRowStyle = (params) => {
        return { 'font-size': '14px', cursor: 'pointer' };
      };
      setTimeout(
        () => {
          if (this.gridOptions.api) {
            this.gridOptions.api.sizeColumnsToFit();
          }
        },
        500,
        true
      );
      // setTimeout( () => this.gridOptions.api.sizeColumnsToFit(), 500, true);
    };
  }

  public renderView(): void {
    this.renderChart();
    this.renderDataTable();
  }

  public initRoutesParam(): void {
    const path = this.router.parseUrl(this.location.path());
    // init analysis
    if (path.queryParams['analysis']) {
      this.selectedAnalysisType = path.queryParams['analysis'];
    } else {
      this.selectedAnalysisType = 'active_return';
      path.queryParams['analysis'] = this.selectedAnalysisType;
    }
    // init startDate
    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    } else {
      this.startDate = this.getStartDate();
      path.queryParams['startDate'] = moment(this.startDate).format(
        'YYYY-MM-DD'
      );
    }
    // init endDate
    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    } else {
      this.endDate = this.getEndDate();
      path.queryParams['endDate'] = moment(this.endDate).format('YYYY-MM-DD');
    }
    this.location.replaceState(path.toString());
  }

  public triggerBusyIndicators(
    interval: number,
    show: boolean,
    hasError: boolean = false
  ): void {
    if (show) {
      this.loading = true;
      this.error = false;
      this.progressBarTick = 30;
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.timerSubscription = TimerObservable.create(
        2000 * interval,
        1000 * interval
      ).subscribe((t) => {
        if (this.progressBarTick > 100) {
          this.progressBarTick = 30;
        }
        this.progressBarTick++;
      });
    } else {
      this.error = hasError;
      this.progressBarTick = 100;
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.loading = false;
    }
  }

  private getStartDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const c = new Date(year, month - 5, 0);
    return c;
  }

  private getEndDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const c = new Date(year, month - 1, 0);
    return c;
  }
}
