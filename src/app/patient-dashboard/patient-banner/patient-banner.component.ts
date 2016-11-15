import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../patients';
@Component({
  selector: 'patient-banner',
  templateUrl: 'patient-banner.component.html',
  styleUrls: ['patient-banner.component.css']
})


export class PatientBannerComponent implements OnInit {

  @Input() patient: Patient;

  constructor() { }

  ngOnInit() {
  }

}

