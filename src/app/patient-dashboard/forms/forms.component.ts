import { Component, OnInit } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FormSchemaService } from '../formentry/form-schema.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
              private formSchemaService: FormSchemaService) {
  }

  ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Forms Component Loaded', 'ngOnInit');
  }

  formSelected(form) {
    console.log('Form Selected', form);
    this.formSchemaService.getFormSchemaByUuid(form.uuid).subscribe(
      (data) => {
        console.log('form', data);
      },
      (err) => {
        console.log('error', err);
      }
    );

  }
}
