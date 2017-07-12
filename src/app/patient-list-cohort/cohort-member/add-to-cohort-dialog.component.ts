import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { AddCohortMemberComponent } from
    './add-cohort-member.component';

@Component({
    selector: 'add-to-cohort-dialog',
    templateUrl: 'add-to-cohort-dialog.component.html'
})

export class AddToCohortDialogComponent implements OnInit {
    @Output()
    public dialogClosed: EventEmitter<any> = new EventEmitter();

    @Input()
    public patient: any;

    @Input()
    public cohort: any;

    @Input()
    public allowPatientEdit: boolean = false;

    @Input()
    public allowCohortEdit: boolean = false;

    @ViewChild('addCohortComp')
    public cohortComponent: AddCohortMemberComponent;


    private _display: boolean = true;
    public get display(): boolean {
        return this._display;
    }
    public set display(v: boolean) {
        this._display = v;
        if (v === false) {
            this.dialogClosed.next();
        }
    }


    constructor() { }

    ngOnInit() {
        if (this.allowCohortEdit) {
            this.cohortComponent.showCohortSelectorComponent();
        }

        if (this.allowPatientEdit) {
            this.cohortComponent.showPatientSearchComponent();
        }
    }

    onSavedCohortMember() {
        this.display = false;
    }

    showDialog() {
        this.display = true;
    }

}
