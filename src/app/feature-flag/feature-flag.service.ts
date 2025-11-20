import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDefaultPropertiesService } from '../user-default-properties';
import { FeatureFlagContext, FeatureFlagResponse } from './types';

@Injectable()
export class FeatureFlagService {
  constructor(
    private httpClient: HttpClient,
    private userDefaultPropertyService: UserDefaultPropertiesService
  ) {}
  private fatureFlagBaseUrl =
    'https://ngx.ampath.or.ke/feature-flag-service/api/rules/feature-flag';

  getFeatureFlag(featureFlagName: string): Observable<FeatureFlagResponse> {
    {
      console.log(
        'LOCATION: ' +
          this.userDefaultPropertyService.getCurrentUserDefaultLocation()
      );
      return this.httpClient.post(this.fatureFlagBaseUrl, {
        featureFlagName,
        context: this.getContext()
      });
    }
  }

  getContext(): FeatureFlagContext {
    return {
      location: this.userDefaultPropertyService.getCurrentUserDefaultLocation()
    };
  }
}
