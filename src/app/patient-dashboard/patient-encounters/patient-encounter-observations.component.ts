import { Component, OnInit, Input, ViewChild,
  ViewEncapsulation, EventEmitter, Output, OnChanges, SimpleChange } from '@angular/core';
import { Encounter } from '../../models/encounter.model';
import * as _ from 'lodash';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'patient-encounter-observations',
  templateUrl: './patient-encounter-observations.component.html',
  styleUrls: ['./patient-encounters.component.css'],
  entryComponents: [
    ModalComponent
  ],
  encapsulation: ViewEncapsulation.None

})
export class PatientEncounterObservationsComponent implements OnInit, OnChanges {

  obs: any;
  isHidden: Array<boolean> = [];
  @ViewChild('modal')
  modal: ModalComponent;
  @Input() encounter: Encounter;
  @Input() onEncounterDetail: boolean;
  @Output() onClose = new EventEmitter();
  @Output() isDone = new EventEmitter();
  @Output() onDismiss = new EventEmitter();
  cssClass: string = 'obs-dialog';

  constructor(private encounterResource: EncounterResourceService) {
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
        this.isDone.emit(true);
        this.encounterResource.getEncounterByUuid(encounter.uuid).subscribe((_encounter) => {
          this.modal.dismiss();
          this.modal.open();
          this.obs = this.processEncounter(_encounter);
        });

      }
    }
  }

  updateOpenState(index: number) {
    const state = this.isHidden[index];
    if (state) {
      this.isHidden[index] = false;
    } else {
      this.isHidden[index] = true;
    }
  }

  close() {
    this.modal.close();
  }

  dismissed() {
    this.modal.dismiss();
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
      this.isHidden[i] = true;
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
    this.isDone.emit(false);
    return processedObs;
  }

}
