import { Injectable } from "@angular/core";

@Injectable()
export class PatientEducationService {
  private allowedEducationLevels: Array<{ uuid: string; display: string }> = [
    {
      uuid: "a899e0ac-1350-11df-a1f1-0026b9348838",
      display: "NONE",
    },
    {
      uuid: "a8afe910-1350-11df-a1f1-0026b9348838",
      display: "PRIMARY SCHOOL",
    },
    {
      uuid: "a8afe9d8-1350-11df-a1f1-0026b9348838",
      display: "SECONDARY SCHOOL",
    },
    {
      uuid: "a8afea96-1350-11df-a1f1-0026b9348838",
      display: "COLLEGE",
    },
    {
      uuid: "a89e4728-1350-11df-a1f1-0026b9348838",
      display: "UNIVERSITY",
    },
    {
      uuid: "a8aaf3e2-1350-11df-a1f1-0026b9348838",
      display: "OTHER",
    },
  ];
  public getEducationLevels = () => this.allowedEducationLevels;
}
