import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AgGridNg2 } from 'ag-grid-angular';
import { take } from 'rxjs/operators';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { FamilyTestingService } from 'src/app/etl-api/family-testing-resource.service';
import { FamilyTestingButtonRendererComponent } from './button-render/button-renderer.component';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { LocalStorageService } from './../../utils/local-storage.service';
import * as _ from 'lodash';

@Component({
  selector: 'family-testing-contact-list',
  templateUrl: './family-testing-contact-list.component.html',
  styleUrls: ['./family-testing-contact-list.component.css']
})
export class FamilyTestingContactComponent implements OnInit {
  public selectedEncounter: any;
  public selectedRow: any;
  public onEncounterDetail: number;
  public isLoading: boolean;
  public obs: any;
  public showInfoMessage: boolean;
  public isHidden: Array<boolean> = [];
  public errorMessage: string;
  public patientEncounters: Array<any> = [];
  public familyTestingContactList: Array<any> = [];
  private frameworkComponents: any;
  public patientUuid: string;
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('actionModal')
  public actionModal: ModalDirective;
  @ViewChild('addContactTrace')
  public addContactTraceModal: ModalDirective;

  public deleteModalRef: BsModalRef;

  public displayFamilyTree = true;
  public indexName = '';
  private columnDefs = [
    {
      headerName: '#',
      colId: 'rowNum',
      valueGetter: 'node.rowIndex + 1',
      width: 40,
      pinned: 'left'
    },
    { field: 'fm_name', headerName: 'Contact Name' },
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
    },
    {
      headerName: 'Actions',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onActionsClicked.bind(this),
        label: 'Actions'
      },
      width: 80,
      pinned: 'left',
      cellStyle: () => {
        return { display: 'flex', alignItems: 'center' };
      }
    }
  ];

  public ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.patientUuid = params.patient_uuid;
      this.getFamilyTestingContactListData(this.patientUuid);
      this.setPatientUuid(this.patientUuid);
    });
    this.gridOptions.columnDefs = this.columnDefs;
    this.getPatientEncounters();
  }

  constructor(
    private familyTestingService: FamilyTestingService,
    private encounterResourceService: EncounterResourceService,
    public route: ActivatedRoute,
    public location: Location,
    private modalService: BsModalService,
    public router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.frameworkComponents = {
      buttonRenderer: FamilyTestingButtonRendererComponent
    };
  }

  public getFamilyTestingContactListData(patientId: string) {
    this.isLoading = true;
    this.familyTestingService
      .getFamilyTestingReportData(patientId)
      .subscribe((data) => {
        if (data.error) {
          this.showInfoMessage = true;
          this.errorMessage = `There has been an error while loading the report, please retry again`;
          this.isLoading = false;
        } else {
          this.showInfoMessage = false;
          this.isLoading = false;
          this.familyTestingContactList = data.result;
          this.indexName = data.result[0].person_name;
        }
      });
  }

  public getPatientEncounters() {
    const familyAndPartnerTestingFormUuid =
      '3fbc8512-b37b-4bc2-a0f4-8d0ac7955127';
    this.encounterResourceService
      .getEncountersByPatientUuid(this.patientUuid, false, null)
      .pipe(take(1))
      .subscribe((resp) => {
        this.patientEncounters = resp.reverse().filter((encounter) => {
          if (encounter.form) {
            return encounter.form.uuid === familyAndPartnerTestingFormUuid;
          }
        });
      });
  }

  public showAddContactTraceModal() {
    this.staticModal.hide();
    this.addContactTraceModal.show();
  }

  public closeAddContactTraceModal() {
    this.addContactTraceModal.hide();
  }

  public showModal() {
    this.staticModal.show();
  }

  public closeModal() {
    this.selectedRow = null;
    this.staticModal.hide();
  }

  public closeActionsModal() {
    this.actionModal.hide();
  }

  public goBack() {
    this.location.back();
  }

  public exportAllData() {
    this.agGrid.api.exportDataAsCsv();
  }

  public toggleTreeView() {
    this.displayFamilyTree = !this.displayFamilyTree;
  }

  public onActionsClicked(e) {
    this.selectedRow = e;
    this.actionModal.show();
  }

  public openAddContactTraceModal() {
    this.actionModal.hide();
  }

  public onTraceHistoryClicked() {
    this.actionModal.hide();
    this.staticModal.show();
  }

  public onAddContactClick() {
    const defaulterTracingFormV1Uuid = 'bf6d0d9a-e6af-48fd-9245-6d1939adb37d';
    const url = `/patient-dashboard/patient/${this.patientUuid}/general/general/formentry/${defaulterTracingFormV1Uuid}`;
    this.router.navigate([url], {});
  }

  public onEditClick() {
    const encounterUuid = _.first(this.patientEncounters).uuid;
    const familyPartnerHistoryFormV1 = `3fbc8512-b37b-4bc2-a0f4-8d0ac7955127`;
    const url = `/patient-dashboard/patient/${this.patientUuid}/general/general/formentry/${familyPartnerHistoryFormV1}`;
    this.router.navigate([url], {
      queryParams: { encounter: encounterUuid, visitTypeUuid: '' }
    });
  }

  public onDeleteContact(deleteModalRef: TemplateRef<any>) {
    this.actionModal.hide();
    this.deleteModalRef = this.modalService.show(deleteModalRef);
  }

  public onPatientRegister() {
    this.actionModal.hide();
    const { event, rowData } = this.selectedRow;
    const [givenName, middleName, familyName] = rowData.fm_name.split(' ');
    const patientRegistrationUrl = `/patient-dashboard/patient-search/patient-registration`;
    this.router.navigate([patientRegistrationUrl], {
      queryParams: {
        givenName: givenName,
        familyName: familyName,
        middleName: middleName,
        age: rowData.fm_age,
        dateOfBirth: rowData.fm_dob,
        gender: rowData.fm_gender,
        obs_group_id: rowData.obs_group_id
      }
    });
  }

  openModal(template: TemplateRef<any>) {
    this.deleteModalRef = this.modalService.show(template, {
      class: 'modal-sm'
    });
  }

  public closeDeleteModal() {
    this.deleteModalRef.hide();
  }

  public confirmDelete(): void {
    const contactId = this.selectedRow.rowData.obs_group_id;
    this.familyTestingService
      .deleteContact(contactId)
      .subscribe((response: Response) => {
        this.getFamilyTestingContactListData(this.patientUuid);
        this.actionModal.hide();
      });
    this.deleteModalRef.hide();
    this.staticModal.hide();
  }

  public declineDelete(): void {
    console.log('Delete Action Rejected');
    this.deleteModalRef.hide();
  }

  private setPatientUuid(uuid: string) {
    if (uuid != null) {
      this.localStorageService.setItem('family_testing_patient_uuid', uuid);
    }
  }

  public onContactIdentifierClicked(uuid) {
    this.router.navigate([
      '/patient-dashboard/patient/' + uuid + '/general/general/landing-page'
    ]);
  }
}
