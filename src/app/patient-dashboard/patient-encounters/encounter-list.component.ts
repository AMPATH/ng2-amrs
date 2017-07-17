import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Encounter } from '../../models/encounter.model';
import { NgModel } from '@angular/forms';

@Component({
    selector: 'encounter-list',
    templateUrl: './encounter-list.component.html',

})
export class EncounterListComponent implements OnInit {
    @Input() encountersLoading: boolean = false;
    @Input() encounters: Encounter[];
    @Input('messageType') messageType: string;
    @Input('message') message: string;
    @Input('isVisible') isVisible: boolean;
    @Output() onEncounterEdit = new EventEmitter();
    @Output() isBusy = new EventEmitter();
    @Output() onEncounterObservations = new EventEmitter();
    @Input() encounterTypes: any [];
    selectedEncounterType: any = [];
    encounterFilterTypeArray: any = [];

    constructor() { }
    ngOnInit() {}
    editEncounter(encounter) {
        this.onEncounterEdit.emit(encounter);
    }

    showEncounterObservations(encounter) {
      this.isBusy.emit(true);
      this.onEncounterObservations.emit(encounter);
      // console.log('Show observations', encounter);

    }

    onEncounterTypeChange(selectedEncounterType) {
         let count = 0;

       this.encounterFilterTypeArray.forEach(element => {
             if ( element === selectedEncounterType) {
                  count++;
             }
       });

       if (count === 0  &&  selectedEncounterType !== '') {
           this.encounterFilterTypeArray.push(selectedEncounterType);
       } else if (count === 0 && selectedEncounterType === '') {

             this.encounterFilterTypeArray = this.encounterTypes;

       } else {
           // if all is selected then add all the items in the encounter types array
             alert(selectedEncounterType);
             alert('Item is already in filter');
       }
    }

    clearEncounterFilter() {
        this.encounterFilterTypeArray = [];
    }
    removeFilterItem(i) {
        this.encounterFilterTypeArray.splice(i, 1);
    }
}
