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
import * as rison from 'rison-node';

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
      headerName: '#',
      colId: 'rowNum',
      valueGetter: 'node.rowIndex + 1',
      width: 80,
      pinned: 'left'
    },
    {
      field: 'identifiers',
      headerName: 'Identifiers',
      pinned: 'left',
      cellRenderer: (column) => {
        return (
          '<a href="javascript:void(0);" title="Identifiers">' +
          column.value +
          '</a>'
        );
      }
    },
    { field: 'person_name', headerName: 'Index Name' },
    { field: 'fm_gender', headerName: 'Gender' },
    { field: 'patient_program_name', headerName: 'Program Name' },
    { field: 'phone_number', headerName: 'Telephone Number' },
    { field: 'contacts_count', headerName: 'Family count' },
    { field: 'nearest_center', headerName: 'Nearest Center' }
  ];
  @Output()
  public patientSelected = new EventEmitter();
  public ngOnInit() {
    this.gridOptions.columnDefs = this.columnDefs;
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
      if (e.rowPinned !== 'bottom') {
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
}
