import { Component, OnInit, Input } from '@angular/core';
import { Encounter } from '../../models/encounter.model';

@Component({
    selector: 'encounter-list',
    templateUrl: './encounter-list.component.html',

})
export class EncounterListComponent implements OnInit {
    constructor() { }
    @Input() encounters: Encounter[];
    @Input('messageType') messageType: string;
    @Input('message') message: string;
    @Input('isVisible') isVisible: boolean;

    ngOnInit() { }
}