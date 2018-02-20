import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Encounter } from '../../../models/encounter.model';
import { NgModel } from '@angular/forms';
import { PatientEncounterProviderPipe } from './patient-encounter-provider.pipe';

@Component({
  selector: 'encounter-list',
  templateUrl: './encounter-list.component.html',

})
export class EncounterListComponent implements OnInit {
  @Input() public encountersLoading: boolean = false;
  @Input() public encounters: Encounter[];
  @Input('messageType') public messageType: string;
  @Input('message') public message: string;
  @Input('isVisible') public isVisible: boolean;
  @Output() public onEncounterEdit = new EventEmitter();
  @Output() public isBusy = new EventEmitter();
  @Output() public onShowPrettyEncounterViewer = new EventEmitter();
  @Output() public onEncounterObservations = new EventEmitter();
  @Input() public encounterTypes: any [];
  @Input() public showPagination: boolean = true;
  @Input() public showFilterers: boolean = true;
  public selectedEncounterType: any = [];
  public encounterFilterTypeArray: any = [];

  constructor() {
  }

  public ngOnInit() {
  }

  public editEncounter(encounter) {
    this.onEncounterEdit.emit(encounter);
  }

  public showEncounterObservations(encounter) {
    this.isBusy.emit(true);
    this.onEncounterObservations.emit(encounter);
    // console.log('Show observations', encounter);

  }

  public showEncounterViewer(encounterObj) {
    this.isBusy.emit(true);
    this.onShowPrettyEncounterViewer.emit(encounterObj);
  }

  public onEncounterTypeChange(selectedEncounterType) {
    let count = 0;

    this.encounterFilterTypeArray.forEach((element) => {
      if (element === selectedEncounterType) {
        count++;
      }
    });

    if (count === 0 && selectedEncounterType !== '') {
      this.encounterFilterTypeArray.push(selectedEncounterType);
    } else if (count === 0 && selectedEncounterType === '') {

      this.encounterFilterTypeArray = this.encounterTypes;

    } else {
      // if all is selected then add all the items in the encounter types array
      alert(selectedEncounterType);
      alert('Item is already in filter');
    }
  }

  public clearEncounterFilter() {
    this.encounterFilterTypeArray = [];
  }

  public removeFilterItem(i) {
    this.encounterFilterTypeArray.splice(i, 1);
  }
}
