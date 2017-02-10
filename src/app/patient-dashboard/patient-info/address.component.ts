import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';




@Component({
  selector: 'address',
  templateUrl: 'address.component.html',
  styleUrls: [],
})
export class AddressComponent implements OnInit {
  patients: Patient = new Patient({});

  constructor(private patientService: PatientService) { }
  ngOnInit(): void {
    this.getPatient();
  }
  getPatient() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patients = new Patient({});
        if (patient) {
          this.patients = patient;
        }
      }
    );
  }





}


