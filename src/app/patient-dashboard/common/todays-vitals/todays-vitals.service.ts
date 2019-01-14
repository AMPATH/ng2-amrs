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
  private dataSources: any[] = [];

  constructor(
    private visitResourceService: VisitResourceService,
    private vitalsDataSource: VitalsDatasource) {
  }

  public getTodaysVitals(patient: Patient, todaysEncounters, sources) {
    this.patient = patient;
    this.dataSources = sources || [];
    return new Promise((resolve, reject) => {
      for (let encounterItem of todaysEncounters) {
        this.getVitalsFromObs(encounterItem.obs);
      }
      resolve(this.vitalsDataSource.dataSources);
    });

  }

  private getVitalsFromObs(obsArray) {
    let createdVital: any;
    _.each(this.dataSources, (source) => {
      const vitalSource = new source(new Vital({}), this.patient);
      for (let obs of obsArray) {
        let ob = obs;
        if (typeof ob.concept !== 'undefined') {
          createdVital = vitalSource.getVitals(ob, this.vitalsDataSource);
          if (typeof createdVital !== 'undefined' && createdVital.name) {
            const vitalModel = createdVital[createdVital.name];
            if (vitalModel && vitalModel.show) {
              this.vitalsDataSource.addToSource(vitalModel);
            }
          }
        }
      }
      if (!this.vitalsDataSource.hasVital('bmi')) {
        this.vitalsDataSource.addToSource(vitalSource.getBMI(createdVital));
      }
    });
    this.applyCompounding();
  }

  private applyCompounding() {
    let compounds = _.filter(this.vitalsDataSource.dataSources, 'isCompoundedWith');
    _.each(compounds, (compound) => {
      let toCompound = _.find(this.vitalsDataSource.dataSources, (s) => compound.isCompoundedWith === s.name);
      if (toCompound) {
        toCompound.compoundValue = compound;
      }
    });
  }
}
