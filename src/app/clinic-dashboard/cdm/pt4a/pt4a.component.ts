import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Pt4aService } from 'src/app/etl-api/pt4a-resource.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { SessionStorageService } from 'src/app/utils/session-storage.service';

interface ReportParams {
  uuid: string;
}

@Component({
  selector: 'app-pt4a',
  templateUrl: './pt4a.component.html',
  styleUrls: ['./pt4a.component.css']
})
export class Pt4aComponent implements OnInit {
  public patient: any;
  public uuid: string;
  rowData: any[] = [];

  columnDefs = [
    { headerName: 'NAME', field: 'name' },
    { headerName: 'IDENTIFIER', field: 'identifier' },
    { headerName: 'TCA', field: 'tca' },
    { headerName: 'DRUG', field: 'drug' }
  ];

  constructor(
    private routesProviderService: RoutesProviderService,
    private sessionStorageService: SessionStorageService,
    private pt4aService: Pt4aService,
    public router: Router
  ) {}
  ngOnInit() {
    this.fetchUser();
  }

  public get getReportParams(): ReportParams {
    return {
      uuid: this.uuid
    };
  }

  public fetchUser() {
    const patient = this.sessionStorageService.getItem('user');
    this.patient = JSON.parse(patient);
    this.uuid = this.patient.uuid;

    const reportParams = this.getReportParams;

    this.pt4aService.getPeerPatients(reportParams).subscribe(
      (result: any) => {
        this.rowData = result;
      },
      (error: any) => {}
    );
  }

  startVisit(event: any) {
    const dashboardRoutesConfig: any = this.routesProviderService
      .patientDashboardConfig;
    const route: any = _.find(
      dashboardRoutesConfig.programs,
      (_r: any) => _r['programUuid'] === 'fd7e9fc1-690d-4179-b630-1d292beb2006'
    );
    const _route =
      '/patient-dashboard/patient/' +
      event.data.patient_uuid +
      '/' +
      route.alias +
      '/' +
      route.baseRoute +
      '/visit';
    this.router.navigate([_route], {});
  }
}
