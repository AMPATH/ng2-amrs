import { Component, Input } from '@angular/core';
import { ShrPatient } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-patient',
  templateUrl: './shr-patient.component.html',
  styleUrls: ['./shr-patient.component.scss']
})
export class ShrPatientComponent {
  @Input() public shrPatient: ShrPatient;
}
