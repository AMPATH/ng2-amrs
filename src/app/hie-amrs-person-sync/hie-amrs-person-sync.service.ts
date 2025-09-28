import { Injectable } from '@angular/core';
import { HieClient, HieIdentificationType } from '../models/hie-registry.model';
import { forkJoin, Observable, of } from 'rxjs';
import { IdentifierTypesUuids } from '../constants/identifier-types';
import { HieToAmrsPersonAdapter } from '../utils/hei-to-amrs-patient.adapter';
import { Patient } from '../models/patient.model';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { PatientIdentifier } from '../models/patient-identifier.model';
import { CreatePersonDto } from '../interfaces/person.interface';
import { PersonResourceService } from '../openmrs-api/person-resource.service';

@Injectable({
  providedIn: 'root'
})
export class HieClientAmrsPersonSyncService {
  private hieIdentifiers = [
    HieIdentificationType.SHANumber,
    HieIdentificationType.NationalID,
    HieIdentificationType.HouseholdNumber,
    HieIdentificationType.Cr,
    HieIdentificationType.RefugeeID,
    HieIdentificationType.MandateNumber,
    HieIdentificationType.AlienID,
    HieIdentificationType.TemporaryDependantID
  ];

  constructor(
    private hieToAmrsPersonAdapter: HieToAmrsPersonAdapter,
    private patientResourceService: PatientResourceService,
    private personResourceService: PersonResourceService
  ) {}

  syncPatientIdentifiers(
    hieDataToSync: string[],
    hieClient: HieClient,
    patient: Patient,
    identifierLocation: string
  ) {
    // this.displayLoader('Syncing patient identifiers...');
    const reqObs$: Observable<any>[] = [];
    const dataToSync = hieDataToSync.filter((d: HieIdentificationType) => {
      return this.hieIdentifiers.includes(d);
    });

    for (const d of dataToSync) {
      if (d === HieIdentificationType.Cr) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      } else if (d === HieIdentificationType.SHANumber) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.SHA_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      } else if (d === HieIdentificationType.HouseholdNumber) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      } else if (d === HieIdentificationType.RefugeeID) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.REFUGEE_ID_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      } else if (d === HieIdentificationType.AlienID) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.ALIEN_ID_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      } else if (d === HieIdentificationType.MandateNumber) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.MANDATE_NUMBER_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      } else if (d === HieIdentificationType.NationalID) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.NATIONAL_ID_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      } else if (d === HieIdentificationType.TemporaryDependantID) {
        reqObs$.push(
          this.handleIdentifierUpdate(
            IdentifierTypesUuids.TEMPORARY_DEPENDANT_ID_UUID,
            this.hieToAmrsPersonAdapter.getHieIdentifierByName(d, hieClient),
            patient,
            identifierLocation
          )
        );
      }
    }
    if (reqObs$.length > 0) {
      return forkJoin(reqObs$);
    } else {
      return of(null);
    }
  }

  handleIdentifierUpdate(
    identifierTypeUuid: string,
    identifier: string,
    patient: Patient,
    identifierLocation: string
  ) {
    // check if patient has existing identifier
    if (
      this.getCommonIdentifier(identifierTypeUuid, patient) ||
      this.hasIdentifier(identifierTypeUuid, patient)
    ) {
      const selectedIdentifier = this.getIdentifier(
        identifierTypeUuid,
        patient
      );
      return this.updatePatientIdentifier(
        patient.uuid,
        selectedIdentifier.uuid,
        {
          identifier: identifier,
          location: selectedIdentifier.location.uuid || '',
          identifierType: identifierTypeUuid
        }
      );
    } else {
      // if not create a new one
      return this.createPatientIdentifier({
        patientUuid: patient.uuid,
        identifier: {
          identifier: identifier,
          location: identifierLocation,
          identifierTypeUuid: identifierTypeUuid
        }
      });
    }
  }
  createPatientIdentifier(createIdentifierPayload: {
    patientUuid: string;
    identifier: {
      identifier: string;
      location: string;
      identifierTypeUuid: string;
    };
  }) {
    const identifierPayload = {
      identifier: createIdentifierPayload.identifier.identifier,
      location: createIdentifierPayload.identifier.location,
      identifierType: createIdentifierPayload.identifier.identifierTypeUuid
    };
    return this.patientResourceService.saveUpdatePatientIdentifier(
      createIdentifierPayload.patientUuid,
      '',
      identifierPayload
    );
  }
  getIdentifier(identifierTypeUuid: string, patient) {
    let identifier = null;
    if ('identifier' in patient) {
      identifier = patient.identifier.find((id: PatientIdentifier) => {
        return id.identifierType.uuid === identifierTypeUuid;
      });
    }
    if (patient._identifier) {
      identifier = patient._identifier.find((id: PatientIdentifier) => {
        return id.identifierType.uuid === identifierTypeUuid;
      });
    }

    return identifier;
  }

  getCommonIdentifier(identifierTypeUuid: string, patient: Patient) {
    const commonIdentifiers = patient.commonIdentifiers as any;
    if (!commonIdentifiers) {
      return false;
    }
    if (identifierTypeUuid === IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID) {
      return this.checkIdentifierValue(commonIdentifiers.cr || null);
    } else if (
      identifierTypeUuid === IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID
    ) {
      return this.checkIdentifierValue(commonIdentifiers.hhNo);
    } else if (identifierTypeUuid === IdentifierTypesUuids.SHA_UUID) {
      return this.checkIdentifierValue(commonIdentifiers.sha);
    } else if (identifierTypeUuid === IdentifierTypesUuids.REFUGEE_ID_UUID) {
      return this.checkIdentifierValue(commonIdentifiers.refugeeId);
    } else if (identifierTypeUuid === IdentifierTypesUuids.ALIEN_ID_UUID) {
      return this.checkIdentifierValue(commonIdentifiers.alienId);
    } else if (
      identifierTypeUuid === IdentifierTypesUuids.MANDATE_NUMBER_UUID
    ) {
      return this.checkIdentifierValue(commonIdentifiers.mandateNumber);
    } else if (identifierTypeUuid === IdentifierTypesUuids.NATIONAL_ID_UUID) {
      return this.checkIdentifierValue(commonIdentifiers.kenyaNationalId);
    } else {
      return false;
    }
  }
  checkIdentifierValue(identifierValue: any) {
    if (!identifierValue) {
      return false;
    } else {
      return true;
    }
  }
  hasIdentifier(identifierTypeUuid: string, patient: Patient) {
    return (patient.identifiers as any).some((id: PatientIdentifier) => {
      return id.identifierType.uuid === identifierTypeUuid;
    });
  }
  updatePatientIdentifier(
    patientUuid: string,
    identifierUuid: string,
    identifierPayload: {
      identifier: string;
      location: string;
      identifierType: string;
    }
  ) {
    return this.patientResourceService.saveUpdatePatientIdentifier(
      patientUuid,
      identifierUuid,
      identifierPayload
    );
  }
  syncPersonAttributes(
    hieDataToSync: string[],
    hieClient: HieClient,
    patient: Patient
  ) {
    const attributePayload: CreatePersonDto = this.hieToAmrsPersonAdapter.generateAmrsPersonPayload(
      hieClient,
      hieDataToSync
    );
    if (Object.keys(attributePayload).length > 0) {
      return this.updatePersonAttributes({
        patientUuid: patient.uuid,
        payload: attributePayload
      });
    } else {
      return of(null);
    }
  }
  private updatePersonAttributes(updatePersonAttributePayload: {
    patientUuid: string;
    payload: any;
  }) {
    const { patientUuid, payload } = updatePersonAttributePayload;
    return this.personResourceService.saveUpdatePerson(patientUuid, payload);
  }
  public getErrorMsgFromErrorResponseMsg(error: any) {
    let errMsg = '';
    if (error && error.error) {
      if (error.error.error && error.error.error.globalErrors) {
        const globalErrors = (error.error.error.globalErrors as string[]) || [];
        globalErrors.forEach((g: any) => {
          errMsg += `${g.message} ,\n`;
        });
      } else if (error.error.error) {
        errMsg = error.error.error.message;
      } else if (error.error.message) {
        errMsg = error.error.message;
      }
    } else if (error.message) {
      errMsg = error.message;
    } else {
      errMsg = 'Something went wrong! Please try again or contact support';
    }

    return errMsg;
  }
}
