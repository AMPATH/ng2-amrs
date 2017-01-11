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
    @Output() onEncounterSelected = new EventEmitter();

    constructor() { }
    ngOnInit() { }
    encounterSelected(encounter) {
        this.onEncounterSelected.emit(encounter);
    }
}
