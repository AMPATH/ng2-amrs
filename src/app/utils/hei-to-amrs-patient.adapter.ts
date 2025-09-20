import { Injectable } from '@angular/core';
import {
  HieAmrsObj,
  HieClient,
  HieClientDependant,
  HieDependant,
  HieIdentifications
} from '../models/hie-registry.model';
import { Patient } from '../models/patient.model';
import * as moment from 'moment';
import { TitleCasePipe } from '@angular/common';
import { IdentifierTypesUuids } from '../constants/identifier-types';
import { CivilStatusUids } from '../constants/civil-status-concepts.contants';
import { PersonAttributeTypeUuids } from '../constants/attribute-types.constants';
import { RelationshipTypeUuids } from '../constants/relationship-types';
import { CreateRelationshipDto } from '../interfaces/relationship.interface';

@Injectable({
  providedIn: 'root'
})
export class HieToAmrsPersonAdapter {
  private titleCasePipe = new TitleCasePipe();
  private primaryFields = [
    'id',
    'first_name',
    'middle_name',
    'last_name',
    'gender',
    'date_of_birth',
    'place_of_birth',
    'is_alive',
    'deceased_datetime',
    'citizenship',
    'civil_status',
    'phone',
    'email',
    'sub_county',
    'county',
    'country'
  ];
  private personAttributes = [
    'first_name',
    'middle_name',
    'last_name',
    'gender',
    'date_of_birth',
    'is_alive',
    'deceased_datetime',
    'country',
    'place_of_birth',
    'county',
    'sub_county',
    'ward',
    'village_estate',
    'longitude',
    'latitude',
    'phone',
    'email',
    'civil_status',
    'id'
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
        val = patient
          ? patient.person.gender === 'M'
            ? 'Male'
            : 'Female'
          : '';
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
      case 'Refugee ID':
        val = this.getIdentifierValue(
          IdentifierTypesUuids.REFUGEE_ID_UUID,
          patient
        );
        break;
      case 'Mandate Number':
        val = this.getIdentifierValue(
          IdentifierTypesUuids.MANDATE_NUMBER_UUID,
          patient
        );
        break;
      case 'Alien ID':
        val = this.getIdentifierValue(
          IdentifierTypesUuids.ALIEN_ID_UUID,
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
  getHieIdentifierByName(
    identifierName: string,
    hieCleint: HieClient
  ): string | null {
    if (identifierName === 'id') {
      return hieCleint.id;
    }
    if (identifierName === 'Refugee ID') {
      return hieCleint.identification_number;
    }
    if (identifierName === 'Mandate Number') {
      return hieCleint.identification_number;
    }
    if (identifierName === 'Alien ID') {
      return hieCleint.identification_number;
    }
    const identifier = hieCleint.other_identifications.find((d) => {
      return d.identification_type === identifierName;
    });
    return identifier !== undefined ? identifier.identification_number : null;
  }
  generateAmrsHiePatientData(hieClient: HieClient, patient: Patient | null) {
    const identificationData = this.generateIdentificationData(
      hieClient.other_identifications
    );
    const mainIdentificationData = this.generateIdentificationData([
      {
        identification_type: hieClient.identification_type,
        identification_number: hieClient.identification_number
      }
    ]);
    const other: HieAmrsObj[] = Object.keys(hieClient)
      .filter((k) => {
        return this.primaryFields.includes(k);
      })
      .map((k) => {
        return {
          key: k,
          title: this.titleCasePipe.transform(k === 'id' ? 'CR' : k),
          hieValue: hieClient[k],
          amrsValue: this.getAmrsValue(k, patient)
        };
      });
    const res = [...identificationData, ...mainIdentificationData, ...other];
    return res;
  }
  generateIdentificationData(hieIds: HieIdentifications[]): HieAmrsObj[] {
    return hieIds.map((identification) => {
      return {
        key: identification.identification_type,
        title: this.titleCasePipe.transform(identification.identification_type),
        hieValue: identification.identification_number,
        amrsValue: null
      };
    });
  }

  generateAmrsPersonAttributeData(
    hieClient: HieClient,
    patient: Patient,
    hieFields: string[]
  ) {
    const createPersonPayload = {};
    const namesAttribute = {};
    const addresses = {};
    const attributes = [];
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
          createPersonPayload['gender'] =
            hieClient.gender === 'Male' ? 'M' : 'F';
        }
        if (d === 'date_of_birth') {
          createPersonPayload['birthdate'] = hieClient.date_of_birth;
          createPersonPayload['birthdateEstimated'] = false;
        }
        if (d === 'is_alive') {
          createPersonPayload['dead'] = hieClient.is_alive === 0 ? true : false;
        }
        if (d === 'deceased_datetime') {
          if (hieClient.deceased_datetime.length > 0) {
            createPersonPayload['deathDate'] = hieClient.deceased_datetime;
          }
        }
        if (d === 'country' && hieClient.country.length > 0) {
          addresses['country'] = hieClient.country;
          addresses['address1'] = hieClient.country;
        }
        if (d === 'place_of_birth' && hieClient.place_of_birth.length > 0) {
          addresses['address10'] = hieClient.place_of_birth;
        }
        if (d === 'county' && hieClient.county.length > 0) {
          // addresses['county'] = hieClient.county;
        }
        if (d === 'sub_county' && hieClient.sub_county.length > 0) {
          addresses['address2'] = hieClient.sub_county;
        }
        if (d === 'ward' && hieClient.sub_county.length > 0) {
          addresses['address7'] = hieClient.sub_county;
        }
        if (d === 'village_estate' && hieClient.village_estate.length > 0) {
          addresses['cityVillage'] = hieClient.village_estate;
        }
        if (d === 'longitude' && hieClient.longitude.length > 0) {
          addresses['longitude'] = hieClient.longitude;
        }
        if (d === 'latitude' && hieClient.latitude.length > 0) {
          addresses['latitude'] = hieClient.latitude;
        }
        if (d === 'phone') {
          attributes.push({
            value: hieClient.phone,
            attributeType: PersonAttributeTypeUuids.CONTACT_PHONE_NUMBER_UUID
          });
        }
        if (d === 'email') {
          attributes.push({
            value: hieClient.phone,
            attributeType: PersonAttributeTypeUuids.CONTACT_EMAIL_ADDRESS_UUID
          });
        }
        if (d === 'kra_pin') {
          attributes.push({
            value: hieClient.kra_pin,
            attributeType: PersonAttributeTypeUuids.KRA_PIN_UUID
          });
        }
        if (d === 'civil_status') {
          attributes.push({
            value: this.getAmrsConceptUuidFromField(hieClient.civil_status),
            attributeType: PersonAttributeTypeUuids.CIVIL_STATUS_UUID
          });
        }
        if (d === 'id') {
          attributes.push({
            value: hieClient.id,
            attributeType: PersonAttributeTypeUuids.CLIENT_REGISTRY_ID_UUID
          });
        }
      });
    if (Object.keys(namesAttribute).length > 0) {
      if (patient) {
        if (!namesAttribute['givenName']) {
          namesAttribute['givenName'] =
            patient.person.preferredName['givenName'];
        }
        if (!namesAttribute['middleName']) {
          namesAttribute['middleName'] =
            patient.person.preferredName['middleName'];
        }
        if (!namesAttribute['last_name']) {
          namesAttribute['familyName'] =
            patient.person.preferredName['familyName'];
        }
      }

      createPersonPayload['names'] = [namesAttribute];
    }
    if (Object.keys(addresses).length > 0) {
      createPersonPayload['addresses'] = [addresses];
    }
    if (attributes.length > 0) {
      createPersonPayload['attributes'] = attributes;
    }
    return createPersonPayload;
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
        conceptUuid = CivilStatusUids.SINGLE_UUID;
        break;
      default:
        conceptUuid = CivilStatusUids.NOT_APPLICABLE_UUID;
    }
    return conceptUuid;
  }
  generateHieDependantsArray(dependants: HieDependant[]): HieClientDependant[] {
    const deps = [];
    dependants.forEach((d) => {
      const dependant = d.result[0] || {};
      const dependantObj = {
        date_added: d.date_added,
        relationship: d.relationship,
        ...dependant
      };
      deps.push(dependantObj);
    });

    return deps;
  }
  getAmrsRelationshipTypeUuid(relationshipType: string) {
    let relationShipTypeUuid = '';
    switch (relationshipType) {
      case 'Spouse':
        relationShipTypeUuid = RelationshipTypeUuids.SPOUSE_UUID;
        break;
      case 'Child':
        relationShipTypeUuid = RelationshipTypeUuids.PARENT_CHILD_UUID;
        break;
      default:
        relationShipTypeUuid = RelationshipTypeUuids.OTHER_NON_CODED_UUID;
    }

    return relationShipTypeUuid;
  }
  getPatientRelationshipPayload(
    relationship: string,
    personAuuid: string,
    personBuUuid: string
  ): CreateRelationshipDto {
    const startDate = moment(new Date()).format('YYYY-MM-DD');
    const patientRelationshipPayload = {
      personA: personAuuid,
      relationshipType: this.getAmrsRelationshipTypeUuid(relationship),
      personB: personBuUuid,
      startDate: startDate
    };
    return patientRelationshipPayload;
  }
}
