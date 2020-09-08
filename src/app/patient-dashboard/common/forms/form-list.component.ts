import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  SimpleChange
} from '@angular/core';

import { Form } from '../../../models/form.model';
import { FormListService } from './form-list.service';
import { FormOrderMetaDataService } from './form-order-metadata.service';
@Component({
  selector: 'form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.css']
})
export class FormListComponent implements OnInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onFormSelected = new EventEmitter();
  public forms: Array<Form>;
  public allForms: Array<Form>;
  public selectedForm: Form;
  public filterTerm = '';

  @Input()
  public showFilter = true;

  private _excludedForms: Array<string>;
  @Input()
  public get excludedForms(): Array<string> {
    return this._excludedForms;
  }
  public set excludedForms(v: Array<string>) {
    this._excludedForms = v;
    this.filterOutDisallowedAndCompletedForms();
  }

  private _encounterTypeFilter: Array<string>;
  @Input()
  public get encounterTypeFilter(): Array<string> {
    return this._encounterTypeFilter;
  }
  public set encounterTypeFilter(v: Array<string>) {
    this._encounterTypeFilter = v;
    this.filterOutDisallowedAndCompletedForms();
  }

  constructor(
    private formListService: FormListService,
    private formOrderMetaDataService: FormOrderMetaDataService
  ) {}

  public ngOnInit() {
    this.getForms();
  }

  public getForms() {
    this.forms = [];
    this.formListService.getFormList().subscribe((forms) => {
      this.allForms = forms;
      this.filterOutDisallowedAndCompletedForms();
    });
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

  public filterOutDisallowedAndCompletedForms() {
    if (!Array.isArray(this.allForms)) {
      return;
    }
    // filter by excludedForms
    if (Array.isArray(this.excludedForms) && this.excludedForms.length > 0) {
      this.forms = this.allForms.filter((a) => {
        if (a.encounterType) {
          if (this.excludedForms.indexOf(a.encounterType.uuid) > -1) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
    } else {
      this.forms = this.allForms;
    }
    // filter by visitTypeForms
    if (
      Array.isArray(this.encounterTypeFilter) &&
      this.encounterTypeFilter.length > 0
    ) {
      this.forms = this.forms.filter((form) => {
        if (
          form.encounterType &&
          this.encounterTypeFilter.indexOf(form.encounterType.uuid) > -1
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
  }
}
