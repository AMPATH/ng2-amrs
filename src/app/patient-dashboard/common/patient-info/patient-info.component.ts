import { Component, OnInit, OnDestroy , AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../../services/patient.service';

import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit, OnDestroy, AfterViewInit {

  public patient: Patient;
  public subscription: Subscription;
  public routeSub: Subscription;
  public scrollSection = '';
  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService, private route: ActivatedRoute) {
  }
  public ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          console.log(this.patient._identifier);
        }
      }
    );
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Info Loaded', 'ngOnInit');
    this.routeSub = this.route.queryParams
    .subscribe((params: any) => {
      if (params.scrollSection) {
          this.scrollSection = params.scrollSection;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.routeSub) {
          this.routeSub.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    if (this.scrollSection !== '' || typeof this.scrollSection !== 'undefined') {
      setTimeout(() => {
        this.scrollToSection(this.scrollSection);
      }, 3000);

    }
  }

  public scrollToSection(section: string) {
        console.log('scroll section', section);
        const element = document.getElementById(section);
        console.log('scroll element', element);
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
  }

}
