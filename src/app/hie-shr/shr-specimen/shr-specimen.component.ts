import { Component, Input } from '@angular/core';
import { ShrSpecimen } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-specimen',
  templateUrl: './shr-specimen.component.html',
  styleUrls: ['./shr-specimen.component.scss']
})
export class ShrSpecimenComponent {
  @Input() public shrSpecimen: ShrSpecimen;
}
