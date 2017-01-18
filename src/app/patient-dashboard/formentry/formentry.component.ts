import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FormSchemaService } from '../formentry/form-schema.service';
import { FormentryHelperService } from './formentry-helper.service';
import { Form } from 'ng2-openmrs-formentry';
import { FormFactory, EncounterAdapter } from 'ng2-openmrs-formentry';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { PatientPreviousEncounterService } from '../patient-previous-encounter.service';

import { UserService } from '../../openmrs-api/user.service';
import { UserDefaultPropertiesService } from
  '../../user-default-properties/user-default-properties.service';

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
  private encounterUuid: string = null;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private route: ActivatedRoute,
    private formFactory: FormFactory,
    private encounterResource: EncounterResourceService,
    private encounterAdapter: EncounterAdapter,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private userService: UserService) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Formentry Component Loaded', 'ngOnInit');
    // get formUuid from route Params
    this.route
      .queryParams.subscribe((params) => {
        this.encounterUuid = params['encounter'];
      });
    this.route
      .params.subscribe((params) => {
        this.selectedFormUuid = params['formUuid'];
      });

    this.isBusyIndicator(true, 'Please wait, fetching form'); // show busy indicator
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
  getEncounter() {
    this.encounterResource.getEncounterByUuid(this.encounterUuid).subscribe((encounter) => {
      console.log('Enecounter', encounter);
      this.encounterAdapter.populateForm(this.form, encounter);
    }, (error) => {

    });
  }

  private loadDefaultValues(): void {

    let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    let currentUser = this.userService.getLoggedInUser();
    let currentDate = new Date();

    let encounterDate = this.form.searchNodeByQuestionId('encDate');
    if (encounterDate.length > 0) {
      encounterDate[0].control.setValue(currentDate);
    }

    let encounterLocation = this.form.searchNodeByQuestionId('location');
    if (encounterLocation.length > 0 && location) {
      encounterLocation[0].control.setValue(location.uuid);
    }

    let encounterProvider = this.form.searchNodeByQuestionId('provider');
    if (encounterProvider.length > 0 && currentUser) {
      encounterProvider[0].control.setValue(currentUser.personUuid);
    }

  }

  private loadSelectedForm(): void {

    if (this.selectedFormUuid) {
      this.route.data.subscribe((resolvedForm: any) => {
        this.isBusyIndicator(false); // hide indicator
        this.form = this.formFactory.createForm(resolvedForm.compiledSchemaWithEncounter.schema
          , resolvedForm.compiledSchemaWithEncounter.encounter);
        if (this.encounterUuid && this.encounterUuid !== '') {
          this.getEncounter();
        }
        // populate default values
        this.loadDefaultValues();
      });
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
