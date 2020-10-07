import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientGainsAndLosesComponent } from 'src/app/hiv-care-lib/patient-gains-and-loses/patient-gains-and-loses.component';
import { PatientGainLoseResourceService } from 'src/app/etl-api/patient-gain-lose-resource.service';
@Component({
  selector: 'patient-gains-and-loses',
  templateUrl:
    '../../../hiv-care-lib/patient-gains-and-loses/patient-gains-and-loses.component.html',
  styleUrls: [
    '../../../hiv-care-lib/patient-gains-and-loses/patient-gains-and-loses.component.css'
  ]
})
export class PatientGainLosesReportComponent
  extends PatientGainsAndLosesComponent
  implements OnInit {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public patientGainLose: PatientGainLoseResourceService
  ) {
    super(router, route, patientGainLose);
  }
  public params: any;
  public patientGainAndLoseSummaryData: any = [];

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoadingReport = false;
  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params && params.startingMonth) {
          this.isLoadingReport = true;
          this.params = params;
          this.getPatientGainAndLoseReport(params);
        }
      },
      (error) => {
        console.error('Error', error);
        this.showInfoMessage = true;
      }
    );
  }
}
