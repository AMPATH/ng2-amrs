import { BaseModel } from './base-model.model';
import * as _ from 'lodash';

export class User extends BaseModel {

    constructor(openmrsModel?: any) {
        super(openmrsModel);
    }

    public get roleDisplay(): string {

      let roleDisplay: string = "";

      let roles = this._openmrsModel.roles;

      if(roles && roles.length > 0) {

        _.forEach(roles, function(role) {
          roleDisplay = roleDisplay.length == 0 ? role.display : roleDisplay + ", " + role.display;
        });
      }

      return roleDisplay;
    }

    public get roles(): Array<Object> {

      let roles = this._openmrsModel.roles;
      if(roles && roles.length > 0) return roles;

      return null;
    }
}
