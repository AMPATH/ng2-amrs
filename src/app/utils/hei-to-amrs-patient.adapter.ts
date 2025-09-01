import { Injectable } from '@angular/core';
import {
  HieAmrsObj,
  HieClient,
  HieIdentifications
} from '../models/hie-registry.model';
import { Patient } from '../models/patient.model';
import * as moment from 'moment';
import { TitleCasePipe } from '@angular/common';
import { IdentifierTypesUuids } from '../constants/identifier-types';
import { CivilStatusUids } from '../constants/civil-status-concepts.contants';

@Injectable({
  providedIn: 'root'
})
export class HieToAmrsPersonAdapter {
  private titleCasePipe = new TitleCasePipe();
  private excludedFields = [
    'originSystem',
    'meta',
    'other_identifications',
    'resourceType'
  ];
  private personAttributes = [
    'first_name',
    'middle_name',
    'last_name',
    'gender',
    'date_of_birth'
  ];

  getAmrsValue(attribute: string, patient: Patient): string | number {
    let val: string | number = '';
    switch (attribute) {
      case 'first_name':
        val = patient ? patient.person.preferredName['givenName'] : '';
        break;
      case 'middle_name':
        val = patient ? patient.person.preferredName['middleName'] : '';
        break;
      case 'last_name':
        val = patient ? patient.person.preferredName['familyName'] : '';
        break;
      case 'gender':
        val = patient ? (patient.person.gender === 'Male' ? 'M' : 'F') : '';
        break;
      case 'date_of_birth':
        val = patient
          ? moment(String(patient.person.birthdate)).format('YYYY-MM-DD')
          : '';
        break;
      case 'deceased_datetime':
        val = patient ? String(patient.person.deathDate) : '';
        break;
      case 'phone':
        val = patient ? patient.person.patientPhoneNumber : '';
        break;
      case 'grade_level':
        val = patient ? patient.person.levelOfEducation : '';
        break;
      case 'is_alive':
        val = patient ? (patient.person.dead === true ? 0 : 1) : '';
        break;
      case 'id':
        val = this.getIdentifierValue(
          IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID,
          patient
        );
        break;
      case 'SHA Number':
        val = this.getIdentifierValue(IdentifierTypesUuids.SHA_UUID, patient);
        break;
      case 'Household Number':
        val = this.getIdentifierValue(
          IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID,
          patient
        );
        break;
      default:
        val = '';
    }

    return val;
  }
  getIdentifierValue(identifierTypeUuid: string, patient: Patient) {
    return this.getIdentifier(identifierTypeUuid, patient) !== undefined
      ? this.getIdentifier(identifierTypeUuid, patient).identifier
      : '';
  }
  getIdentifier(identifierTypeUuid: string, patient: Patient) {
    if (patient && patient._identifier) {
      const identifier = patient._identifier.find((id) => {
        return id.identifierType.uuid === identifierTypeUuid;
      });
      return identifier;
    } else {
      return undefined;
    }
  }
  generateAmrsHiePatientData(hieClient: HieClient, patient: Patient | null) {
    const identificationData = this.generateIdentificationData(
      hieClient.other_identifications,
      patient
    );
    const other: HieAmrsObj[] = Object.keys(hieClient)
      .filter((k) => {
        return !this.excludedFields.includes(k);
      })
      .map((k) => {
        return {
          key: k,
          title: this.titleCasePipe.transform(k === 'id' ? 'CR' : k),
          hieValue: hieClient[k],
          amrsValue: this.getAmrsValue(k, patient)
        };
      });
    const res = [...identificationData, ...other];
    return res;
  }
  generateIdentificationData(
    hieIds: HieIdentifications[],
    patient: Patient
  ): HieAmrsObj[] {
    return hieIds.map((identification) => {
      return {
        key: identification.identification_type,
        title: this.titleCasePipe.transform(identification.identification_type),
        hieValue: identification.identification_number,
        amrsValue: this.getAmrsValue(
          identification.identification_type,
          patient
        )
      };
    });
  }

  generateAmrsPersonAttributeData(
    hieClient: HieClient,
    patient: Patient,
    hieFields: string[]
  ) {
    const attributePayload = {};
    const namesAttribute = {};
    hieFields
      .filter((d) => {
        return this.personAttributes.includes(d);
      })
      .forEach((d) => {
        if (d === 'first_name') {
          namesAttribute['givenName'] = hieClient.first_name;
        }
        if (d === 'middle_name') {
          namesAttribute['middleName'] = hieClient.middle_name;
        }
        if (d === 'last_name') {
          namesAttribute['familyName'] = hieClient.last_name;
        }
        if (d === 'gender') {
          attributePayload['gender'] = hieClient.gender === 'Male' ? 'M' : 'F';
        }
        if (d === 'date_of_birth') {
          attributePayload['birthdate'] = hieClient.date_of_birth;
        }
        if (d === 'is_alive') {
          attributePayload['dead'] = hieClient.is_alive === 0 ? true : false;
        }
        if (d === 'deceased_datetime') {
          attributePayload['deathDate'] = hieClient.deceased_datetime;
        }
      });
    if (Object.keys(namesAttribute).length > 0) {
      if (!namesAttribute['givenName']) {
        namesAttribute['givenName'] = patient.person.preferredName['givenName'];
      }
      if (!namesAttribute['middleName']) {
        namesAttribute['middleName'] =
          patient.person.preferredName['middleName'];
      }
      if (!namesAttribute['last_name']) {
        namesAttribute['familyName'] =
          patient.person.preferredName['familyName'];
      }
      attributePayload['names'] = [namesAttribute];
    }
    return attributePayload;
  }
  getAmrsConceptUuidFromField(fieldName: string): string {
    let conceptUuid = '';
    switch (fieldName) {
      case 'Divorced':
        conceptUuid = CivilStatusUids.DIVORCED_UUID;
        break;
      case 'Married':
        conceptUuid = CivilStatusUids.MARRIED_UUID;
        break;
      case 'Single':
        conceptUuid = CivilStatusUids.NEVER_MARRIED_UUID;
        break;
      default:
        conceptUuid = CivilStatusUids.NOT_APPLICABLE_UUID;
    }
    return conceptUuid;
  }
}
