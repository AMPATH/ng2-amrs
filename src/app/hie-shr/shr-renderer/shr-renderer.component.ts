import { Component, Input } from '@angular/core';
import { FhirBundle } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shir-renderer',
  templateUrl: './shr-renderer.component.html',
  styleUrls: ['./shr-renderer.component.scss']
})
export class ShrRendererComponent {
  @Input() public shrBundle: FhirBundle;
}
