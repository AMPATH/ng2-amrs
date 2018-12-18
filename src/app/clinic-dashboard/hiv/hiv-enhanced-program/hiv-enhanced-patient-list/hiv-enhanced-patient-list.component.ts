import {
  Component, OnInit, Input
} from '@angular/core';
@Component({
  selector: 'app-hiv-enhanced-patient-list',
  templateUrl: './hiv-enhanced-patient-list.component.html',
  styleUrls: []
})
export class HivEnhancedPatientListComponent implements OnInit {

  @Input() public startDate: Date;
  @Input() public endDate: Date;
  @Input() public patientData: any;
  @Input() public isLoadingPatientList = false;
  @Input() public extraColumns: any;

  constructor() {}

  public ngOnInit() {}

}
