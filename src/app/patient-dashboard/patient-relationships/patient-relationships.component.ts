import { PatientService } from '../patient.service';
import { PatientRelationshipService } from './patient-relationship.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'patient-relationships',
  templateUrl: './patient-relationships.component.html'
})

export class PatientRelationshipsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  private patientUuid: string;
  private loadingRelationships: boolean = false;
  private errors: any;
  private relationships: any = [];

  constructor(private patientService: PatientService,
              private patientRelationshipService: PatientRelationshipService) {
  }

  ngOnInit(): void {
    this.getPatientRelationships();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatientRelationships(): void {
    this.loadingRelationships = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patientUuid = patient.person.uuid;
          let request = this.patientRelationshipService.getRelationships(this.patientUuid);
          request
            .subscribe(
            (relationships) => {
              if (relationships) {
                this.relationships = relationships;
              }
            }
            );
        }
      }
      , (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }
}
