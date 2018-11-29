
import { take } from 'rxjs/operators/take';
import { PatientService } from '../../services/patient.service';
import { PatientRelationshipService } from './patient-relationship.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'patient-relationships',
  templateUrl: './patient-relationships.component.html',
  styleUrls: ['./patient-relationships.component.css'],
})

export class PatientRelationshipsComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public displayConfirmDialog = false;
  public patientUuid: string;
  public loadingRelationships = false;
  public errors: any;
  public relationships: any = [];
  public selectedRelationshipUuid: string;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public successAlert: string;
  public errorAlert: string;
  public errorTitle: string;

  constructor(private patientService: PatientService,
    private patientRelationshipService: PatientRelationshipService) {
  }

  public ngOnInit(): void {
    this.getPatientRelationships();
  }

  public ngOnDestroy(): void {
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
          const request = this.patientRelationshipService.getRelationships(this.patientUuid);
          request.pipe(
            take(1)).subscribe(
              (relationships) => {
                if (relationships) {
                  this.relationships = relationships;
                  this.loadingRelationships = false;
                }
              }
            );
        }
      }
      , (err) => {
        this.loadingRelationships = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  public voidRelationship() {
    if (this.selectedRelationshipUuid) {
      this.patientRelationshipService.voidRelationship(this.selectedRelationshipUuid).subscribe(
        (success) => {
          this.patientService.reloadCurrentPatient();
          this.displayConfirmDialog = false;
          this.displaySuccessAlert('Relationship deleted successfully');
        },
        (error) => {
          console.error('The request failed because of the following ', error);
          this.displayErrorAlert('Error!',
            'System encountered an error while deleting the relationship. Please retry.');
        });
    }
  }

  public openConfirmDialog(uuid: string) {
    this.selectedRelationshipUuid = uuid;
    this.displayConfirmDialog = true;

  }

  public displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
  }

  public displayErrorAlert(errorTitle, errorMessage) {
    this.showErrorAlert = true;
    this.errorAlert = errorMessage;
    this.errorTitle = errorTitle;
    setTimeout(() => {
      this.showErrorAlert = false;
    }, 3000);
  }
}
