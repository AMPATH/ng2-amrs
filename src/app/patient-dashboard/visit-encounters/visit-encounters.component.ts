import { PatientEncounterObservationsComponent } from
'./../patient-encounters/patient-encounter-observations.component';
import { EncounterListComponent } from './../patient-encounters/encounter-list.component';
import { Component, OnInit, NgModule, OnChanges,
OnDestroy, AfterViewInit, EventEmitter , ViewChild, Output } from '@angular/core';
import { PatientService } from '../patient.service';
import { Subscription, Observable } from 'rxjs/Rx';
import { PatientEncounterService } from '../patient-encounters/patient-encounters.service';
import { EncounterResourceService } from './../../openmrs-api/encounter-resource.service';
import { VisitResourceService } from './../../openmrs-api/visit-resource.service';
import { VisitEncountersPipe } from './visit-encounters.pipe';
import { OrderByAlphabetPipe } from './visit-encounter.component.order.pipe';
import { Encounter } from '../../models/encounter.model';
import * as _ from 'lodash';
import * as Moment from 'moment';


@Component({
    selector: 'visit-encounters',
    templateUrl : 'visit-encounters.component.html',
    styleUrls : ['visit-encounters.component.css']
})



export class VisitEncountersComponent implements OnInit {


  title: string = 'Patient Visits';
  patientUuid: string = '';
  patientEncounters: any = [];
  encounterDetail: boolean = false;
  specEncounter: any = [];
  selectedEncounter: any = [];
  showVisitsObservations: boolean = true;
  public busyIndicator: any = {
    busy: false,
    message: 'Fetching encounters hang on...' // default message
  };




   constructor(private _patientService: PatientService,
             private _patientEncountersService: PatientEncounterService,
             private _encounterResourceService: EncounterResourceService,
             private _visitResourceService: VisitResourceService
            ) {


    }
    ngOnInit() {
        this.getPatientUuid();
        this.encounterDetail = true;

    }

     getPatientUuid() {
        this._patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient !== null) {
                    this.patientUuid = patient.uuid;
                    this.getPatientEncounters(patient.uuid);

                }
            });
     }


     getPatientEncounters(patientUuid) {
         this._encounterResourceService.getEncountersByPatientUuid(patientUuid ,
          false, null).subscribe(resp => {
                this.patientEncounters = resp.reverse();

          });
     }

     showVisits() {
         this.showVisitsObservations = true;

     }
     showEncounters() {
          this.showVisitsObservations = false;
     }


}
