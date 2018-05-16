import { Component,
  OnInit , OnDestroy , AfterViewInit, OnChanges ,
  Output , EventEmitter, Input , ChangeDetectorRef,
  ViewChild , SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router , Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { DataEntryStatisticsService } from
'./../etl-api/data-entry-statistics-resource.service';
import { GridOptions } from 'ag-grid/main';
@Component({
  selector: 'data-entry-statistics-patient-list',
  templateUrl: './data-entry-statistics-patient-list.component.html',
  styleUrls: ['./data-entry-statistics-patient-list.component.css']
})

export class DataEntryStatisticsPatientListComponent
implements OnInit , AfterViewInit {

    public title: string = 'Patient List';

    public busyIndicator: any = {
     busy: false,
     message: 'Please wait...' // default message
    };

    public gridOptions: GridOptions = {
      enableColResize: true,
      enableSorting : true,
      enableFilter : true,
      showToolPanel : false,
      pagination: true,
      paginationPageSize: 300,
      onGridSizeChanged : () => {
        if (this.gridOptions.api) {
          this.gridOptions.api.sizeColumnsToFit();
        }
      },
      onGridReady: () => {
          if (this.gridOptions.api) {
            this.gridOptions.api.sizeColumnsToFit();
          }
      }
   };

   public rowData: any = [];

   @Input() public patientList: any = [];
   @Input() public startDate: string = '';
   @Input() public endDate: string = '';

   public dataEntryPatientListColdef: any = [
    {
      headerName: '#',
      field: 'patient_no'
    },
    {
      headerName: 'Identifiers',
      field: 'identifiers',
      onCellClicked: (column) => {
        this.redirectTopatientInfo(column.data.patient_uuid);
      },
      cellRenderer: (column) => {
        return '<a href="javascript:void(0);" title="Identifiers">'
          + column.value + '</a>';
      }
    },
    {
      headerName: 'Person Name',
      field: 'person_name'
    },
    {
      headerName: 'Gender',
      field: 'gender'
    },
    {
      headerName: 'Age',
      field: 'age'
    },
    {
      headerName: 'Location Name',
      field: 'location_name'
    }
   ];

   constructor(
    private _cd: ChangeDetectorRef,
    public _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    public _dataEntryStatisticsService: DataEntryStatisticsService
  ) {}

    public ngOnInit() {
      this._route
      .queryParams
      .subscribe((params) => {
        if (params) {
             this.getPatientList(params);
           }
       }, (error) => {
          console.error('Error', error);
       });

    }
    public ngAfterViewInit(): void {
      this._cd.detectChanges();
    }
    public processPatientList(patientList) {

      let patientArray = [];
      let patientCount = 1;

      _.each(patientList, (list: any) => {
         let specificPatient = {
            'patient_no': patientCount,
            'identifiers': list.identifiers,
            'person_name': list.person_name,
            'gender': list.gender,
            'age' : list.age,
            'location_name': list.location_name,
            'patient_uuid': list.patient_uuid
         };

         patientArray.push(specificPatient);
         patientCount++;
      });

      this.rowData = patientArray;

    }

    public redirectTopatientInfo(patientUuid) {
      if (patientUuid === undefined || patientUuid === null) {
        return;
      }
      this._router.navigate(['/patient-dashboard/patient/' + patientUuid +
        '/general/general/landing-page']);
    }

  public getPatientList(params) {

      this.patientList = [];
      this.busyIndicator = {
        busy: true,
        message: 'Fetching patient list..please wait'
      };
      this._dataEntryStatisticsService.getDataEntrySatisticsPatientList(params)
      .subscribe((results) => {
         if (results) {
            this.processPatientList(results);
            this.busyIndicator = {
              busy: false,
              message: ''
            };
         }
      });
    }

    public back() {

      this._location.back();

    }

  }
