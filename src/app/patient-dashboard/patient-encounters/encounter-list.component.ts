import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Encounter } from '../../models/encounter.model';

@Component({
    selector: 'encounter-list',
    templateUrl: './encounter-list.component.html',

})
export class EncounterListComponent implements OnInit {
    @Input() encounters: Encounter[];
    @Input('messageType') messageType: string;
    @Input('message') message: string;
    @Input('isVisible') isVisible: boolean;
    @Output() onEncounterEdit = new EventEmitter();
    @Output() isBusy = new EventEmitter();
    @Output() onEncounterObservations = new EventEmitter();

    constructor() { }
    ngOnInit() { }
    editEncounter(encounter) {
        this.onEncounterEdit.emit(encounter);
    }

    showEncounterObservations(encounter) {
      this.isBusy.emit(true);
      this.onEncounterObservations.emit(encounter);

    }
}
