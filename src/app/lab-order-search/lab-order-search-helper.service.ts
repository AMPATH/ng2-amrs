import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as Moment from 'moment';
import * as _ from 'underscore';

@Injectable()
export class LabOrdersSearchHelperService {
  constructor() {}

  public get orderTypes() {
    return [
      {
        type: 'DNAPCR',
        conceptUuid: 'a898fe80-1350-11df-a1f1-0026b9348838',
        display: 'DNA PCR'
      },

      {
        type: 'VL',
        conceptUuid: 'a8982474-1350-11df-a1f1-0026b9348838',
        display: 'Viral Load'
      },
      {
        type: 'CD4',
        conceptUuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
        display: 'CD4 Panel'
      },
      {
        type: 'HPV',
        conceptUuid: 'a8a46fd6-1350-11df-a1f1-0026b9348838',
        display: 'HPV'
      },
      {
        type: 'Other',
        conceptUuid: '',
        display: 'Others'
      }
    ];
  }
  public get hpvTestSampleTypes() {
    return [
      {
        id: 1,
        display: 'Cervical Swab'
      }
    ];
  }

  public get sampleTypes() {
    return [
      {
        id: 1,
        display: 'Frozen Plasma'
      },
      {
        id: 2,
        display: 'Whole blood'
      },
      {
        id: 3,
        display: 'DBS'
      }
    ];
  }

  public get labLocations() {
    return [
      {
        name: 'Alupe',
        value: 'alupe'
      },
      {
        name: 'Ampath',
        value: 'ampath'
      },
      {
        name: 'Busia',
        value: 'busia'
      }
    ];
  }

  public determineOrderType(order) {
    if (order === null || order === undefined) {
      return;
    }

    let foundType;
    _.each(this.orderTypes, (type) => {
      if (type.conceptUuid === order.concept.uuid) {
        foundType = type;
      }
    });

    if (foundType) {
      return foundType;
    }

    return {
      type: 'Other',
      conceptUuid: '',
      display: 'Other'
    };
  }

  public getViralLoadJustification(encounterObs) {
    const obsObject = this.findObsByConceptUuid(
      encounterObs,
      '0a98f01f-57f1-44b7-aacf-e1121650a967'
    );

    if (obsObject && obsObject !== null && obsObject.value) {
      if (typeof obsObject.value === 'object' && obsObject.value.uuid) {
        return obsObject.value.display;
      }

      return obsObject.value; // TODO - load justification base on uuid
    }

    return null;
  }

  public createDnaPcrPayload(
    order,
    encounterObs,
    encounterLocationUuid,
    patientIdentifier,
    patientName,
    sex,
    birthDate,
    dateRecieved
  ) {
    const infantProphylaxisUuid: string[] = this.findObsValueByConceptUuid(
      encounterObs,
      'a89addfe-1350-11df-a1f1-0026b9348838'
    );

    const pmtctInterventionUuid: string[] = this.findObsValueByConceptUuid(
      encounterObs,
      'a898bdc6-1350-11df-a1f1-0026b9348838'
    );

    const feedingTypeUuid: string[] = this.findObsValueByConceptUuid(
      encounterObs,
      'a89abee6-1350-11df-a1f1-0026b9348838'
    );

    const entryPointUuid: string[] = this.findObsValueByConceptUuid(
      encounterObs,
      'a8a17e48-1350-11df-a1f1-0026b9348838'
    );

    const motherHivStatusUuid: string[] = this.findObsValueByConceptUuid(
      encounterObs,
      'a8afb80a-1350-11df-a1f1-0026b9348838'
    );

    return {
      type: 'DNAPCR',
      locationUuid: encounterLocationUuid,
      orderNumber: order.orderNumber,
      providerIdentifier: order.orderer.identifier,
      patientName: patientName,
      patientIdentifier: patientIdentifier,
      sex: sex,
      birthDate: this.formatDate(birthDate),
      infantProphylaxisUuid: infantProphylaxisUuid,
      pmtctInterventionUuid: pmtctInterventionUuid,
      feedingTypeUuid: feedingTypeUuid,
      entryPointUuid: entryPointUuid,
      motherHivStatusUuid: motherHivStatusUuid,
      dateDrawn: this.formatDate(order.dateActivated),
      dateReceived: this.formatDate(dateRecieved)
    };
  }

  // function to create CD4 payload
  public createCD4Payload(
    order,
    encounterObs,
    encounterLocationUuid,
    patientIdentifier,
    patientName,
    sex,
    birthDate,
    dateRecieved
  ) {
    return {
      type: 'CD4',
      locationUuid: encounterLocationUuid,
      orderNumber: order.orderNumber,
      providerIdentifier: order.orderer.identifier,
      patientName: patientName,
      patientIdentifier: patientIdentifier,
      sex: sex,
      birthDate: this.formatDate(birthDate),
      dateDrawn: this.formatDate(order.dateActivated),
      dateReceived: this.formatDate(dateRecieved)
    };
  }

  public createHpvPayload(
    order: any,
    encounterObs: any,
    encounterLocationUuid: any,
    patientIdentifier: any,
    patientName: any,
    sex: any,
    birthDate: any,
    dateRecieved: any,
    sampleType: any,
    isPregnant = 0,
    breastfeeding = 0
  ) {
    const vlJustificationUuid: any = this.findObsValueByConceptUuid(
      encounterObs,
      '0a98f01f-57f1-44b7-aacf-e1121650a967'
    );

    return {
      type: 'HPV',
      locationUuid: encounterLocationUuid,
      orderNumber: order.orderNumber,
      providerIdentifier: order.orderer.identifier,
      patientName: patientName,
      patientIdentifier: patientIdentifier,
      sex: sex,
      birthDate: this.formatDate(birthDate),
      sampleType: sampleType,
      vlJustificationUuid: vlJustificationUuid,
      isPregnant: isPregnant,
      breastfeeding: breastfeeding,
      dateDrawn: this.formatDate(order.dateActivated),
      dateReceived: this.formatDate(dateRecieved)
    };
  }
  public createViralLoadPayload(
    order,
    encounterObs,
    encounterLocationUuid,
    patientIdentifier,
    patientName,
    sex,
    birthDate,
    dateRecieved,
    artStartDateInitial,
    artStartDateCurrent,
    sampleType,
    artRegimenIds,
    isPregnant = 0,
    breastfeeding = 0
  ) {
    const vlJustificationUuid: any = this.findObsValueByConceptUuid(
      encounterObs,
      '0a98f01f-57f1-44b7-aacf-e1121650a967'
    );

    return {
      type: 'VL',
      locationUuid: encounterLocationUuid,
      orderNumber: order.orderNumber,
      providerIdentifier: order.orderer.identifier,
      patientName: patientName,
      patientIdentifier: patientIdentifier,
      sex: sex,
      birthDate: this.formatDate(birthDate),
      artStartDateInitial: this.formatDate(artStartDateInitial),
      artStartDateCurrent: this.formatDate(artStartDateCurrent),
      sampleType: sampleType,
      artRegimenUuid: artRegimenIds,
      vlJustificationUuid: vlJustificationUuid,
      isPregnant: isPregnant,
      breastfeeding: breastfeeding,
      dateDrawn: this.formatDate(order.dateActivated),
      dateReceived: this.formatDate(dateRecieved)
    };
  }

  public formatDate(date) {
    const momentDate = Moment(date);
    return momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : '';
  }

  public findObsValueByConceptUuid(
    encounterObs,
    conceptUuid: string
  ): string[] {
    const obsObjectArray = this.findObsByConceptUuid(encounterObs, conceptUuid)
      ? this.findObsByConceptUuid(encounterObs, conceptUuid)
      : [];
    const valueArray: string[] = [];
    obsObjectArray.forEach((obsObject: any) => {
      if (obsObject && obsObject !== null && obsObject.value) {
        if (typeof obsObject.value === 'object' && obsObject.value.uuid) {
          valueArray.push(obsObject.value.uuid);
          return;
        }
        valueArray.push(obsObject.value);
        return;
      }
    });

    return valueArray;
  }

  // function to find the obs with given concept uuid
  public findObsByConceptUuid(obsObject: any, conceptUuid: string) {
    if (
      !obsObject ||
      obsObject === null ||
      !conceptUuid ||
      conceptUuid === null
    ) {
      return;
    }

    const found: any = [];
    this.findObsByConceptUuidRecursively(obsObject, conceptUuid, found);
    if (found.length > 0) {
      return _.uniq(found);
    }
  }

  public findObsByConceptUuidRecursively(
    obsObject,
    conceptUuid,
    foundArray: any
  ) {
    if (!Array.isArray(foundArray)) {
      foundArray = [];
    }

    if (_.isEmpty(obsObject)) {
      return;
    }

    if (Array.isArray(obsObject)) {
      _.each(obsObject, (obj) => {
        this.findObsByConceptUuidRecursively(obj, conceptUuid, foundArray);
        return;
      });
    }

    if (typeof obsObject === 'object') {
      if (obsObject.concept && obsObject.concept.uuid === conceptUuid) {
        foundArray.push(obsObject);
      } else {
        _.each(obsObject, (obj) => {
          this.findObsByConceptUuidRecursively(obj, conceptUuid, foundArray);
        });
      }
    }
  }

  public searchIdentifiers(identifiers: any) {
    if (identifiers.length > 0) {
      // return _identifier[0].display.split('=')[1];
      let filteredIdentifiers: any;
      const identifier = identifiers;
      const kenyaNationalId = this.getIdentifierByType(
        identifier,
        'KENYAN NATIONAL ID NUMBER'
      );
      const amrsMrn = this.getIdentifierByType(
        identifier,
        'AMRS Medical Record Number'
      );
      const ampathMrsUId = this.getIdentifierByType(
        identifier,
        'AMRS Universal ID'
      );
      const cCC = this.getIdentifierByType(identifier, 'CCC Number');
      if (
        kenyaNationalId === undefined &&
        amrsMrn === undefined &&
        ampathMrsUId === undefined &&
        cCC === undefined
      ) {
        if (identifiers[0].identifier) {
          filteredIdentifiers = { default: identifiers[0].identifier };
        } else {
          filteredIdentifiers = { default: '' };
        }
      } else {
        filteredIdentifiers = {
          kenyaNationalId: kenyaNationalId,
          amrsMrn: amrsMrn,
          ampathMrsUId: ampathMrsUId,
          cCC: cCC
        };
      }
      return filteredIdentifiers;
    } else {
      return (identifiers = '');
    }
  }

  private getIdentifierByType(identifierObject, type) {
    if (_.isArray(identifierObject)) {
      // tslint:disable-next-line:no-shadowed-variable
      const identifiers = _.filter(identifierObject, (identifier) => {
        if (_.indexOf(identifier.display, '=') > 0) {
          const idType = identifier.display.split('=');
          return idType[0].trim() === type;
        } else {
          const idType = identifier.identifierType.name;
          return idType === type;
        }
      });
      const identifier = _.first(identifiers);
      if (identifier) {
        return identifier.display
          ? identifier.display.split('=')[1].trim()
          : identifier.identifier;
      }
    } else {
      for (const e in identifierObject) {
        if (identifierObject[e].identifierType !== undefined) {
          const idType = identifierObject[e].identifierType.name;
          const id = identifierObject[e].identifier;
          if (idType === type) {
            return id;
          }
        }
      }
    }
  }
}
