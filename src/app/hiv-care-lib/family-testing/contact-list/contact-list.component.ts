import { ActivatedRoute, Router } from '@angular/router';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as Moment from 'moment';
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
  public maxElicitationDate = '';
  public hasContacts = true;
  private columnDefs = [
    {
      headerName: '#',
      colId: 'rowNum',
      valueGetter: 'node.rowIndex + 1',
      width: 60,
      pinned: 'left'
    },
    { field: 'fm_name', headerName: 'Contact Name' },
    { field: 'fm_gender', headerName: 'Gender', width: 100 },
    { field: 'relationship_type', headerName: 'Relationship' },
    { field: 'fm_age', headerName: 'Age', width: 100 },
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
    {
      field: 'date_elicited',
      headerName: 'Date Elicited',
      width: 100,
      cellRenderer: (column) => {
        return Moment(column.value).format('DD/MM/YYYY');
      }
    }
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
          if (data.result !== undefined && data.result.length > 0) {
            this.hasContacts = true;
          } else {
            this.hasContacts = false;
          }
          this.maxElicitationDate = Moment(
            this.getMaxElicitationDate(data.result)
          ).format('DD/MM/YYYY');
        }
      });
  }

  public getMaxElicitationDate(contacts) {
    const dates = [];
    _.each(contacts, (c) => {
      dates.push(new Date(c.date_elicited));
    });

    return new Date(Math.max.apply(null, dates));
  }
}
