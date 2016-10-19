import { Component, OnInit } from '@angular/core';
import { PatientEncounters } from './patient-encounters';
import { PatientEncounterService } from './patient-encounters.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-encounters',
  templateUrl: './patient-encounters.component.html',
  styleUrls: ['./patient-encounters.component.css'],
  providers: [PatientEncounterService]
})
export class PatientEncountersComponent implements OnInit {
  busy: Subscription;
  encounters: PatientEncounters[];

  stacked: boolean;
  constructor(private PatientEncounterService: PatientEncounterService) { }
  getEncounters(): void {
    this.busy = this.PatientEncounterService.getEncounters().subscribe(data => this.encounters = data);
  }
  ngOnInit(): void {
    this.getEncounters();
  }

}
