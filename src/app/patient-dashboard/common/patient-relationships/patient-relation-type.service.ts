import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PatientRelationshipTypeResourceService } from "../../../openmrs-api/patient-relationship-type-resource.service";

@Injectable()
export class PatientRelationshipTypeService {
  constructor(
    private patientRelationshipTypeResourceService: PatientRelationshipTypeResourceService
  ) {}

  public getRelationshipTypes(): Observable<any> {
    return this.patientRelationshipTypeResourceService.getPatientRelationshipTypes();
  }
}
