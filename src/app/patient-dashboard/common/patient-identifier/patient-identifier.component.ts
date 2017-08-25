import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'patient-identifier',
  templateUrl: './patient-identifier.component.html',
  styleUrls: ['./patient-identifier.component.css']
})
export class PatientIdentifierComponent implements OnInit {

  @Input()
  public identifiers: Array<{}> = [];

  constructor() { }

  public ngOnInit() {

  }
}
