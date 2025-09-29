import { take } from 'rxjs/operators/take';
import { PatientService } from '../../services/patient.service';
import { PatientRelationshipService } from './patient-relationship.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { Relationship } from '../../../models/relationship.model';
import { PatientIdentifierResourceService } from 'src/app/openmrs-api/patient-identifier-resource.service';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { PatientIdentifier } from '../../../models/patient-identifier.model';
import { IdentifierTypesUuids } from '../../../constants/identifier-types';
import { Router } from '@angular/router';

@Component({
  selector: 'patient-relationships',
  templateUrl: './patient-relationships.component.html',
  styleUrls: ['./patient-relationships.component.css']
})
export class PatientRelationshipsComponent implements OnInit, OnDestroy {
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
  public mappedRelationships = [];
  private patientIdentifiersMap = new Map<string, PatientIdentifier>();
  private patientMap = new Map<string, boolean>();
  private destroy$ = new Subject<boolean>();

  constructor(
    private patientService: PatientService,
    private patientRelationshipService: PatientRelationshipService,
    private patientIdentifierResourceService: PatientIdentifierResourceService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getPatientRelationships();
  }

  public ngOnDestroy(): void {
    this.patientMap.clear();
    this.patientIdentifiersMap.clear();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public getPatientRelationships(): void {
    this.loadingRelationships = true;
    this.patientService.currentlyLoadedPatient
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (patient) => {
          if (patient !== null) {
            this.patientUuid = patient.person.uuid;
            const request = this.patientRelationshipService.getRelationships(
              this.patientUuid
            );
            request.pipe(take(1)).subscribe((relationships) => {
              if (relationships) {
                this.relationships = relationships;
                this.getPatientIdentifiers(this.relationships);
                this.loadingRelationships = false;
              }
            });
          }
        },
        (err) => {
          this.loadingRelationships = false;
          this.errors.push({
            id: 'patient',
            message: 'error fetching patient'
          });
        }
      );
  }

  public voidRelationship() {
    if (this.selectedRelationshipUuid) {
      this.patientRelationshipService
        .voidRelationship(this.selectedRelationshipUuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (success) => {
            this.patientService.reloadCurrentPatient();
            this.displayConfirmDialog = false;
            this.displaySuccessAlert('Relationship deleted successfully');
          },
          (error) => {
            console.error(
              'The request failed because of the following ',
              error
            );
            this.displayErrorAlert(
              'Error!',
              'System encountered an error while deleting the relationship. Please retry.'
            );
          }
        );
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

  public displayErrorAlert(errorTitle: string, errorMessage: string) {
    this.showErrorAlert = true;
    this.errorAlert = errorMessage;
    this.errorTitle = errorTitle;
    setTimeout(() => {
      this.showErrorAlert = false;
    }, 3000);
  }
  private generateMappedRelationships(): void {
    this.mappedRelationships = this.addPersonAttributes(this.relationships);
  }
  private addPersonAttributes(relationships: Relationship[]) {
    return relationships.map((rel) => {
      const personUuid = rel.relatedPersonUuid;
      return {
        relationshipType: rel.relationshipType,
        display: rel.display,
        uuid: rel.uuid,
        relatedPersonUuid: rel.relatedPersonUuid,
        cr: this.getAttributeByName('CR Number', rel.relatedPerson.attributes),
        crIdentifier: this.patientIdentifiersMap.has(personUuid)
          ? this.patientIdentifiersMap.get(personUuid).identifier
          : '',
        isPatient: this.patientMap.has(personUuid)
      };
    });
  }
  private getAttributeByName(name: string, attributes: any): string | null {
    const attribute = attributes.find((attr) => {
      return attr && attr.display ? attr.display.includes(name) : false;
    });
    if (attribute) {
      return attribute.display.split('=')[1] || '';
    }
    return null;
  }
  public registerOnAfyaYangu() {
    window.open('https://afyayangu.go.ke/', '_blank');
  }
  private getPatientIdentifier(patientUuid: string) {
    return this.patientIdentifierResourceService
      .getPatientIdentifiers(patientUuid)
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (res) {
            this.generatePatientCrIdentifierMap(res, patientUuid);
            this.patientMap.set(patientUuid, true);
          }
        })
      );
  }
  private getPatientIdentifiers(relationShips: Relationship[]) {
    const patientUuids = relationShips.map((rel) => {
      return rel.relatedPersonUuid;
    });
    const identifiersArr$: Observable<any>[] = [];
    for (const patientUuid of patientUuids) {
      identifiersArr$.push(this.getPatientIdentifier(patientUuid));
    }
    forkJoin(identifiersArr$)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.generateMappedRelationships();
        })
      )
      .subscribe();
  }
  private generatePatientCrIdentifierMap(
    results: PatientIdentifier[],
    patientUuid: string
  ): void {
    const crIdentifier = this.getCrIdentifierFromIdentifiers(results);
    if (crIdentifier) {
      this.patientIdentifiersMap.set(patientUuid, crIdentifier);
    }
  }
  private getCrIdentifierFromIdentifiers(
    identifiers: PatientIdentifier[]
  ): PatientIdentifier {
    return identifiers.find((id) => {
      return (
        id.identifierType.uuid === IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID
      );
    });
  }
  public navigateToPatientRegistration() {
    this.router.navigate([
      '/patient-dashboard/patient-search/patient-registration'
    ]);
  }
}
