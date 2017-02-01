import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { Encounter } from '../../models/encounter.model';
import * as _ from 'lodash';
const mockEncounter = require('./mock/mock-encounter.json');

@Component({
  selector: 'patient-encounter-observations',
  templateUrl: './patient-encounter-observations.component.html',
  styleUrls: ['./patient-encounters.component.css']

})
export class PatientEncounterObservationsComponent implements OnInit, OnChanges {

  obs: any;
  @Input() encounter: Encounter;
  @Input() onEncounterDetail: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (let propName in changes) {
      if (propName !== 'encounter') {
        continue;
      }
      let changedProp = changes[propName];
      let encounter = changedProp.currentValue;
      if (!changedProp.isFirstChange()) {
        encounter = mockEncounter;
        this.obs = this.processEncounter(encounter);
      }
    }
  }

  processEncounter(encounter: any) {
    const obs = encounter.obs;
    let processedObs: any = [];
    obs.sort((a, b) => {
      let _a = a.concept.name.display.toUpperCase();
      let _b = b.concept.name.display.toUpperCase();
      return (_a < _b) ? -1 : (_a > _b) ? 1 : 0;
    });

    _.each(obs, (v, i) => {
      let _value: any = _.isObject(v.value) ? v.value.display : v.value;
      let _arrValue: Array<any> = [];
      if (_.isNil(_value) && !_.isNil(v.groupMembers)) {
        _.each(v.groupMembers, (group, index) => {
          _arrValue.push({label: group.concept.display.toUpperCase(), value: group.value.display});
        });
        _value = _arrValue;
      }
      processedObs.push({
        label: v.concept.name.display.toUpperCase(),
        has_children: _.isArray(_value),
        value: _value
      });
    });

    return processedObs;
  }

}
