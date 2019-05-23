import {
  Component, OnInit, Input
} from '@angular/core';
@Component({
  selector: 'app-hiv-differentiated-care-patient-list',
  templateUrl: './hiv-differentiated-care-patient-list.component.html',
  styleUrls: []
})
export class HivDifferentiatedCarePatientListComponent implements OnInit {

  @Input() public startDate: Date;
  @Input() public endDate: Date;
  @Input() public patientData: any;
  @Input() public isLoadingPatientList = false;
  @Input() public extraColumns: any;

  constructor() {}

  public ngOnInit() {}

}
