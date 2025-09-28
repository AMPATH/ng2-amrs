import { Injectable } from '@angular/core';
import {
  HieAmrsObj,
  HieClient,
  HieClientDependant,
  HieDependant,
  HieIdentifications,
  HieIdentificationType
} from '../models/hie-registry.model';
import { Patient } from '../models/patient.model';
import * as moment from 'moment';
import { TitleCasePipe } from '@angular/common';
import { IdentifierTypesUuids } from '../constants/identifier-types';
import { CivilStatusUids } from '../constants/civil-status-concepts.contants';
import { PersonAttributeTypeUuids } from '../constants/attribute-types.constants';
import { RelationshipTypeUuids } from '../constants/relationship-types';
import { CreateRelationshipDto } from '../interfaces/relationship.interface';
import { PersonAttribute } from '../models/person-attribute.model';
import { Person } from '../models/person.model';
import { CreatePersonDto } from '../interfaces/person.interface';

@Injectable({
  providedIn: 'root'
})
export class HieToAmrsPersonAdapter {
  private titleCasePipe = new TitleCasePipe();

  private nameFields = ['first_name', 'middle_name', 'last_name'];
  private attributeFields = ['phone', 'email', 'civil_status'];
  private addressFields = [
    'country',
    'county',
    'sub_county',
    'ward',
    'village_estate',
    'longitude',
    'latitude'
  ];
  private otherFields = ['gender', 'date_of_birth'];
  private identifierFields = [
    HieIdentificationType.Cr,
    HieIdentificationType.SHANumber,
    HieIdentificationType.HouseholdNumber,
    HieIdentificationType.RefugeeID,
    HieIdentificationType.MandateNumber,
    HieIdentificationType.AlienID,
    HieIdentificationType.NationalID
  ];
  private hieAmrsSyncFields = [
    ...this.identifierFields,
    ...this.nameFields,
    ...this.attributeFields,
    ...this.addressFields
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
      case HieIdentificationType.Cr:
        val = this.getIdentifierValue(
          IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID,
          patient
        );
        break;
      case HieIdentificationType.SHANumber:
        val = this.getIdentifierValue(IdentifierTypesUuids.SHA_UUID, patient);
        break;
      case HieIdentificationType.HouseholdNumber:
        val = this.getIdentifierValue(
          IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID,
          patient
        );
        break;
      case HieIdentificationType.RefugeeID:
        val = this.getIdentifierValue(
          IdentifierTypesUuids.REFUGEE_ID_UUID,
          patient
        );
        break;
      case HieIdentificationType.MandateNumber:
        val = this.getIdentifierValue(
          IdentifierTypesUuids.MANDATE_NUMBER_UUID,
          patient
        );
        break;
      case HieIdentificationType.AlienID:
        val = this.getIdentifierValue(
          IdentifierTypesUuids.ALIEN_ID_UUID,
          patient
        );
        break;
      case HieIdentificationType.NationalID:
        val = this.getIdentifierValue(
          IdentifierTypesUuids.NATIONAL_ID_UUID,
          patient
        );
        break;
      case 'ward':
        val = patient ? this.getAddressValue('ward', patient.person) : '';
        break;
      case 'country':
        val = patient ? this.getAddressValue('country', patient.person) : '';
        break;
      case 'county':
        val = patient ? this.getAddressValue('county', patient.person) : '';
        break;
      case 'sub_county':
        val = patient ? this.getAddressValue('sub_county', patient.person) : '';
        break;
      case 'village_estate':
        val = patient
          ? this.getAddressValue('village_estate', patient.person)
          : '';
        break;
      case 'longitude':
        val = patient ? this.getAddressValue('longitude', patient.person) : '';
        break;
      case 'latitude':
        val = patient ? this.getAddressValue('latitude', patient.person) : '';
        break;
      default:
        val = '';
    }

    return val;
  }
  getAddressValue(addressType: string, person: Person) {
    let val = '';
    if (!person) {
      return val;
    }
    const address = person.preferredAddress as any;
    if (!address) {
      return val;
    }
    if (addressType === 'country') {
      val = address.country || '';
    }
    if (addressType === 'county') {
      val = address.countyDistrict || '';
    }
    if (addressType === 'sub_county') {
      val = address.address2 || '';
    }
    if (addressType === 'ward') {
      val = address.address7 || '';
    }
    if (addressType === 'village_estate') {
      val = address.cityVillage || '';
    }
    if (addressType === 'longitude') {
      val = address.longitude || '';
    }
    if (addressType === 'latitude') {
      val = address.latitude || '';
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
    identifierName: HieIdentificationType,
    hieCleint: HieClient
  ): string | null {
    if (identifierName === HieIdentificationType.Cr) {
      return hieCleint.id;
    }
    const otherMainIds = [
      HieIdentificationType.RefugeeID,
      HieIdentificationType.MandateNumber,
      HieIdentificationType.AlienID,
      HieIdentificationType.NationalID
    ];
    if (otherMainIds.includes(identifierName)) {
      return hieCleint.identification_number;
    }
    const identifier = hieCleint.other_identifications.find((d) => {
      return d.identification_type === identifierName;
    });
    return identifier !== undefined ? identifier.identification_number : null;
  }
  generateAmrsHiePatientData(hieClient: HieClient, patient: Patient | null) {
    const identificationData = this.generateIdentificationData(
      hieClient.other_identifications,
      patient
    );
    const mainIdentificationData = this.generateIdentificationData(
      [
        {
          identification_type: HieIdentificationType.Cr,
          identification_number: hieClient.id
        },
        {
          identification_type: hieClient.identification_type,
          identification_number: hieClient.identification_number
        }
      ],
      patient
    );
    const nameData = this.getNameAttributeData(hieClient, patient);
    const otherFields = this.getOtherFields(hieClient, patient);
    const addressData = this.getAddressData(hieClient, patient);
    let attributeData = [];
    if (patient) {
      attributeData = this.getPersonAttributeData(hieClient, patient.person);
    }

    const res = [
      ...identificationData,
      ...mainIdentificationData,
      ...nameData,
      ...otherFields,
      ...attributeData,
      ...addressData
    ];
    return res;
  }

  private getNameAttributeData(hieClient: HieClient, patient: Patient | null) {
    return this.getNormalAmrsHieData(this.nameFields, hieClient, patient);
  }
  private getAddressData(hieClient: HieClient, patient: Patient | null) {
    return this.getNormalAmrsHieData(this.addressFields, hieClient, patient);
  }
  private getOtherFields(hieClient: HieClient, patient: Patient | null) {
    return this.getNormalAmrsHieData(this.otherFields, hieClient, patient);
  }
  private getNormalAmrsHieData(
    fieldArray: string[],
    hieClient: HieClient,
    patient: Patient
  ) {
    return fieldArray.map((k) => {
      return {
        key: k,
        title: this.titleCasePipe.transform(k),
        hieValue: hieClient[k],
        amrsValue: patient ? this.getAmrsValue(k, patient) : ''
      };
    });
  }
  private getPersonAttributeData(hieClient: HieClient, person: any) {
    const personAttributes = person.attributes as PersonAttribute[];
    const attr = [];
    personAttributes.forEach((pa: any) => {
      if (pa.attributeType && pa.attributeType.uuid) {
        if (
          pa.attributeType.uuid === PersonAttributeTypeUuids.PLACE_OF_BIRTH_UUID
        ) {
          attr.push({
            key: 'place_of_birth',
            title: 'Place of birth',
            hieValue: this.titleCasePipe.transform(hieClient.place_of_birth),
            amrsValue: this.titleCasePipe.transform(pa.value as any)
          });
        }
        if (pa.attributeType.uuid === PersonAttributeTypeUuids.EMAIL_UUID) {
          attr.push({
            key: 'email',
            title: 'Email',
            hieValue: this.titleCasePipe.transform(hieClient.email),
            amrsValue: this.titleCasePipe.transform(pa.value)
          });
        }
      }
    });
    return attr;
  }
  private generateIdentificationData(
    hieIds: HieIdentifications[],
    patient?: Patient
  ): HieAmrsObj[] {
    return hieIds.map((identification) => {
      return {
        key: identification.identification_type,
        title: this.titleCasePipe.transform(
          identification.identification_type === 'id'
            ? 'CR'
            : identification.identification_type
        ),
        hieValue: identification.identification_number,
        amrsValue: this.getAmrsValue(
          identification.identification_type,
          patient
        )
      };
    });
  }

  generateAmrsPersonPayload(
    hieClient: HieClient,
    hieFields?: string[]
  ): CreatePersonDto {
    const createPersonPayload: CreatePersonDto = {};
    const namesAttribute = {};
    const addresses = {};
    const attributes = [];
    const fieldsToUse = hieFields ? hieFields : this.hieAmrsSyncFields;
    fieldsToUse.forEach((d) => {
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
        createPersonPayload['gender'] = hieClient.gender === 'Male' ? 'M' : 'F';
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
        addresses['countyDistrict'] = hieClient.county;
      }
      if (d === 'sub_county' && hieClient.sub_county.length > 0) {
        addresses['address2'] = hieClient.sub_county;
        addresses['stateProvince'] = hieClient.sub_county;
      }
      if (d === 'ward' && hieClient.sub_county.length > 0) {
        addresses['address7'] = hieClient.sub_county;
        addresses['address4'] = hieClient.sub_county;
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
      if (d === 'place_of_birth' && hieClient.place_of_birth.length > 0) {
        attributes.push({
          value: this.titleCasePipe.transform(hieClient.place_of_birth),
          attributeType: PersonAttributeTypeUuids.PLACE_OF_BIRTH_UUID
        });
      }
      if (d === 'phone' && hieClient.phone.length > 0) {
        attributes.push({
          value: hieClient.phone,
          attributeType: PersonAttributeTypeUuids.CONTACT_PHONE_NUMBER_UUID
        });
      }
      if (d === 'email' && hieClient.email.length > 0) {
        attributes.push({
          value: hieClient.email,
          attributeType: PersonAttributeTypeUuids.CONTACT_EMAIL_ADDRESS_UUID
        });
      }
      if (d === 'kra_pin' && hieClient.kra_pin.length > 0) {
        attributes.push({
          value: hieClient.kra_pin,
          attributeType: PersonAttributeTypeUuids.KRA_PIN_UUID
        });
      }
      if (d === 'civil_status' && hieClient.civil_status.length > 0) {
        attributes.push({
          value: this.getAmrsConceptUuidFromField(hieClient.civil_status),
          attributeType: PersonAttributeTypeUuids.CIVIL_STATUS_UUID
        });
      }
      if (d === 'id' && hieClient.id) {
        attributes.push({
          value: hieClient.id,
          attributeType: PersonAttributeTypeUuids.CLIENT_REGISTRY_ID_UUID
        });
      }
    });
    if (Object.keys(namesAttribute).length > 0) {
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
  getAmrsCountryFromHieCitizenship(citizenship: string) {
    let country = '';
    switch (citizenship) {
      case 'KENYAN':
        country = 'Kenya';
        break;
      case 'UGANDAN':
        country = 'Uganda';
        break;
      case 'TANZANIAN':
        country = 'Tanzania';
        break;
      case 'ETHIOPIAN':
        country = 'Ethiopia';
        break;
      case 'SOMALI':
        country = 'Somali';
        break;
      case 'FOREIGN NATIONAL':
        country = 'FOREIGN NATIONAL';
        break;
      default:
        country = 'Kenya';
    }

    return country;
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
