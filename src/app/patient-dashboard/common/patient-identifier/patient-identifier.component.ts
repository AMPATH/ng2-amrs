import { Component, OnInit, Input } from '@angular/core';

import { takeWhile, isEmpty } from 'lodash';
import { IdentifierTypesUuids } from '../../../constants/identifier-types';
import { PatientIdentifier } from '../../../models/patient-identifier.model';

@Component({
  selector: 'patient-identifier',
  templateUrl: './patient-identifier.component.html',
  styleUrls: ['./patient-identifier.component.css']
})
export class PatientIdentifierComponent implements OnInit {
  private nonEditableIdentifierTypes = [
    IdentifierTypesUuids.CLIENT_REGISTRY_NO_UUID,
    IdentifierTypesUuids.SHA_UUID,
    IdentifierTypesUuids.HOUSE_HOLD_NUMBER_UUID,
    IdentifierTypesUuids.ALIEN_ID_UUID,
    IdentifierTypesUuids.REFUGEE_ID_UUID,
    IdentifierTypesUuids.MANDATE_NUMBER_UUID,
    IdentifierTypesUuids.NATIONAL_ID_UUID,
    IdentifierTypesUuids.AMRS_UNIVERSAL_ID_UUID,
    IdentifierTypesUuids.UPI_NUMBER_UUID,
    IdentifierTypesUuids.TEMPORARY_DEPENDANT_ID_UUID
  ];
  public customIdentifiers = [];
  @Input()
  public set identifiers(identifiers: PatientIdentifier[]) {
    if (!isEmpty(identifiers)) {
      this._identifiers = identifiers;
      const preferredIdentifiers = takeWhile(
        identifiers,
        (i: any) => i.preferred
      );
      if (preferredIdentifiers.length > 0) {
        this.hasPreferredIdentifier = true;
      }
      this.addCustomFields(identifiers);
    }
  }

  public get identifiers(): PatientIdentifier[] {
    return this._identifiers;
  }

  public hasPreferredIdentifier = false;
  private _identifiers: PatientIdentifier[] = [];

  constructor() {}

  public ngOnInit() {}

  private addCustomFields(identifiers: PatientIdentifier[]) {
    this.customIdentifiers = identifiers.map((id) => {
      return {
        ...id,
        editable: this.isIdentifierEditable(id.identifierType.uuid)
      };
    });
  }
  private isIdentifierEditable(identifierTypeUuid: string): boolean {
    return !this.nonEditableIdentifierTypes.includes(identifierTypeUuid);
  }
}
