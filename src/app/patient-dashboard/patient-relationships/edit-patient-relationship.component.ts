import { Component, OnInit, Input } from '@angular/core';
import { PatientRelationshipTypeService } from './patient-relation-type.service';
import * as _ from 'lodash';
import { PatientService } from '../patient.service';
import { Relationship } from '../../models/relationship.model';
import { RelationshipType } from '../../models/relationship-type.model';
import { PatientRelationshipService } from './patient-relationship.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';




@Component({
  selector: 'edit-relationship',
  templateUrl: 'edit-patient-relationship.component.html',
  styleUrls: [],
})
export class EditPatientRelationshipComponent implements OnInit {
  private selectedRelative: any;
  private relationships: any;
  private display: boolean = false;
  private showSuccessAlert: boolean = false;
  private showErrorAlert: boolean = false;
  private successAlert: string;
  private errorAlert: string;
  private errors: any = [];
  private isLoading: boolean = false;
  private patientRelationshipTypes: any = [];
  private selectedRelationshipType: any;
  private patientUuid: string;

  constructor(private patientRelationshipService: PatientRelationshipService,
    private patientRelationshipTypeService: PatientRelationshipTypeService,
    private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics) { }

  ngOnInit(): void {
    this.getPatient();
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Edit Patient Relationship Loaded', 'ngOnInit');
  }
  public showDialog(selectedRelative, relationshipsArr) {
    this.display = true;
    this.selectedRelative = selectedRelative;
    this.relationships = relationshipsArr;
    this.getRelationShipTypes();
  }

  public getRelationShipTypes(): void {
    let request = this.patientRelationshipTypeService.getRelationshipTypes();
    request.subscribe((relationshipTypes) => {
      if (relationshipTypes) {
        this.patientRelationshipTypes = relationshipTypes;
        this.selectedRelationshipType = _.find(relationshipTypes,
          (patientRelationshipType) => {
            let foundRelationshipType = new RelationshipType(patientRelationshipType);
            if (foundRelationshipType.uuid === this.selectedRelative.relationshipTypeUuId) {
              return foundRelationshipType;
            }
          });
      }

    });

  }

  public getPatient() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patientUuid = patient.person.uuid;
        }
      });
  }

  public updateRelationship() {
    this.isLoading = true;
    _.find(this.relationships, (relationship) => {
      let relative = new Relationship(relationship);
      console.log('relationship in find loop is ', relative.uuid);
      if (this.selectedRelative.relatedPersonUuid === relative.relatedPersonUuid) {
        let patientRelationshipPayload = {
          relationshipType: this.selectedRelationshipType.uuid
        };
        this.patientRelationshipService.updateRelationship(relative.uuid,
          patientRelationshipPayload).subscribe(
          (success) => {
            if (success) {
              this.displaySuccessAlert('Relationship updated successfully');
            }
          },
          (error) => {
            this.isLoading = false;
            console.error('The request failed because of the following ', error);
            this.displayErrorAlert('The system encountered an error while updating relationship');
          });
      }
    });
  }

  public cancelRelationship() {
    this.isLoading = false;
    this.display = false;
  }


  public displaySuccessAlert(message) {
    this.showSuccessAlert = true;
    this.successAlert = message;
    this.isLoading = false;
    setTimeout(() => {
      this.display = false;
      this.showSuccessAlert = false;
      this.patientService.fetchPatientByUuid(this.patientUuid);
    }, 3000);
  }


  public displayErrorAlert(message) {
    this.showErrorAlert = true;
    this.errorAlert = message;
  }
}

