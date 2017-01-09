import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FormSchemaService } from '../formentry/form-schema.service';
import { FormentryHelperService } from './formentry-helper.service';
import { Form } from 'ng2-openmrs-formentry';
import { FormFactory } from 'ng2-openmrs-formentry';

@Component({
  selector: 'app-formentry',
  templateUrl: './formentry.component.html',
  styleUrls: ['./formentry.component.css']
})
export class FormentryComponent implements OnInit, OnDestroy {

  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public form: Form;
  private selectedFormUuid: string = null;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private formSchemaService: FormSchemaService,
    private route: ActivatedRoute,
    private formentryHelperService: FormentryHelperService,
    private formFactory: FormFactory) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Formentry Component Loaded', 'ngOnInit');
    // get formUuid from route Params
    this.selectedFormUuid = this.route.snapshot.params['formUuid'];
    // load selected form
    this.loadSelectedForm();
  }

  public ngOnDestroy() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Formentry Component Unloaded', 'ngOnDestroy');
  }

  public onSubmit(): void {
    console.log('FORM MODEL:', this.form.rootNode.control);

    if (this.form.valid) {
      // submit form
    } else {
      this.form.markInvalidControls(this.form.rootNode);
    }
  }

  private loadSelectedForm(): void {
    if (this.selectedFormUuid) {
      this.isBusyIndicator(true, 'Please wait, fetching form'); // show busy indicator
      this.formSchemaService.getFormSchemaByUuid(this.selectedFormUuid).subscribe(
        (compiledFormSchema) => {
          console.log('compiledFormSchema', JSON.stringify(compiledFormSchema));
          this.isBusyIndicator(false); // hide busy indicator
          if (compiledFormSchema) {
            this.form = this.formFactory.createForm(compiledFormSchema);
          }
        },
        (err) => {
          console.log('error', err);
          this.isBusyIndicator(false); // hide busy indicator
        }
      );
    }
  }

  /**
   *
   *
   * @private
   * @param {boolean} isBusy
   * @param {string} [message='Please wait...']
   * You can override @message by passing any string
   * @memberOf FormentryComponent
   */
  private isBusyIndicator(isBusy: boolean, message: string = 'Please wait...'): void {
    if (isBusy === true) {
      this.busyIndicator = {
        busy: true,
        message: message
      };
    } else {
      this.busyIndicator = {
        busy: false,
        message: message
      };
    }

  }


}
