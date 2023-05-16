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
  public children_status = '';
  public children_elicitation_status = '';
  public partner_status = '';
  public hasChildrenBeenElicited = '';
  public hasContacts = true;
  public childrenTestingConsentGiven = '';
  public gender = '';
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
    { field: 'fm_gender', headerName: 'Gender', width: 80 },
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
      field: 'reported_test_date',
      headerName: 'Reported test date',
      width: 150
    },

    {
      field: 'modified_fm_status',
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
        this.gender = patient.person.gender;
        this.getFamilyTestingContactListData(this.patientUuid);
      }
    });
    this.gridOptions.columnDefs = this.columnDefs;
  }

  public getFamilyTestingContactListData(patientId: string) {
    this.familyTestingService
      .getFamilyTestingReportData({ patientUuid: patientId })
      .subscribe((data) => {
        if (data.result && data.result.length > 0) {
          this.getContacts(data.result);
          if (data.result !== undefined && data.result.length > 0) {
            this.hasContacts = true;
          } else {
            this.hasContacts = false;
          }
          if (data.result[0].children_elicited_by_partner === 'YES') {
            this.children_elicitation_status = 'YES';
          } else if (data.result[0].children_elicited_by_partner === 'NO') {
            this.children_elicitation_status = `NO. Partner  ${data.result[0].female_partner_status}`;
          }
          data.result[0].child_status_reason
            ? (this.children_status =
                data.result[0].child_status +
                ', ' +
                data.result[0].child_status_reason)
            : (this.children_status = data.result[0].child_status);

          if (data.result[0].child_status !== 'YES' || this.gender === 'F') {
            this.children_elicitation_status = '';
          }
          this.maxElicitationDate = Moment(
            this.getMaxElicitationDate(data.result)
          ).format('DD/MM/YYYY');
          this.hasChildrenBeenElicited = data.result[0].children_elicited;
          if (data.result[0].child_status === 'YES') {
            this.childrenTestingConsentGiven =
              data.result[0].children_testing_consent_given;
          }
        }
      });
  }

  public getMaxElicitationDate(contacts) {
    const dates = [];
    _.each(contacts, (c) => {
      dates.push(new Date(c.encounter_datetime));
      dates.push(new Date(c.date_elicited));
      dates.push(new Date(c.updated_elicitation_date));
      dates.push(new Date(c.updated_elicitation_date_alert));
    });

    return new Date(Math.max.apply(null, dates));
  }

  public getContacts(contacts) {
    _.each(contacts, (c) => {
      if (c.obs_group_id != null) {
        this.indexContacts = contacts;
      }
    });
  }
}
