import { Component, Input } from '@angular/core';
import { ShrCoding } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-coding',
  templateUrl: './shr-coding.component.html',
  styleUrls: ['./shr-coding.component.scss']
})
export class ShrCodingComponent {
  @Input() shrCoding: ShrCoding;
}
