import { PatientLastOrderLocationDao } from '../../dao/eid/eid-patient-last-order-location';

const config = require('../../conf/config');

export class PatientLastOrderLocationService {
  constructor() {}

  getPatientLastOrderLocation(patientUuid) {
    const dao = this.getDao();

    return new Promise((resolve, reject) => {
      return dao
        .getPatientLastOrderLocation(patientUuid)
        .then((results) => resolve(results))
        .catch((error) => reject(error));
    });
  }

  isPatientLastOrderLocationAffliatedToAlupe(patientUuid) {
    //Busia, Busia MCH, port victoria, Bumala A, Bumala B, Osieko, Matayos, Mukhubola, Teso, Malaba,
    //Kamolo, Angurai, Changara, Mt. Elgon, Cheptais
    const alupeLabLocations = config.eid.alupe.facilityIds;

    return new Promise((resolve, reject) => {
      this.getPatientLastOrderLocation(patientUuid)
        .then((results) => {
          if (results.length > 0) {
            const lastOrderLocation = results[0].location;
            if (lastOrderLocation) {
              resolve(alupeLabLocations.includes(lastOrderLocation));
            } else {
              //If lastOrderLocation === undefined or 0 should resolve true
              resolve(true);
            }
          } else {
            resolve(true);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getDao() {
    return new PatientLastOrderLocationDao();
  }
}
