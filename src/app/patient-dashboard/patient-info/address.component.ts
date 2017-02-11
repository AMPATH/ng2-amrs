import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';




@Component({
  selector: 'address',
  templateUrl: 'address.component.html',
  styleUrls: [],
})
export class AddressComponent implements OnInit {
  patients: Patient = new Patient({});
  private address1: string ;
  private address2: string ;
  private address3: string ;
  private cityVillage: string ;
  private stateProvince: string ;

  constructor(private patientService: PatientService,
              ) { }
  ngOnInit(): void {
    this.getPatient();
  }
  getPatient() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patients = new Patient({});
        if (patient) {
          this.patients = patient;
          this.address1 = (this.patients.person.preferredAddress as any).address1;
          this.address2 = (this.patients.person.preferredAddress as any).address2;
          this.address3 = (this.patients.person.preferredAddress as any).address3;
          this.cityVillage = (this.patients.person.preferredAddress as any).cityVillage;
          this.stateProvince = (this.patients.person.preferredAddress as any).stateProvince;
        }
      }
    );
  }

}


