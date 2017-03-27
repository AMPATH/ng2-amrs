import { BaseModel } from './base-model.model';
import { serializable, serialize } from './serializable.decorator';
import './date.extensions';

import { PersonAttribute } from './person-attribute.model';
import { PersonAddress } from './address.model';


export class Person extends BaseModel {
  private _birthdate: Date;
  private _attributes = this.openmrsModel.attributes;
  private _convertedAttributes = [];
  private _address: PersonAddress;
  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  @serializable()
  public get gender(): string {
    return this._openmrsModel.gender;
  }
  public set gender(v: string) {
    this._openmrsModel.gender = v;
  }

  @serializable(true, false)
  public get age(): number {
    return this._openmrsModel.age;
  }
  public set age(v: number) {
    this._openmrsModel.age = v;
  }


  @serializable()
  public get birthdate(): Date {
    if (this._birthdate === null || this._birthdate === undefined) {
      this._birthdate = new Date(this._openmrsModel.birthdate);
    }
    return this._birthdate;
  }
  public set birthdate(v: Date) {
    this._openmrsModel.birthdate = v.toServerTimezoneString();
    this._birthdate = v;
  }

  @serializable(false, true)
  public get preferredName(): string {
    return this._openmrsModel.preferredName;
  }
  public set preferredName(v: string) {
    this._openmrsModel.preferredName = v;
  }
  @serializable(true, false)
  public get attributes(): PersonAttribute {
    if (this._attributes === null || this._attributes === undefined) {
      this.initializeNavigationProperty('');
      this._attributes = new PersonAttribute(this._openmrsModel.attributes);
    }
    return this._attributes;
  }
  public set attributes(v: PersonAttribute) {
    this._openmrsModel.attributes = v.openmrsModel;
    this._attributes = v;
  }

  public get healthCenter() {
    let healthCenterPersonAttributeTypeUuid = '8d87236c-c2cc-11de-8d13-0010c6dffd0f';
    if (this._attributes) {
      let location = this.getPersonAttribute(healthCenterPersonAttributeTypeUuid);
      if (location) {
        return location.display;
      } else {
        return '';
      }
    }
  }
  public get nextofkinPhoneNumber() {
    let nextofkinPhoneNumberPersonAttributeTypeUuid = 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d';
    if (this._attributes) {
      let nextofkinPhoneNumber =
        this.getPersonAttribute(nextofkinPhoneNumberPersonAttributeTypeUuid);
      if (nextofkinPhoneNumber) {
        return nextofkinPhoneNumber;
      } else {
        return '';
      }
    }
  }
  public get patnerPhoneNumber() {
    let patnerPhoneNumberPersonAttributeTypeUuid = 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46';
    if (this._attributes) {
      let patnerPhoneNumber = this.getPersonAttribute(patnerPhoneNumberPersonAttributeTypeUuid);
      if (patnerPhoneNumber) {
        return patnerPhoneNumber;
      } else {
        return '';
      }
    }
  }
  public get alternativePhoneNumber() {
    let alternativePhoneNumberPersonAttributeTypeUuid = 'c725f524-c14a-4468-ac19-4a0e6661c930';
    if (this._attributes) {
      let alternativePhoneNumber =
        this.getPersonAttribute(alternativePhoneNumberPersonAttributeTypeUuid);
      if (alternativePhoneNumber) {
        return alternativePhoneNumber;
      } else {
        return '';
      }
    }
  }
  public get patientPhoneNumber() {
    let phoneNumberPersonAttributeTypeUuid = '72a759a8-1359-11df-a1f1-0026b9348838';
    if (this._attributes) {
      let  phoneNumber = this.getPersonAttribute(phoneNumberPersonAttributeTypeUuid);
      if ( phoneNumber) {
        return  phoneNumber;
      } else {
        return '';
      }
    }
  }
  public get contacts() {
    let phoneNumberPersonAttributeTypeUuid = '72a759a8-1359-11df-a1f1-0026b9348838';
    let patnerPhoneNumberPersonAttributeTypeUuid = 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46';
    let alternativePhoneNumberPersonAttributeTypeUuid = 'c725f524-c14a-4468-ac19-4a0e6661c930';
    let nextofkinPhoneNumberPersonAttributeTypeUuid = 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d';

    if (this._attributes) {
      let filteredContacts: {};
      let patnerPhoneNumber = this.getPersonAttribute(patnerPhoneNumberPersonAttributeTypeUuid);
      let patientPhoneNumber = this.getPersonAttribute(phoneNumberPersonAttributeTypeUuid);
      let alternativePhoneNumber =
        this.getPersonAttribute(alternativePhoneNumberPersonAttributeTypeUuid);
      let nextofkinPhoneNumber =
        this.getPersonAttribute(nextofkinPhoneNumberPersonAttributeTypeUuid);

      if ((patnerPhoneNumber) === undefined && (patientPhoneNumber) === undefined &&
        (alternativePhoneNumber) === undefined && (nextofkinPhoneNumber) === undefined &&
        (patientPhoneNumber) === undefined) {
        if ((this._attributes)) {
          filteredContacts = { 'default': this._attributes };
        } else {
          filteredContacts = { 'default': '' };
        }
      } else {
        filteredContacts = {
          patnerPhoneNumber: (patnerPhoneNumber),
          patientPhoneNumber: (patientPhoneNumber),
          alternativePhoneNumber: (alternativePhoneNumber),
          nextofkinPhoneNumber: (nextofkinPhoneNumber)
        };
      }
      return filteredContacts;
    } else {
      return this._attributes = '';
    }

  };
  getPersonAttribute(personAttributeTypeUuid) {
    if (this._attributes.length > 0) {
      for (let i in this._attributes) {
        if (this._attributes.hasOwnProperty(i)) {
          let attr = this._attributes[i];
          if (attr.attributeType.uuid === personAttributeTypeUuid) {
            return attr.value;
          }
        }
      }
    }

  }


  public get addresses(): PersonAddress {
    if (this._address === null || this._address === undefined) {
      this.initializeNavigationProperty('');
      this._address = new PersonAddress(this._openmrsModel.addresses);
    }
    return this._address;
  }
  public set addresses(v: PersonAddress) {
    this._openmrsModel.addresses = v.openmrsModel;
    this._address = v;
  }
  @serializable(false, true)
  public get preferredAddress(): string {
    return this._openmrsModel.preferredAddress;
  }
  public set preferredAddress(v: string) {
    this._openmrsModel.preferredAddress = v;
  }

  @serializable(true, false)
  public get dead(): boolean {
    return this._openmrsModel.dead;
  }
  public set dead(v: boolean) {
    this._openmrsModel.dead = v;
  }

  @serializable(true, false)
  public get deathDate(): Date {
    return this._openmrsModel.deathDate;
  }
  public set deathDate(v: Date) {
    this._openmrsModel.deathDate = v;
  }

  @serializable(true, false)
  public get causeOfDeath(): string {
    if (this._openmrsModel.causeOfDeath) {
      return this._openmrsModel.causeOfDeath.display;
    }
    return '';
  }
  public set causeOfDeath(v: string) {
    this._openmrsModel.deathDate = v;
  }

}
