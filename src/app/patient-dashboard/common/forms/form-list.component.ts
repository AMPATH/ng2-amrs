import { Component, OnInit, Output, Input, EventEmitter, SimpleChange } from '@angular/core';

import { Form } from '../../../models/form.model';
import { FormListService } from './form-list.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
@Component({
    selector: 'form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.css']
})
export class FormListComponent implements OnInit {
    @Input() public excludedForms = [];
    @Output() public onFormSelected = new EventEmitter();
    public forms: Array<Form>;
    public selectedForm: Form;
    public filterTerm: string = '';
    constructor(private formListService: FormListService,
                private formOrderMetaDataService: FormOrderMetaDataService) { }

    public ngOnInit() {
        this.getForms();
    }

    public getForms() {
        this.forms = [];
        this.formListService.getFormList().subscribe(
            (forms) => {
                this.forms = forms.filter((a) => {
                    if (a.encounterType) {
                        if (this.excludedForms.indexOf(a.encounterType.uuid) > -1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return true;

                });
            }
        );
    }
    public toggleFavourite($event, form: Form) {
        $event.stopPropagation();
        if (form === undefined || form === null) {
            throw new Error('Form is required');
        }
        if (form['favourite'] === true) {
            this.formOrderMetaDataService.removeFavouriteForm(form.name);
        } else {
            this.formOrderMetaDataService.setFavouriteForm(form.name);
        }
        this.getForms();
    }
    public formSelected($event, form: Form) {
        $event.stopPropagation();
        this.selectedForm = form;
        this.onFormSelected.emit(form);
    }
    public valuechange(newValue) {
        this.filterTerm = newValue;
    }

    public isLoading(form: Form): boolean {
        return form === this.selectedForm;
    }
}
