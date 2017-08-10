import { Router } from '@angular/router';
import { Component, OnInit, Output, Input, EventEmitter, SimpleChange } from '@angular/core';
import { Form } from '../../models/form.model';
import { FormListService } from './form-list.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
import { PatientService } from '../patient.service';
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
    patient: any = [];
    message: string = '';
    hideFormList: boolean = false;

    constructor(private formListService: FormListService,
        private formOrderMetaDataService: FormOrderMetaDataService,
        private _patientService: PatientService) { }

    ngOnInit() {
        this.loadedPatient();
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
    loadedPatient() {
       this._patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = patient;
        if (patient) {
          this.patient = patient;
          this.hideFormList = patient.person.dead;
        }
      }
    );
    }
}
