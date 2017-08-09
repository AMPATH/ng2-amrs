/* this will hold the serach patient
child component 
*/
import { Component, OnInit, OnDestroy, DoCheck
  , Output, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-search-container',
  templateUrl: './patient-search-container.component.html',
  styleUrls: ['./patient-search-container.component.css'],
})

export class PatientSearchContainerComponent implements OnInit {

  public hideResult = true;

     constructor(private _route: ActivatedRoute,
            private _router: Router) {
        }

  ngOnInit() {

  }

  patientSelected(patient) {
      let patientUuid = patient.uuid;
      this.loadPatientData(patientUuid);

  }

  loadPatientData(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this._router.navigate(['/patient-dashboard/' + patientUuid + '/general']);
  }


}
