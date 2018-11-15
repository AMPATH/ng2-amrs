import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FormSchemaService } from '../formentry/form-schema.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
              private formSchemaService: FormSchemaService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Forms Component Loaded', 'ngOnInit');
  }

  public formSelected(form) {
    if (form) {
      // @Analytics: indicate the start of form loading
      this.appFeatureAnalytics
        .trackEvent('Patient Dashboard', 'Form Loading Started', 'formSelected');

      // Navigate to formentry component/view
      this.router.navigate(['../formentry', form.uuid], { relativeTo: this.route });
    }
  }
}
