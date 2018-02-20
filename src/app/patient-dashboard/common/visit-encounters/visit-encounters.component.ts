import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { PatientEncounterService } from '../patient-encounters/patient-encounters.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';

@Component({
    selector: 'visit-encounters',
    templateUrl : './visit-encounters.component.html',
    styleUrls : ['./visit-encounters.component.css']
})

export class VisitEncountersComponent implements OnInit {

  public title: string = 'Patient Visits';
  public patientUuid: string = '';
  public patientEncounters: any = [];
  public encounterDetail: boolean = false;
  public specEncounter: any = [];
  public selectedEncounter: any = [];
  public showVisitsObservations: boolean = true;
  public busyIndicator: any = {
    busy: false,
    message: '' // default message
  };

   constructor(private _patientService: PatientService,
               private _patientEncountersService: PatientEncounterService,
               private _encounterResourceService: EncounterResourceService,
               private _visitResourceService: VisitResourceService
            ) {

    }
    public ngOnInit() {
        this.getPatientUuid();
        this.encounterDetail = true;

    }

     public getPatientUuid() {
        this._patientService.currentlyLoadedPatient.subscribe(
            (patient) => {
                if (patient !== null) {
                    this.patientUuid = patient.uuid;
                    this.getPatientEncounters(patient.uuid);

                }
            });
     }

     public getPatientEncounters(patientUuid) {
         this._encounterResourceService.getEncountersByPatientUuid(patientUuid ,
          false, null).subscribe((resp) => {
                this.patientEncounters = resp.reverse();

          });
     }

     public showVisits() {
         this.showVisitsObservations = true;

     }
     public showEncounters() {
          this.showVisitsObservations = false;
     }

}
