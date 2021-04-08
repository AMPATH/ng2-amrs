import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AgGridNg2 } from 'ag-grid-angular';
import * as Moment from 'moment';
@Component({
  selector: 'family-testing-patient-list',
  templateUrl: './family-testing-patient-list.component.html',
  styleUrls: ['./family-testing-patient-list.component.css']
})
export class FamilyTestingPatientlistComponent implements OnInit {
  public hasLoadedAll: true;
  public hasError: false;
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  @Input()
  public patientData = [];
  private columnDefs = [
    {
      field: 'person_name',
      headerName: 'Index Name',
      rowGroup: false,
      hide: false,
      pinned: 'left',
      cellRenderer: (column) => {
        return (
          '<a href="javascript:void(0);" title="Identifiers">' +
          column.value +
          '</a>'
        );
      }
    },
    {
      field: 'identifiers',
      headerName: 'Identifiers',
      hide: true,
      rowGroup: true,
      pinned: 'left',
      cellRenderer: (column) => {
        if (column.value === undefined || column.value === null) {
          return '';
        } else {
          return (
            '<a href="javascript:void(0);" title="Identifiers">' +
            column.value +
            '</a>'
          );
        }
      }
    },
    {
      field: 'patient_program_name',
      headerName: 'Patient Program'
    },
    {
      field: 'fm_name',
      headerName: 'Contact Name',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'date_elicited',
      headerName: 'Date Elicited',
      width: 100,
      cellRenderer: (column) => {
        return Moment(column.value).format('DD/MM/YYYY');
      }
    },
    { field: 'fm_phone', headerName: 'Telephone Number', width: 130 },
    { field: 'relationship_type', headerName: 'Relationship', width: 130 },
    { field: 'fm_age', headerName: 'Age', width: 80 },
    { field: 'fm_gender', headerName: 'Gender', width: 80 },
    {
      field: 'modified_fm_status',
      headerName: 'Reported HIV status',
      width: 150
    },
    {
      field: 'reported_test_date',
      headerName: 'Reported test date',
      width: 150
    },
    {
      field: 'test_eligible',
      headerName: 'Eligible for testing',
      width: 150
    },
    {
      field: 'preferred_testing_date',
      headerName: 'Preferred date of testing',
      width: 180
    },
    {
      field: 'modified_current_test_date',
      headerName: 'Current test date',
      width: 150
    },
    {
      field: 'test_result_value',
      headerName: 'Current test results',
      width: 150
    },
    { field: 'enrolled', headerName: 'In care', width: 80 },
    {
      field: 'fm_facility_enrolled',
      headerName: 'Location Enrolled',
      width: 130
    },
    {
      field: 'ccc_number',
      headerName: 'CCC Number',
      width: 130,
      onCellClicked: (column) => {
        if (column.value != null) {
          this.onContactIdentifierClicked(column.data.fm_uuid);
        }
      },
      cellRenderer: (column) => {
        if (column.value == null) {
          return '';
        }
        return (
          '<a href="javascript:void(0);" title="ccc_number">' +
          column.value +
          '</a>'
        );
      }
    }
  ];
  @Output()
  public patientSelected = new EventEmitter();
  public ngOnInit() {
    this.gridOptions.columnDefs = this.columnDefs;
    this.gridOptions.groupDefaultExpanded = -1;
    this.gridOptions.enableFilter = true;
    (this.gridOptions.groupRemoveSingleChildren = false),
      (this.gridOptions.groupUseEntireRow = true);
    this.setCellSelection();
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public location: Location
  ) {}

  private setCellSelection(col?) {
    this.gridOptions.rowSelection = 'single';
    let selectedIndicator: any;
    this.gridOptions.onCellClicked = (e) => {
      if (e.data) {
        selectedIndicator = {
          patient_uuid: e.data.patient_uuid
        };
        this.patientSelected.emit(selectedIndicator);
      }
    };
  }
  public exportAllData() {
    this.agGrid.api.exportDataAsCsv();
  }

  public onContactIdentifierClicked(uuid) {
    this.router.navigate([
      '/patient-dashboard/patient/' + uuid + '/general/general/landing-page'
    ]);
  }
}
