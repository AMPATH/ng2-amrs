import { Component, Input } from '@angular/core';
import { ShrServiceRequest } from '../../models/hie-shr.model';

@Component({
  selector: 'app-shr-service-request',
  templateUrl: './shr-service-request.component.html',
  styleUrls: ['./shr-service-request.component.scss']
})
export class ShrServiceRequestComponent {
  @Input() shrServiceRequest: ShrServiceRequest;
}
