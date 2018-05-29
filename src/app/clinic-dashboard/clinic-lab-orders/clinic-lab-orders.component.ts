import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { ClinicLabOrdersResourceService } from '../../etl-api/clinic-lab-orders-resource.service';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
@Component({
  selector: 'clinic-lab-orders',
  templateUrl: './clinic-lab-orders.component.html',
  styleUrls: []
})
export class ClinicLabOrdersComponent implements OnInit, OnDestroy {
  public location: string = '';
  public gridOptions: GridOptions;
  public selectedVisitType: any;
  public results = [];
  public totalOrderds: any;
  public totalSampleCollected: any;
  public orders: any;
  public totalSampleNotCollected: any;
  public startDate: any;
  public endDate: any;
  public isLoadingReport: boolean = false;
  public totalCounts: any;
  @Input() public selectedDate: any;
  public errors: any = [];
  private response: Subscription = new Subscription();
  private _datePipe: DatePipe;

  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private clinicLabOrdersResourceService: ClinicLabOrdersResourceService,
              private router: Router,
              private route: ActivatedRoute) {
    this.gridOptions = {} as GridOptions;
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {


    let cachedParam = this.getClinicOrderParam('clinicordersparam');
    if (cachedParam !== undefined) {
      this.selectedDate = this._datePipe.transform(
        cachedParam.selectedDate, 'yyyy-MM-dd');
      this.location = cachedParam.selectedLocation;
      this.startDate = this._datePipe.transform(
        cachedParam.startDate, 'yyyy-MM-dd');
      this.endDate = this._datePipe.transform(
        cachedParam.endDate, 'yyyy-MM-dd');
      this.onClickedGenerate();
    } else {
      this.selectedDate = this._datePipe.transform(
        new Date(), 'yyyy-MM-dd');
      this.startDate = this._datePipe.transform(
        new Date(), 'yyyy-MM-dd');
      this.endDate = this._datePipe.transform(
        new Date(), 'yyyy-MM-dd');
    }

    this.getCurrentLocation();
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.gridOptions.rowData = this.results;
    this.gridOptions.getRowStyle = (params) => {
      return {
        'font-size': '14px',
        'cursor': 'pointer'
      };
    };
    this.gridOptions.getRowHeight = (params) => {
      return 20 * ((Math.floor(params.data.identifiers.length / 15) + 1) &&
        (Math.floor(params.data.person_name.length / 15) + 1));
    };
    this.gridOptions.headerHeight = 40;
    if (window.innerWidth > 768) {
      this.gridOptions.onGridReady = (event) => {
        this.gridOptions.api.sizeColumnsToFit();
      };
    }
    this.gridOptions.enableFilter = true;
    this.gridOptions.localeText = {noRowsToShow: 'No matching records found'};
     // ensure that even after sorting the rows maintain order
    this.gridOptions.onSortChanged = () => {
        this.gridOptions.api.forEachNode((node) => {
           node.setDataValue('#', node.rowIndex + 1);
        });

        this.gridOptions.api.refreshCells();

    };
  }

  public ngOnDestroy(): void {
    this.response.unsubscribe();
  }

  public onClickedGenerate() {
    this.isLoadingReport = true;
    this.response = this.clinicLabOrdersResourceService.getClinicLabOrders({
      locationUuids: this.location,
      startDate: this.startDate,
      endDate: this.endDate

    }).subscribe((results) => {
        if (results) {
          this.orders = results;
          this.selectedVisitType = 'Total Ordered';
          this.totalSampleCollectedFilter( this.orders);
          this.totalSampleNotCollectedFilter( this.orders);
          this.results = this.formatDateField(results);
          this.totalOrderds = this.results.length;
          this.totalCounts = this.totalOrderds;
        }
        this.isLoadingReport = false;

      },
      (error) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching clinic lab orders'
        });
        console.error('error', error);
      });
  }

  public getCurrentLocation() {
    this.route.parent.params.subscribe((params) => {
      this.location = params['location_uuid'];
      this.setClinicOrderParam(this.location, this.selectedDate, this.startDate, this.endDate);
    });
  }

  public onRowClicked(event) {
    this.router.navigate(['/patient-dashboard/patient/' + event.data.patient_uuid +
    '/general/general/landing-page']);
  }

  public startDateChanged(startDate) {
    this.setClinicOrderParam(this.location, '', startDate, this.endDate);
  }
  public endDateChanged(endDate) {
    this.setClinicOrderParam(this.location, '', this.startDate, endDate);
  }

  public exportAllData() {
     this.gridOptions.api.exportDataAsCsv();
  }
  public allTestOrdered() {
    this.selectedVisitType = 'Total Ordered';
    this.onClickedGenerate();
    this.totalCounts = this.totalOrderds;
  }
  public sampleCollected() {
    this.selectedVisitType = 'Total Sample Collected';
    let sampleCollected = this.totalSampleCollectedFilter( this.orders);
    this.results  = sampleCollected;

  }
  public sampleNotCollected() {
    this.selectedVisitType = 'Total Sample NOT Collected';
    let notCollected = this.totalSampleNotCollectedFilter( this.orders);
    this.results  = notCollected;

  }

  private formatDateField(result) {
    let orders = [];
    for (let i = 0; i < result.length; ++i) {
      let data = result[i];
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
          let dateActivated = Moment(data.date_activated).format('DD-MM-YYYY');
          data['DateActivated'] = dateActivated;
          data['sampleCollectionDate'] = Moment(data.sample_collection_date).format('DD-MM-YYYY');

          data['#'] = i + 1;
        }
      }
      orders.push(data);
    }
    return orders;

  }

  private setClinicOrderParam(selectedLocation, selectedDate, startDate, endDate) {
    this.clinicDashboardCacheService.add('clinicordersparam', {
      selectedLocation: selectedLocation,
      selectedDate: selectedDate,
      startDate: startDate,
      endDate: endDate
    });
  }

  private getClinicOrderParam(key) {
    return this.clinicDashboardCacheService.getByKey(key);
  }

  private createColumnDefs() {
    return [
      {
        headerName: '#',
        field: '#',
        width: 60,
        pinned: true
      },
      /*{
        headerName: 'Location',
        field: 'location_name',
        width: 90,
        cellStyle: {
          'white-space': 'normal'
        },
        pinned: true,
        filter: 'text'
      },*/
      {
        headerName: 'Identifiers',
        field: 'identifiers',
        width: 150,
        cellStyle: {
          'white-space': 'normal'
        },
        filter: 'text'
      },
      {
        headerName: 'Person Name',
        field: 'person_name',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        },
        filter: 'text'
      },
      {
        headerName: 'Order No',
        field: 'orderNumber',
        width: 90,
        filter: 'text'
      },
      {
        headerName: 'Order Type',
        field: 'order_type',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        },
        filter: 'text'
      },
      {
        headerName: 'Date Ordered',
        field: 'DateActivated',
        width: 120
      },
      {
        headerName: 'Sample Collected',
        field: 'sample_drawn',
        cellStyle: (params) => {
          if (params.data.sample_drawn === 'NO') {
            return {color: 'red'};
          } else {
            return null;
          }
        },
        width: 120
      },
      {
        headerName: 'Date Sample Collected',
        field: 'sampleCollectionDate',
        cellRenderer: (params) => {
          if (params.data.sample_drawn === null || params.data.sample_drawn === 'NO') {
              return ' ';
          }
          return params.value;
        },
        width: 120
      }
    ];
  }
  private totalSampleCollectedFilter(result) {

    let res = _.filter(result, ['sample_drawn', 'YES']);
    let numbers = [];
    for (let i = 0; i < res.length; ++i) {
      let data = res[i];
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
          data['#'] = i + 1;
        }
      }
      numbers.push(data);
    }
    this.totalSampleCollected = numbers.length;
    this.totalCounts = this.totalSampleCollected;
    return numbers;

  }
  private totalSampleNotCollectedFilter(result) {
    let resNull = _.filter(result, ['sample_drawn', null]);
    let resNo = _.filter(result, ['sample_drawn', 'NO']);
    let res = _.concat(resNull, resNo);
    let numbers = [];
    for (let i = 0; i < res.length; ++i) {
      let data = res[i];
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
          data['#'] = i + 1;
        }
      }
      numbers.push(data);
    }
    this.totalSampleNotCollected = numbers.length;
    this.totalCounts = this.totalSampleNotCollected;

    return numbers;

  }


}
