import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';

@Component({
  selector: 'edit-retro-provider',
  templateUrl: './edit-retro-visit-provider.component.html',
  styleUrls: []
})

export class EditRetroVisitProviderComponent implements OnInit {
  @Input() public isEditRetroProvider: boolean;
  @Input() public visit: any;
  @Output() public retroVisitProviderChanged = new EventEmitter<any>();
  public provider: any;
  public providers: any[];
  public saving: boolean = false;
  public constructor(private visitResourceService: VisitResourceService,
                     private providerResourceService: ProviderResourceService) {

  }

  public ngOnInit() {
    this.fetchProviderOptions();
  }

  public fetchProviderOptions() {
    let findProvider = this.providerResourceService.searchProvider('', false);
    findProvider.subscribe(
      (provider) => {
        let filtered = _.filter(provider, (p: any) => {
          return !_.isUndefined(p.person);
        });
        this.providers = filtered.map((p: any) => {
          if (!_.isNil(p.display)) {
            return {
              value: p.uuid,
              label: p.display,
              providerUuid: p.uuid
            };
          }
        });
      },
      (error) => {
        console.error(error); // test case that returns error
      }
    );
  }

  public updateVisit() {
    this.saving = true;
    let visitPayload = {
      visitType: this.visit.visitType.uuid,
      startDatetime: new Date(),
      attributes: [
        {
          attributeType: '3bb41949-6596-4ff9-a54f-d3d7883a69ed',
          value: this.provider.label
        }
      ]
    };
    this.visitResourceService.updateVisit(this.visit.uuid, visitPayload)
      .subscribe((updateVisit) => {
        this.saving = false;
        this.retroVisitProviderChanged.emit(updateVisit);
      });

  }

}
