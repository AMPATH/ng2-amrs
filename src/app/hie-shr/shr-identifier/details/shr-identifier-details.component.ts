import { Component, Input } from '@angular/core';
import { ShrIdentifier } from '../../../models/hie-shr.model';

@Component({
  selector: 'app-shr-identifier',
  templateUrl: './shr-identifier-details.component.html',
  styleUrls: ['./shr-identifier-details.component.scss']
})
export class ShrIdentifierDetailsComponent {
  @Input() shrIdentifier: ShrIdentifier;
}
