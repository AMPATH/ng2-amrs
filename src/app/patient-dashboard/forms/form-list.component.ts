import { Component, OnInit, Output, Input, EventEmitter, SimpleChange } from '@angular/core';

import { Form } from '../../models/form.model';
import { FormListService } from './form-list.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
@Component({
    selector: 'form-list',
    templateUrl: 'form-list.component.html',
    styleUrls: ['./form-list.component.css']
})
export class FormListComponent implements OnInit {
    @Input() excludedForms = [];
    @Output() onFormSelected = new EventEmitter();
    forms: Array<Form>;
    selectedForm: Form;
    filterTerm: string = '';
    constructor(private formListService: FormListService,
        private formOrderMetaDataService: FormOrderMetaDataService) { }

    ngOnInit() {
        this.getForms();
    }

    getForms() {
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
    toggleFavourite($event, form: Form) {
        $event.stopPropagation();
        if (form === undefined || form === null) throw new Error('Form is required');
        if (form['favourite'] === true) {
            this.formOrderMetaDataService.removeFavouriteForm(form.name);
        } else {
            this.formOrderMetaDataService.setFavouriteForm(form.name);
        }
        this.getForms();
    }
    formSelected($event, form: Form) {
        $event.stopPropagation();
        this.selectedForm = form;
        this.onFormSelected.emit(form);
    }
    valuechange(newValue) {
        this.filterTerm = newValue;
    }

    isLoading(form: Form): boolean {
        return form === this.selectedForm;
    }
}
