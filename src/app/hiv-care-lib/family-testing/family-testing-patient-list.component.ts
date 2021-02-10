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
      field: 'fm_name',
      headerName: 'Contact Name',
      filter: 'agTextColumnFilter'
    },
    { field: 'fm_gender', headerName: 'Gender' },
    { field: 'fm_phone', headerName: 'Telephone Number' },
    { field: 'relationship_type', headerName: 'Relationship' },
    { field: 'fm_age', headerName: 'Age' },
    { field: 'fm_status', headerName: 'Reported HIV status' },
    { field: 'reported_test_date', headerName: 'Reported HIV test date' },
    {
      field: 'test_eligible',
      headerName: 'Eligible for HIV testing'
    },
    {
      field: 'preferred_testing_date',
      headerName: 'Preferred date of testing'
    },
    { field: 'test_result_value', headerName: 'Current test results' },
    { field: 'enrolled', headerName: 'In care' },
    { field: 'fm_facility_enrolled', headerName: 'Location Enrolled' },
    {
      field: 'ccc_number',
      headerName: 'CCC Number',
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
