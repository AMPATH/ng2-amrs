import { Component, OnInit, Input, ViewChild,
  ViewEncapsulation, EventEmitter, Output, OnChanges, SimpleChange } from '@angular/core';
import { Encounter } from '../../../models/encounter.model';
import * as _ from 'lodash';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap/modal';

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

  public obs: any;
  public pretty: boolean;
  public isHidden: Array<boolean> = [];
  public selectedEncounter: any;
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
    @ViewChild('modal')
    public modal: ModalComponent;
  @Input() public encounter: Encounter;
  @Input() public set prettyView(val: boolean){
    this.pretty = val;
  }
  @Input() public onEncounterDetail: boolean;
  @Output() public onClose = new EventEmitter();
  @Output() public isDone = new EventEmitter();
  @Output() public onDismiss = new EventEmitter();
  public cssClass: string = 'obs-dialog';

  constructor(private encounterResource: EncounterResourceService) {
  }

  public ngOnInit() {

  }

  public ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (Object.keys(changes).length === 1 && changes['onEncounterDetail']) {
      if (this.pretty) {
        this.showPrettyObsView(this.selectedEncounter);
      } else { this.showPlainObsView(this.selectedEncounter); }
    }

    if (Object.keys(changes).length === 2 && changes['onEncounterDetail']
    && changes['prettyView']) {
      this.pretty = changes['prettyView'].currentValue;
      if (this.pretty) {
        this.showPrettyObsView(this.selectedEncounter);
      } else { this.showPlainObsView(this.selectedEncounter); }
    }

    for (let propName in changes) {
      if (propName !== 'encounter') {
        continue;
      }
      let changedProp = changes[propName];
      let encounter = changedProp.currentValue;
      if (!changedProp.isFirstChange()) {
        this.isDone.emit(true);
        if (this.pretty) {
          this.showPrettyObsView(encounter);
        } else { this.showPlainObsView(encounter); }

      }
    }
  }

  public showPlainObsView(encounter) {
    this.selectedEncounter = encounter;
    this.encounterResource.getEncounterByUuid(encounter.uuid).subscribe((_encounter) => {
      // this.modal.dismiss();
      // console.log(this.modal);
      // this.modal.visible = true;
      this.staticModal.show();
      // this.modal.open();
      this.obs = this.processEncounter(_encounter);
    });
  }
  public showPrettyObsView(encounter) {
    this.selectedEncounter = encounter;
    this.staticModal.show();
  }
  public updateOpenState(index: number) {
    const state = this.isHidden[index];
    if (state) {
      this.isHidden[index] = false;
    } else {
      this.isHidden[index] = true;
    }
  }

  public close() {
    this.modal.close();
  }

  public dismissed() {
    this.modal.dismiss();
  }

  public processEncounter(encounter: any) {
    const obs = encounter.obs;
    let processedObs: any = [];
    obs.sort((a, b) => {
      let _a = a.concept.name.display.toUpperCase();
      let _b = b.concept.name.display.toUpperCase();
      return (_a < _b) ? -1 : (_a > _b) ? 1 : 0;
    });

    _.each(obs, (v: any, i) => {
      this.isHidden[i] = true;
      let _value: any = _.isObject(v.value) ? v.value.display : v.value;
      let _arrValue: Array<any> = [];
      if (_.isNil(_value) && !_.isNil(v.groupMembers)) {
        _.each(v.groupMembers, (group: any, index) => {
          _arrValue.push({label: group.concept.display.toUpperCase(),
            value: (_.isObject(group.value) ? group.value.display : group.value)}); // check;
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
