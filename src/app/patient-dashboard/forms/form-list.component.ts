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
    @Input() encounterTypeFilter: Array<string> = [];
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
              // filter by excludedForms
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
                // filter by visitTypeForms
                if (this.encounterTypeFilter.length > 0 ) {
                  this.forms = forms.filter((form) => {
                    if (this.encounterTypeFilter.indexOf(form.encounterType.uuid) > -1) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                }
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
