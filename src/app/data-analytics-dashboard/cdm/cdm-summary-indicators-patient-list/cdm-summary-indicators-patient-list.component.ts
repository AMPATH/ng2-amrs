
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router , Params } from '@angular/router';

@Component({
  selector: 'cdm-summary-indicators-patient-list',
  styleUrls: ['cdm-summary-indicators-patient-list.component.css'],
  templateUrl: 'cdm-summary-indicators-patient-list.component.html'
})

export class CdmsummaryIndicatorsPatientListComponent implements OnInit {
  public title: string = 'CDM Summary Indicators Patient List';
  constructor(
    private _router: Router,
    private _route: ActivatedRoute) {

  }

  public ngOnInit() {
    this._route
      .queryParams
      .subscribe((params) => {
        if (params) {
             console.log('Params', params);
             this.getPatientList(params);
           }
       }, (error) => {
          console.error('Error', error);
       });

  }

  public getPatientList(params) {
     console.log('GetPatientList', params);
  }

}
