import { Component, OnInit, Input } from '@angular/core';

import { takeWhile, isEmpty } from 'lodash';

@Component({
  selector: 'patient-identifier',
  templateUrl: './patient-identifier.component.html',
  styleUrls: ['./patient-identifier.component.css']
})
export class PatientIdentifierComponent implements OnInit {

  @Input()
  public set identifiers(identifiers: Array<any>) {
    if (!isEmpty(identifiers)) {
      this._identifiers = identifiers;
      const preferredIdentifiers = takeWhile(identifiers, (i: any) => i.preferred);
      if (preferredIdentifiers.length > 0) {
        this.hasPreferredIdentifier = true;
      }
    }
  }

  public get identifiers(): Array<any> {
    return this._identifiers;
  }

  public hasPreferredIdentifier = false;
  private _identifiers: Array<{}> = [];

  constructor() {
  }

  public ngOnInit() {

  }
}
