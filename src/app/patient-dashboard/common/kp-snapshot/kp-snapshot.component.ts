import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-kp-snapshot',
  templateUrl: './kp-snapshot.component.html',
  styleUrls: ['./kp-snapshot.component.css']
})
export class KpSnapshotComponent implements OnInit {
  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
}
