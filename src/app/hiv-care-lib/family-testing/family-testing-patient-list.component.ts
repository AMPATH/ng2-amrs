import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

import { AgGridNg2 } from "ag-grid-angular";
import * as Moment from "moment";
import { GridOptions } from "ag-grid";
@Component({
  selector: "family-testing-patient-list",
  templateUrl: "./family-testing-patient-list.component.html",
  styleUrls: ["./family-testing-patient-list.component.css"],
})
export class FamilyTestingPatientlistComponent implements OnInit {
  public hasLoadedAll: true;
  public hasError: false;
  public showList = false;
  public gridOptions: GridOptions = {
    columnDefs: [],
  };
  @ViewChild("agGrid")
  public agGrid: AgGridNg2;
  public _patientData = [];

  @Input()
  public get patientData(): any {
    return this._patientData;
  }
  public set patientData(patientData: any) {
    this._patientData = patientData;
  }

  private columnDefs = [
    {
      field: "identifiers",
      headerName: "Identifiers",
      rowGroup: true,
      pinned: "left",
      width: 200,
      cellRenderer: (column) => {
        if (column.value === undefined || column.value === null) {
          return "";
        } else {
          return (
            '<a href="javascript:void(0);" title="Identifiers">' +
            column.value +
            "</a>"
          );
        }
      },
    },
    {
      field: "person_name",
      headerName: "Index Name",
    },
    {
      field: 'index_gender',
      headerName: 'Index Gender',
      width: 100
    },
    {
      field: 'age',
      headerName: 'Index Age',
      width: 100
    },
    {
      field: "phone_number",
      headerName: "Index Phone",
      width: 120,
    },
    {
      field: 'arv_first_regimen_start_date',
      headerName: 'ART Initiation Date'
    },
    {
      field: 'patient_program_name',
      headerName: 'Patient Program'
    },
    {
      field: "fm_name",
      headerName: "Contact Name",
      filter: "agTextColumnFilter",
    },
    {
      field: "date_elicited",
      headerName: "Date Elicited",
      width: 100,
      cellRenderer: (column) => {
        if (column.value) {
          return Moment(column.value).format('DD/MM/YYYY');
        }
        return null;
      }
    },
    { field: 'fm_phone', headerName: 'Telephone Number', width: 130 },
    { field: 'relationship_type', headerName: 'Relationship', width: 130 },
    { field: 'fm_current_age', headerName: 'Current age', width: 100 },
    {
      field: 'age_at_elicitation',
      headerName: 'Age at elicitation',
      width: 130
    },
    { field: 'fm_gender', headerName: 'Gender', width: 80 },
    {
      field: "modified_fm_status",
      headerName: "Reported HIV status",
      width: 150,
    },
    {
      field: "reported_test_date",
      headerName: "Reported test date",
      width: 150,
    },
    {
      field: "test_eligible",
      headerName: "Eligible for testing",
      width: 150,
    },
    {
      field: "preferred_testing_date",
      headerName: "Preferred date of testing",
      width: 180,
    },
    {
      field: "modified_current_test_date",
      headerName: "Current test date",
      width: 150,
    },
    {
      field: "test_result_value",
      headerName: "Current test results",
      width: 150,
    },
    { field: "enrolled", headerName: "In care", width: 80 },
    {
      field: "fm_facility_enrolled",
      headerName: "Location Enrolled",
      width: 130,
    },
    {
      field: "ccc_number",
      headerName: "CCC Number",
      width: 130,
      onCellClicked: (column) => {
        if (column.value != null) {
          this.onContactIdentifierClicked(column.data.fm_uuid);
        }
      },
      cellRenderer: (column) => {
        if (column.value == null) {
          return "";
        }
        return (
          '<a href="javascript:void(0);" title="ccc_number">' +
          column.value +
          "</a>"
        );
      },
    },
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
    this.gridOptions.rowSelection = "single";
    let selectedIndicator: any;
    this.gridOptions.onCellClicked = (e) => {
      if (e.data) {
        selectedIndicator = {
          patient_uuid: e.data.patient_uuid,
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
      "/patient-dashboard/patient/" + uuid + "/general/general/landing-page",
    ]);
  }
}
