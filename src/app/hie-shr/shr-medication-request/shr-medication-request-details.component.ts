import { Component, Input } from '@angular/core';
import { ShrMedicationRequest } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-medication-request-details',
  templateUrl: './shr-medication-request-details.component.html',
  styleUrls: ['./shr-medication-request-details.component.scss']
})
export class ShrMedicationRequestDetailsComponent {
  @Input() shrMedicationRequest: ShrMedicationRequest;
}
