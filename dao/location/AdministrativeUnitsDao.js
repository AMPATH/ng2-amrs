import administrativeUnits from './AdministrativeUnits';
import { Promise } from 'bluebird';

export class AdministrativeUnitsDao {
  constructor() {}
  getAllCounties() {
    return new Promise((resolve, reject) => {
      resolve(administrativeUnits);
    });
  }
}
