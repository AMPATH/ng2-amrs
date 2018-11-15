/**
 * patient
 */
import { BaseModel } from './base-model.model';
import { serializable, serialize } from './serializable.decorator';
import { Person } from './person.model';
import { PatientIdentifier } from './patient-identifier.model';
import { ProgramEnrollment } from './program-enrollment.model';

export class Patient extends BaseModel {
  public _identifier = this.openmrsModel.identifiers;
  private _person: Person;
  private _patientIdentifier: PatientIdentifier;
  private _enrolledPrograms = this.openmrsModel.enrolledPrograms;
  private _encounters = this.openmrsModel.encounters;

  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  @serializable(true, false)
  public get person(): Person {
    if (this._person === null || this._person === undefined) {
      this.initializeNavigationProperty('person');
      this._person = new Person(this._openmrsModel.person);
    }
    return this._person;
  }

  public set person(v: Person) {
    this._openmrsModel.person = v.openmrsModel;
    this._person = v;
  }

  @serializable()
  public get identifiers(): PatientIdentifier {
    if (this._patientIdentifier === null || this._patientIdentifier === undefined) {
      this.initializeNavigationProperty('patientIdentifier');
      this._patientIdentifier = new PatientIdentifier(this._openmrsModel.identifiers);
    }
    return this._patientIdentifier;
  }

  public set identifiers(v: PatientIdentifier) {
    this._openmrsModel.identifiers = v.openmrsModel;
    this._patientIdentifier = v;
  }

  @serializable()
  public get enrolledPrograms(): any[] {
    if (this._enrolledPrograms === null || this._enrolledPrograms === undefined) {
      this.initializeNavigationProperty('enrolledPrograms');
      this._enrolledPrograms = this._openmrsModel.enrolledPrograms;
    }
    return this._enrolledPrograms;
  }

  public set enrolledPrograms(v: any[]) {
    this._openmrsModel.enrolledPrograms = v;
    this._enrolledPrograms = v;
  }

  public get encounters() {

    let mappedEncounters: Array<any> = new Array<any>();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this._encounters.length; i++) {
      mappedEncounters.push(this._encounters[i]);
    }
    return mappedEncounters.reverse();
  }
  public set encounters(encounters: any[]) {
     this._encounters = encounters;
  }
  public get allIdentifiers() {
    if (this._identifier.length > 0) {
      return this._identifier.map( id => id.identifier).toString()
    }
    return '';
  }


  public get searchIdentifiers() {

    if (this._identifier.length > 0) {
      // return _identifier[0].display.split('=')[1];
      let filteredIdentifiers: any;
      let identifier = this._identifier;
      let kenyaNationalId = this.getIdentifierByType(identifier, 'KENYAN NATIONAL ID NUMBER');
      let amrsMrn = this.getIdentifierByType(identifier, 'AMRS Medical Record Number');
      let ampathMrsUId = this.getIdentifierByType(identifier, 'AMRS Universal ID');
      let cCC = this.getIdentifierByType(identifier, 'CCC Number');
      if ((kenyaNationalId) === undefined && (amrsMrn) === undefined &&
        (ampathMrsUId) === undefined && (cCC) === undefined) {
        if ((this._identifier[0].identifier)) {
          filteredIdentifiers = {'default': this._identifier[0].identifier};
        } else {
          filteredIdentifiers = {'default': ''};
        }
      } else {
        filteredIdentifiers = {
          'kenyaNationalId': kenyaNationalId,
          'amrsMrn': amrsMrn,
          'ampathMrsUId': ampathMrsUId,
          'cCC': cCC
        };
      }
      return filteredIdentifiers;
    } else {
      return this._identifier = '';
    }

  }

  public getIdentifierByType(identifierObject, type) {
    for (let e in identifierObject) {
      if ((identifierObject[e].identifierType) !== undefined) {
        let idType = identifierObject[e].identifierType.name;
        let id = identifierObject[e].identifier;
        if (idType === type) {
          return id;
        }
      }
    }
  }

  public toUpdatePayload(): any {
    return null;
  }

  public get commonIdentifiers() {

    if (this._identifier.length > 0) {
      // return _identifier[0].display.split('=')[1];

      let filteredIdentifiers: any;
      let identifiers = this._identifier;

      let kenyaNationalId = this.getAllIdentifiersByType(identifiers, 'KENYAN NATIONAL ID NUMBER');
      let amrsMrn = this.getAllIdentifiersByType(identifiers, 'AMRS Medical Record Number');
      let ampathMrsUId = this.getAllIdentifiersByType(identifiers, 'AMRS Universal ID');
      let cCC = this.getAllIdentifiersByType(identifiers, 'CCC Number');

      if ((kenyaNationalId) === undefined && (amrsMrn) === undefined &&
        (ampathMrsUId) === undefined && (cCC) === undefined) {
        if ((this._identifier[0].identifier)) {
          filteredIdentifiers = {'default': this._identifier[0].identifier};
        } else {
          filteredIdentifiers = {'default': ''};
        }
      } else {
        filteredIdentifiers = {
          'kenyaNationalId': this._fromArrayToCommaSeparatedString(kenyaNationalId),
          'amrsMrn': this._fromArrayToCommaSeparatedString(amrsMrn),
          'ampathMrsUId': this._fromArrayToCommaSeparatedString(ampathMrsUId),
          'cCC': this._fromArrayToCommaSeparatedString(cCC)
        };
      }
      return filteredIdentifiers;
    } else {
      return this._identifier = '';
    }

  }

  public getAllIdentifiersByType(identifiers, type) {
    let types = [];
    for (let e in identifiers) {
      if ((identifiers[e].identifierType) !== undefined) {
        let idType = identifiers[e].identifierType.name;
        let id = identifiers[e].identifier;
        if (idType === type) {
          types.push(id);
        }
      }
    }

    return types;
  }

  private _fromArrayToCommaSeparatedString(inputArray) {
    let returnString = '';

    for (let i = 0; i < inputArray.length; i++) {
      if (i === 0) {
        returnString = inputArray[i] + returnString;
      } else {
        returnString = returnString + ', ' + inputArray[i];
      }
    }
    return returnString;
  }

}
