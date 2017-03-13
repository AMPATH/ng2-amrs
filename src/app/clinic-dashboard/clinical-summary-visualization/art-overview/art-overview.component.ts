import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'art-overview-chart',
  styleUrls: ['./art-overview.component.css'],
  templateUrl: './art-overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ArtOverviewComponent {
  @Input() options: any;
  constructor() {
  }
}
