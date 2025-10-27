import { Component, Input } from '@angular/core';
import { ShrObservation } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-observation',
  templateUrl: './shr-observation.component.html',
  styleUrls: ['./shr-observation.component.scss']
})
export class ShrObservationComponent {
  @Input() public shrObservation: ShrObservation;
}
