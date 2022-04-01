import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-patient-gains-and-losses-dashboard-view',
  templateUrl: './patient-gains-and-losses-dashboard-view.component.html',
  styleUrls: ['./patient-gains-and-losses-dashboard-view.component.css']
})
export class PatientGainsAndLossesDashboardViewComponent
  implements OnInit, OnChanges {
  @Input() public patientGainAndLoseData: any;
  @Output() public indicatorSelected = new EventEmitter();
  public patientGainAndLoseSummaryData: any;
  constructor() {}

  public ngOnInit(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.patientGainAndLoseData) {
      this.patientGainAndLoseSummaryData =
        changes.patientGainAndLoseData.currentValue;
    }
  }
  public onIndicatorSelected(indicator: string, title: string) {
    const payload = {
      value: indicator,
      header: title,
      location: ''
    };
    this.indicatorSelected.emit(payload);
  }
}
