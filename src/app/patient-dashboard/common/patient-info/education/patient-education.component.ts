import { Component, Input, OnInit } from "@angular/core";
import { Patient } from "src/app/models/patient.model";
import { ConceptResourceService } from "src/app/openmrs-api/concept-resource.service";

@Component({
  selector: "patient-education",
  templateUrl: "./patient-education.component.html",
  styleUrls: ["./patient-education.component.css"],
})
export class PatientEducationComponent implements OnInit {
  public patientHighestEducation: any;
  @Input() public patient: Patient;

  public ngOnInit() {}
}
