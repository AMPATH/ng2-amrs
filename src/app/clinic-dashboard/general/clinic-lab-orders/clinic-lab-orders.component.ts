import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { ClinicLabOrdersResourceService
} from '../../../etl-api/clinic-lab-orders-resource.service';
import { MdDatepickerModule } from '@angular/material';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
const pdf = require('pdfmake/build/pdfmake.js');
require('pdfmake/build/vfs_fonts.js');
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
  private locationName: string = '';

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
    this.route.parent.parent.params.subscribe((params) => {
      this.location = params['location_uuid'];
      this.setClinicOrderParam(this.location, this.selectedDate, this.startDate, this.endDate);
    });
  }
  public startDateChanged(startDate) {
    this.setClinicOrderParam(this.location, '', startDate, this.endDate);
  }

  public endDateChanged(endDate) {
    this.setClinicOrderParam(this.location, '', this.startDate, endDate);
  }

  public onRowClicked(event) {
    this.router.navigate(['/patient-dashboard/patient/' + event.data.patient_uuid +
    '/general/general/landing-page']);
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

  public downloadPdf(): void {

    let fdata =   [
         {text: '#', style: 'tableHeader'},
         {text: 'Identifiers', style: 'tableHeader'},
         {text: 'Person Name', style: 'tableHeader'},
         {text: 'Order No', style: 'tableHeader'},
         {text: 'Order Type', style: 'tableHeader'},
         {text: 'Date Ordered', style: 'tableHeader'},
         {text: 'Sample Collected', style: 'tableHeader'},
         {text: 'Date Sample Collected', style: 'tableHeader'}
        ];

    let data = this.getRptBodyData(fdata);
    let docDefinition = {
      header: (page, pages) => {
        return {
          text: ' Page ' + page + ' of ' + pages,
          alignment: 'right',
          style: 'reportPage'
        };
      },
      footer:  (page, pages) => {
        return {
          text:  'Lab orders report generated for ' + this.locationName
          + ' From: ' + this.startDate + ' To: ' + this.endDate,
          alignment: 'center',
          style: 'companysection'
        };
      },
      content: [
        {text: this.locationName, style: 'Header'},
        {text: 'Lab Test Orders ' + ' From ' + this.startDate +
        ' To ' + this.endDate, style: 'subHeader'},
        {
          style: 'tableExample',
          table: {
            body: data
          },
          layout: {
            fillColor: (i, node) => {
              return (i % 2 === 0) ? '#d9edf7' : null;
            },
            hLineWidth: (i, node) => {
              return (i === 0 || i === node.table.body.length) ? 1 : 1;
            },
            vLineWidth: (i, node) => {
                    return (i === 0 || i === node.table.widths.length) ? 1 : 1;
            },
            hLineColor: (i, node) => {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
            },
            vLineColor: (i, node) => {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
            }
          }
        }
      ],
      styles: {
        Header: {
          fontSize: 14,
          marginBottom: 5,
          bold: true
        },
        subHeader: {
          fontSize: 11,
          marginBottom: 10,
          bold: true
        },
        tableHeader: {
          fontSize: 10,
          margin: [0, 0, 0, 10],
          bold: true
        },
        cellData: {
          fontSize: 8
        },
        companysection: {
          fontSize: 8,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        reportPage: {
          fontSize: 8,
          margin: [0, 5, 20, 15],
          color: 'black'
        }
      }
     };
    pdf.createPdf(docDefinition).download((this.getReportName()) + '.pdf');
    }
    private getRptBodyData(headers) {
    let dataArray =  [headers];
    let cnt = 1;
    _.each(this.results, (data: any) => {
            let dataRow = [];
            let sampleDrawn = data.sample_drawn ? data.sample_drawn : ' ';
            if (cnt === 1) {
              this.locationName = data.location_name;
            }
            dataRow.push({text: cnt, style: 'cellData'});
            dataRow.push({text: data.identifiers.replace( /,/g, ', '), style: 'cellData'});
            dataRow.push({text: data.person_name, style: 'cellData'});
            dataRow.push({text: data.orderNumber, style: 'cellData'});
            dataRow.push({text: data.order_type, style: 'cellData'});
            dataRow.push({text: data.DateActivated, style: 'cellData'});
            dataRow.push({text: sampleDrawn, style: 'cellData'});
            dataRow.push({text: data.sampleCollectionDate, style: 'cellData'});
            cnt++;
            dataArray.push(dataRow);
        });
    return dataArray;
    }

  private getReportName() {
    return this.locationName.replace( / /g, '-')
    + '-lab-orders-report_from_'
    + this.startDate +
    '_to_' + this.endDate;
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
