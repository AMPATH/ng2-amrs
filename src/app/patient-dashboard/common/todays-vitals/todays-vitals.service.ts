import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { Patient } from '../../../models/patient.model';
import { Vital } from '../../../models/vital.model';
import { VitalsDatasource } from './vitals.datasource';

@Injectable()
export class TodaysVitalsService {
  public patient: Patient = new Patient({});
  private vitalSources: any[] = [];

  constructor(
    private vitalsDataSource: VitalsDatasource) {
  }

  public getTodaysVitals(patient: Patient, todaysEncounters, sources) {
    this.patient = patient;
    this.vitalSources = sources || [];
    this.vitalsDataSource.vitalSources = [];
    return new Promise((resolve, reject) => {
      for (const encounterItem of todaysEncounters) {
        this.getVitalsFromObs(encounterItem.obs);
      }

      resolve(this.vitalsDataSource.vitalSources);
    });

  }

  private getVitalsFromObs(obsArray) {
    let createdVital: any;
    _.each(this.vitalSources, (source) => {
      const vitalSource = new source(new Vital({}), this.patient);
      for (const obs of obsArray) {
        const ob = obs;
        if (typeof ob.concept !== 'undefined') {
          createdVital = vitalSource.getVitals(ob, this.vitalsDataSource);
          if (typeof createdVital !== 'undefined' && createdVital.name) {
            const vitalModel = createdVital[createdVital.name];
            if (vitalModel && vitalModel.show) {
              this.vitalsDataSource.addToVitalSource(vitalModel);
            }
          }
        }
      }
      if (!this.vitalsDataSource.hasVital('weight') || this.vitalsDataSource.hasVital('height')) {
        this.vitalsDataSource.addToVitalSource(vitalSource.getBMI(new Vital({}),
          this.vitalsDataSource.getVital('weight'), this.vitalsDataSource.getVital('height')));
      }
    });
    this.applyCompounding();
  }

  private applyCompounding() {
    const compounds = _.filter(this.vitalsDataSource.vitalSources, 'isCompoundedWith');
    _.each(compounds, (compound) => {
      const toCompound = _.find(this.vitalsDataSource.vitalSources, (s) => s && compound.isCompoundedWith === s.name);
      if (toCompound) {
        toCompound.compoundValue = compound;
      }
    });
  }
}
