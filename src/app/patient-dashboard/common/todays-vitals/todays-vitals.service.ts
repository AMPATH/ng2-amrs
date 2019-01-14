import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  VisitResourceService
} from '../../../openmrs-api/visit-resource.service';
import { Vital } from '../../../models/vital.model';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { ZscoreService } from '../../../shared/services/zscore.service';
import { Patient } from '../../../models/patient.model';
import { VitalsDatasource } from './vitals.datasource';


@Injectable()
export class TodaysVitalsService {
  public patient: Patient = new Patient({});
  private vitalSources: any[] = [];

  constructor(
    private visitResourceService: VisitResourceService,
    private vitalsDataSource: VitalsDatasource) {
  }

  public getTodaysVitals(patient: Patient, todaysEncounters, sources) {
    this.patient = patient;
    this.vitalSources = sources || [];
    return new Promise((resolve, reject) => {
      for (let encounterItem of todaysEncounters) {
        this.getVitalsFromObs(encounterItem.obs);
      }
      resolve(this.vitalsDataSource.vitalSources);
    });

  }

  private getVitalsFromObs(obsArray) {
    let createdVital: any;
    _.each(this.vitalSources, (source) => {
      const vitalSource = new source(new Vital({}), this.patient);
      for (let obs of obsArray) {
        let ob = obs;
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
      if (!this.vitalsDataSource.hasVital('bmi')) {
        this.vitalsDataSource.addToVitalSource(vitalSource.getBMI(createdVital));
      }
    });
    this.applyCompounding();
  }

  private applyCompounding() {
    let compounds = _.filter(this.vitalsDataSource.vitalSources, 'isCompoundedWith');
    _.each(compounds, (compound) => {
      let toCompound = _.find(this.vitalsDataSource.vitalSources, (s) => s && compound.isCompoundedWith === s.name);
      if (toCompound) {
        toCompound.compoundValue = compound;
      }
    });
  }
}
