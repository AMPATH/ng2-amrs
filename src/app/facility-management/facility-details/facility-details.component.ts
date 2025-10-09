import { Component, Input } from '@angular/core';
import { HieFacility } from 'src/app/models/hie-registry.model';

@Component({
  selector: 'app-facility-details',
  templateUrl: './facility-details.component.html',
  styleUrls: ['./facility-details.component.scss']
})
export class FacilityDetailsComponent {
  @Input() public facility: HieFacility;
}
