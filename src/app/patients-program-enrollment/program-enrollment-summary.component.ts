import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Router } from "@angular/router";
import { GridOptions } from "ag-grid/main";

@Component({
  selector: "program-enrollment-summary",
  templateUrl: "./program-enrollment-summary.component.html",
})
export class ProgramEnrollmentSummaryComponent implements OnInit {
  public params: any;

  @Input() public enrolledSummary: any = [];
  @Input() public hide: boolean;
  @Input() public locationSelected: any = [];
  @Input() public startDate = "";
  @Input() public endDate = "";
  @Input() public filterParams: any = [];
  @Output() public programSelected: EventEmitter<any> = new EventEmitter();

  public summaryGridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    groupDefaultExpanded: -1,
    onGridSizeChanged: () => {
      if (this.summaryGridOptions.api) {
        this.summaryGridOptions.api.sizeColumnsToFit();
      }
    },
    getRowStyle: (params) => {
      return { "font-size": "14px", cursor: "pointer" };
    },
  };
  public enrollmentSummaryColdef: any = [
    { headerName: "Department", field: "dept", rowGroup: true, hide: true },
    { headerName: "Program", field: "program" },
    {
      headerName: "#Enrolled",
      field: "enrolled",
      cellRenderer: (column) => {
        if (typeof column.value !== "undefined") {
          return (
            '<a href="javascript:void(0);" title="Identifiers">' +
            column.value +
            "</a>"
          );
        } else {
          return "";
        }
      },
      onCellClicked: (column: any) => {
        if (column.data.dept === "Total") {
          this.params = this.filterParams;
        } else {
          this.params = {
            startDate: this.startDate,
            endDate: this.endDate,
            locationUuids: this.locationSelected,
            programType: column.data.programUuid,
          };
        }
        this.programSelected.emit(this.params);
      },
    },
  ];
  public style = {
    marginTop: "20px",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  };
  constructor(private _router: Router) {}

  public ngOnInit() {}

  public exportPatientListToCsv() {
    this.summaryGridOptions.api.exportDataAsCsv();
  }
  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    } else {
      this._router.navigate([
        "/patient-dashboard/patient/" +
          patientUuid +
          "/general/general/landing-page",
      ]);
    }
  }
}
