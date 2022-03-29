// tslint:disable:no-output-on-prefix
import { take } from "rxjs/operators";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { Encounter } from '../../../models/encounter.model';
import * as _ from 'lodash';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as Moment from 'moment';

@Component({
  selector: "patient-encounter-observations",
  templateUrl: "./patient-encounter-observations.component.html",
  styleUrls: ["./patient-encounters.component.css"],
  entryComponents: [ModalComponent],
  encapsulation: ViewEncapsulation.None,
})
export class PatientEncounterObservationsComponent
  implements OnInit, OnChanges {
  public obs: any;
  public pretty: boolean;
  public isHidden: Array<boolean> = [];
  public selectedEncounter: any;
  @ViewChild("staticModal")
  public staticModal: ModalDirective;
  @ViewChild("modal")
  public modal: ModalComponent;
  @Input() public encounter: Encounter;
  @Input() public set prettyView(val: boolean) {
    this.pretty = val;
  }
  @Input() public onEncounterDetail: boolean;
  @Output() public onClose = new EventEmitter();
  @Output() public isDone = new EventEmitter();
  @Output() public onDismiss = new EventEmitter();
  public cssClass = 'obs-dialog';
  public timeDataTypeUuid = '8d4a591e-c2cc-11de-8d13-0010c6dffd0f';

  constructor(private encounterResource: EncounterResourceService) {}

  public ngOnInit() {}

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (Object.keys(changes).length === 1 && changes["onEncounterDetail"]) {
      if (this.pretty) {
        this.showPrettyObsView(this.selectedEncounter);
      } else {
        this.showPlainObsView(this.selectedEncounter);
      }
    }

    if (
      Object.keys(changes).length === 2 &&
      changes["onEncounterDetail"] &&
      changes["prettyView"]
    ) {
      this.pretty = changes["prettyView"].currentValue;
      if (this.pretty) {
        this.showPrettyObsView(this.selectedEncounter);
      } else {
        this.showPlainObsView(this.selectedEncounter);
      }
    }

    for (const propName in changes) {
      if (propName !== "encounter") {
        continue;
      }
      const changedProp = changes[propName];
      const encounter = changedProp.currentValue;
      if (!changedProp.isFirstChange()) {
        this.isDone.emit(true);
        if (this.pretty) {
          this.showPrettyObsView(encounter);
        } else {
          this.showPlainObsView(encounter);
        }
      }
    }
  }

  public showPlainObsView(encounter) {
    this.selectedEncounter = encounter;
    this.encounterResource
      .getEncounterByUuid(encounter.uuid)
      .pipe(take(1))
      .subscribe((_encounter) => {
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
    const processedObs: any = [];
    obs.sort((a, b) => {
      const _a = a.concept.name.display.toUpperCase();
      const _b = b.concept.name.display.toUpperCase();
      return _a < _b ? -1 : _a > _b ? 1 : 0;
    });
    _.each(obs, (v: any, i) => {
      this.isHidden[i] = true;
      const dataTypeUuid = v.concept.datatype.uuid || '';
      let _value: any = _.isObject(v.value)
        ? v.value.display
        : dataTypeUuid === this.timeDataTypeUuid
        ? this.convertDateTimeToTime(v.value)
        : v.value;
      const _arrValue: Array<any> = [];
      if (_.isNil(_value) && !_.isNil(v.groupMembers)) {
        _.each(v.groupMembers, (group: any, index) => {
          _arrValue.push({
            label: group.concept.display.toUpperCase(),
            value: _.isObject(group.value) ? group.value.display : group.value,
          }); // check;
        });
        _value = _arrValue;
      }
      processedObs.push({
        label: v.concept.name.display.toUpperCase(),
        has_children: _.isArray(_value),
        value: _value,
      });
    });
    this.isDone.emit(false);
    return processedObs;
  }

  public convertDateTimeToTime(dateTimeString: string): string {
    const obsTime = Moment(dateTimeString).format('HH:mm');
    return obsTime;
  }
}
