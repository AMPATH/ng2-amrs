import { Component, OnInit } from '@angular/core';
import { PrepResourceService } from 'src/app/etl-api/prep-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-prep-report-patient-list',
  templateUrl: './prep-report-patient-list.component.html',
  styleUrls: ['./prep-report-patient-list.component.css']
})
export class PrepReportPatientListComponent implements OnInit {
  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public hasLoadedAll = false;
  public hasError = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public prepResource: PrepResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.month) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  private getPatientList(params: any) {
    this.prepResource.getPrepPatientList(params).subscribe((data) => {
      this.isLoading = false;
      this.patientData = data.result;
      this.hasLoadedAll = true;
    });
  }
  public goBack() {
    this._location.back();
  }
}
