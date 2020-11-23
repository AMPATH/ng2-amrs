import { ActivatedRoute, Router } from '@angular/router';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  private patientUuid: string;
  public indexContacts: Array<any> = [];
  public gridOptions = { columnDefs: [] };
  private columnDefs = [
    {
      headerName: '#',
      colId: 'rowNum',
      valueGetter: 'node.rowIndex + 1',
      width: 80,
      pinned: 'left'
    },
    { field: 'fm_name', headerName: 'Contact Name' },
    { field: 'fm_gender', headerName: 'Gender' },
    { field: 'relationship_type', headerName: 'Relationship' },
    { field: 'fm_age', headerName: 'Age' }
  ];

  constructor(
    private familyTestingService: FamilyTestingService,
    public route: ActivatedRoute,
    public router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.patientService.currentlyLoadedPatient.subscribe((patient) => {
      if (patient) {
        this.patientUuid = patient.person.uuid;
        this.getFamilyTestingContactListData(this.patientUuid);
      }
    });
    this.gridOptions.columnDefs = this.columnDefs;
  }

  public getFamilyTestingContactListData(patientId: string) {
    this.familyTestingService
      .getFamilyTestingReportData(patientId)
      .subscribe((data) => {
        if (data.error) {
          console.log('error ', data.error);
        } else {
          this.indexContacts = data.result;
        }
      });
  }
}
