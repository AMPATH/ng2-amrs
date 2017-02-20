import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatientService } from './patient.service';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {

  public fetchingPatient: boolean = false;
  public patient: Patient;
  constructor(private router: Router, private route: ActivatedRoute,
    private patientService: PatientService) { }

  ngOnInit() {
    this.patientService.isBusy.subscribe(
      (isLoading) => {
       this.fetchingPatient = isLoading;
      }, (err) => {
        this.fetchingPatient = false;
      });
  }

}
