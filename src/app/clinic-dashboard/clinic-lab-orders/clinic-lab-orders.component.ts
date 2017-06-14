import { Component, OnInit, Input } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { ClinicLabOrdersResourceService } from '../../etl-api/clinic-lab-orders-resource.service';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'clinic-lab-orders',
  templateUrl: './clinic-lab-orders.component.html',
  styleUrls: []
})
export class ClinicLabOrdersComponent implements OnInit {
  response: Subscription = new Subscription();
  location: string = '';
  public gridOptions: GridOptions;
  results = [];
  @Input() selectedDate: any;
  errors: any = [];
  private _datePipe: DatePipe;

  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private clinicLabOrdersResourceService: ClinicLabOrdersResourceService,
              private router: Router,
              private route: ActivatedRoute) {
    this.gridOptions = <GridOptions>{};
    this._datePipe = new DatePipe('en-US');
  }

  ngOnInit() {
    let cachedParam = this.getClinicOrderParam('clinicordersparam');
    if (cachedParam !== undefined) {
      this.selectedDate = this._datePipe.transform(
        cachedParam.selectedDate, 'yyyy-MM-dd');
      this.location = cachedParam.selectedLocation;
    } else {
      this.selectedDate = this._datePipe.transform(
        new Date(), 'yyyy-MM-dd');
    }

    this.getCurrentLocation();
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.gridOptions.rowData = this.results;
    this.gridOptions.getRowStyle = function (params) {
      return {
        'font-size': '14px',
        'cursor': 'pointer'
      };
    };
    this.gridOptions.getRowHeight = function (params) {
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
  }

  ngOnDestroy(): void {
    this.response.unsubscribe();
  }

  public getClinicLabOrders(location, selectDate) {
    this.response = this.clinicLabOrdersResourceService.getClinicLabOrders({
      dateActivated: selectDate,
      locationUuids: location
    }).subscribe((results) => {
        this.results = this.formatDateField(results);
      },
      (error) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching clinic lab orders'
        });
        console.log('error', error);
      });
  }

  public getCurrentLocation() {
    this.route.parent.params.subscribe(params => {
      this.location = params['location_uuid'];
      console.log(' this.location', this.location);
      this.setClinicOrderParam(this.location, this.selectedDate);
      this.getClinicLabOrders(this.location, this.selectedDate);
    });
  }

  public onRowClicked(event) {
    this.router.navigate(['/patient-dashboard/' + event.data.patient_uuid +
    '/general/landing-page']);
  }

  public navigateDay(value) {
    if (value) {
      let m = Moment(new Date(this.selectedDate));
      let revisedDate = m.add(value, 'd');
      this.selectedDate = this._datePipe.transform(
        revisedDate, 'yyyy-MM-dd');
    }
    this.setClinicOrderParam(this.location, this.selectedDate);
    this.getClinicLabOrders(this.location, this.selectedDate);
  }

  public dateChanged(selectedDate) {
    this.setClinicOrderParam(this.location, selectedDate);
    this.getClinicLabOrders(this.location, selectedDate);
  }

  private formatDateField(result) {
    let orders = [];
    for (let i = 0; i < result.length; ++i) {
      let data = result[i];
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
          let dateActivated = Moment(data.date_activated).format('DD-MM-YYYY');
          data['DateActivated'] = dateActivated;
          data['#'] = i + 1;
        }
      }
      orders.push(data);
    }
    return orders;

  }

  private setClinicOrderParam(selectedLocation, selectedDate) {
    this.clinicDashboardCacheService.add('clinicordersparam', {
      selectedLocation: selectedLocation,
      selectedDate: selectedDate
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
      {
        headerName: 'Location',
        field: 'location',
        width: 90,
        cellStyle: {
          'white-space': 'normal'
        },
        pinned: true,
        filter: 'text'
      },
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
        field: 'order_no',
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
      }
    ];
  }

}
