import { BaseModel } from './base-model.model';
import * as _ from 'lodash';

export class User extends BaseModel {

  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  public get roleDisplay(): string {

    let roleDisplay: string = '';

    let roles = this._openmrsModel.roles;

    if (roles && roles.length > 0) {

      let counter: number = 0;
      _.forEach(roles, function (role) {

        if (counter <= 1) roleDisplay = roleDisplay.length === 0 ?
          role.display : roleDisplay + ', ' + role.display;
        counter++;
      });
    }
    return roleDisplay;
  }

  public get roles(): Array<Object> {

    let roles = this._openmrsModel.roles;
    if (roles && roles.length > 0) return roles;

    return null;
  }
}
