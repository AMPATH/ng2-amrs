import { Component, OnInit, Input } from '@angular/core';

import { Patient } from '../patients';//added

@Component({
  moduleId: module.id,
  selector: 'patient-banner',
  templateUrl: 'patient-banner.component.html',
  styleUrls: ['patient-banner.component.css']
})


export class PatientBannerComponent implements OnInit {
  //Assign the selected patient here
  @Input()
  patient :Patient;

  constructor() { }

  ngOnInit() {
  }

}

