import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { PatientService } from "./../../../services/patient.service";
import { Patient } from "./../../../../models/patient.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-occupation",
  templateUrl: "./occupation.component.html",
  styleUrls: ["./occupation.component.css"],
})
export class OccupationComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public occupationAttributeTypeUuid = "9e86409f-9c20-42d0-aeb3-f29a4ca0a7a0";
  public currentOccupation = [];
  public hasOccupation = false;
  @Input() public patient: Patient;

  constructor(private patientService: PatientService) {}
  public ngOnInit(): void {
    this.getPatient();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient: any) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.getPersonOccupation(patient.person);
        }
      }
    );
  }

  public reloadPatient() {
    this.getPatient();
  }

  public getPersonOccupation(person: any) {
    this.currentOccupation = person.attributes.filter((attribute: any) => {
      return attribute.attributeType.uuid === this.occupationAttributeTypeUuid;
    });
    this.assessCurrentOccupation(this.currentOccupation);
  }

  public assessCurrentOccupation(currentOccupation: any) {
    if (currentOccupation.length > 0) {
      this.hasOccupation = true;
    } else {
      this.hasOccupation = false;
    }
  }
}
