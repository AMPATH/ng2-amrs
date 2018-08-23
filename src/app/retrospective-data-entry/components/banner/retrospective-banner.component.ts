import { Component, OnInit } from '@angular/core';

import { RetrospectiveDataEntryService
} from '../../services/retrospective-data-entry.service';

@Component({
  selector: 'retrospective-banner',
  templateUrl: './retrospective-banner.component.html',
  styleUrls: ['./retrospective-banner.component.css']
})

export class RetrospectiveBannerComponent implements OnInit {
  public displayDialog: boolean = false;
  public retroEnabled: boolean = false;
  public constructor(private retrospectiveDataEntryService: RetrospectiveDataEntryService) {

  }

  public ngOnInit() {
    this.retroEnabled = this.retrospectiveDataEntryService
      .getProperty('enableRetro') === 'true';
    this.retrospectiveDataEntryService.enableRetro.next(this.retroEnabled);
    this.retrospectiveDataEntryService.enableRetro.subscribe((enabled: boolean) => {
      if (!enabled && this.displayDialog) {
          this.displayDialog = false;
      }
      this.retroEnabled = enabled;
    });
  }

  public toggleDialog(state: boolean) {
    this.displayDialog = state;
  }
}
