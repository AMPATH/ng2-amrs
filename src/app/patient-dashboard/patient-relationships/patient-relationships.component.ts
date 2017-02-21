import { PatientService } from '../patient.service';
import { PatientRelationshipService } from './patient-relationship.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'patient-relationships',
  templateUrl: './patient-relationships.component.html',
  styleUrls: ['./patient-relationships.component.css'],
})

export class PatientRelationshipsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  private patientUuid: string;
  private loadingRelationships: boolean = false;
  private errors: any;
  private relationships: any = [];
  private displayConfirmDialog: boolean = false;
  private selectedRelationshipUuid: string;
  private showSuccessAlert: boolean = false;
  private showErrorAlert: boolean = false;
  private successAlert: string;
  private errorAlert: string;
  private errorTitle: string;

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
          if (success) {
            this.patientService.fetchPatientByUuid(this.patientUuid);
            this.displayConfirmDialog = false;
            this.displaySuccessAlert('Relationship deleted successfully');
          }
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
