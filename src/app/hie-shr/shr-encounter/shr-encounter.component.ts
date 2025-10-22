import { Component, Input } from '@angular/core';
import { ShrEncounter } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-encounter',
  templateUrl: './shr-encounter.component.html',
  styleUrls: ['./shr-encounter.component.scss']
})
export class ShrEncounterComponent {
  @Input() shrEncounter: ShrEncounter;
}
