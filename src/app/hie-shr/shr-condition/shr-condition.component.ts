import { Component, Input } from '@angular/core';
import { ShrCondition } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-condition',
  templateUrl: './shr-condition.component.html',
  styleUrls: ['./shr-condition.component.scss']
})
export class ShrConditionComponent {
  @Input() public shrCondition: ShrCondition;
}
