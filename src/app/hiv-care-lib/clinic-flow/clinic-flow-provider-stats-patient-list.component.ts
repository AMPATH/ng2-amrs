import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { AgGridNg2 } from 'ag-grid-angular';
import { ClinicFlowResourceService } from './../../etl-api/clinic-flow-resource.service';
@Component({
  selector: 'app-clinic-flow-provider-stats-patient-list',
  templateUrl: './clinic-flow-provider-stats-patient-list.component.html',
  styleUrls: ['./clinic-flow-provider-stats-patient-list.component.css']
})
export class ClinicFlowProviderStatsPatientListComponent implements OnInit {
  public title = 'Provider statistics Patient list';
  public params: any;
  public patientData: any;
  public patientListColdefs = [];
  public extraColumns = [];
  public loadingData = false;
  public errorObj = {
    isError: false,
    message: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private clinicFlowService: ClinicFlowResourceService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.params = params;
          if (params.encounterDate) {
            this.getPatientList(params);
          }
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  private getPatientList(params: any): any {
    this.loadingData = true;
    this.errorObj = {
      isError: false,
      message: ''
    };
    this.clinicFlowService
      .getClinicFlowProviderStatisticsPatientList(params)
      .subscribe(
        (result: any) => {
          this.patientData = result.results;
          this.generatePatientCols();
          this.loadingData = false;
        },
        (error) => {
          this.errorObj = {
            isError: true,
            message:
              'Encountered an error while fetching patient list.Kindly reload'
          };
          this.loadingData = false;
        }
      );
  }

  public generatePatientCols() {
    let dataRows = [];
    if (this.patientData.length > 0) {
      dataRows = Object.keys(this.patientData[0]);
    }
    const patientListColDefs = dataRows.map((r) => {
      return {
        headerName: r,
        field: r,
        width: 100
      };
    });

    this.patientListColdefs = patientListColDefs;
  }
  public navigateBack(): void {
    this.location.back();
  }
}
