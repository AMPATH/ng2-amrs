import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'patient-banner',
  templateUrl: 'patient-banner.component.html',
  styleUrls: ['patient-banner.component.css']
})


export class PatientBannerComponent implements OnInit {
  //Assign the selected patient here
  patient = {
      fullName: "Test One Spens ",
      gender: 'M',
      dob: 1212345123,
      age: 34,
      ampathMrsUId: 163238471-3,
      amrsMrn : 456789,
      kenyaNationalId: 16150-2013
  };

  constructor() { }

  ngOnInit() {
  }

}
