import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../openmrs-api/user.service';
import { UserDefaultPropertiesService } from '../../user-default-properties/user-default-properties.service';
import { AuthenticationService } from '../../openmrs-api/authentication.service';
import { User } from '../../models/user.model';
import { LocalStorageService } from '../../utils/local-storage.service';
import { FormUpdaterService } from '../../patient-dashboard/common/formentry/form-updater.service';
import { RoleUuids } from 'src/app/constants/role.contants';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { takeUntil, tap } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
@Component({
  selector: 'static-navbar',
  templateUrl: './static-navbar.component.html',
  styles: ['.mr-1 { margin-right: 1rem }']
})
export class StaticNavBarComponent implements OnInit, OnDestroy {
  public user: User;
  public userLocation = '';
  public department: any;
  private viewPractionionerData = false;
  private hieHwrFeatureFlag = false;
  private hieFrFeatureFlag = false;
  private destroy$ = new Subject<boolean>();

  constructor(
    private router: Router,
    private localStore: LocalStorageService,
    private authenticationService: AuthenticationService,
    private userDefaultSettingsService: UserDefaultPropertiesService,
    private userService: UserService,
    private formUpdaterService: FormUpdaterService,
    private featureFlagService: FeatureFlagService
  ) {}

  public ngOnInit() {
    this.getFeatureFlags();
    this.setUserLocation();
    const department = this.localStore.getItem('userDefaultDepartment');
    if (department) {
      this.department = JSON.parse(department)[0].itemName;
    }
    if (localStorage.getItem('cacheCleared') === 'true') {
      this.updateForms();
      this.formUpdaterService.showPlainToast(
        'Cache cleared successfully',
        3000
      );
      localStorage.removeItem('cacheCleared');
    }
    this.canViewPractitioners();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public logout() {
    this.router.navigateByUrl('/login').then((result) => {
      if (result) {
        this.authenticationService.logOut();
      }
    });
  }

  private setUserLocation() {
    this.user = this.userService.getLoggedInUser();
    this.userDefaultSettingsService.locationSubject.subscribe((location) => {
      if (location) {
        this.userLocation = JSON.parse(location)
          ? JSON.parse(location).display
          : '';
      } else {
        const defaultLocation = this.localStore.getItem(
          'userDefaultLocation' + this.user.display
        );
        this.userLocation = JSON.parse(defaultLocation)
          ? JSON.parse(defaultLocation).display
          : undefined;
      }
    });
  }

  private updateForms() {
    this.formUpdaterService.getUpdatedForms();
  }
  private clearCache() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
        caches
          .keys()
          .then((cacheNames) => {
            return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
          })
          .then(() => {
            localStorage.setItem('cacheCleared', 'true');
            window.location.reload(); // Refresh the app
          });
      });
    }
  }
  public canViewPractitioners() {
    this.viewPractionionerData = this.userService.hasRole(
      RoleUuids.CLINICAL_STAFF_VIEWER.name
    );
  }
  navigateToAfyaYangu() {
    window.open('https://afyayangu.go.ke/', '_blank');
  }
  getFeatureFlags() {
    combineLatest([
      this.getHwrFeatureFlag(),
      this.getFacilityRegistryFeatureFlag()
    ])
      .pipe(
        takeUntil(this.destroy$),
        tap(([hwrFf, frFF]) => {
          if (hwrFf.location) {
            this.hieHwrFeatureFlag = hwrFf.location;
          }
          if (frFF.location) {
            this.hieFrFeatureFlag = frFF.location;
          }
        })
      )
      .subscribe();
  }
  getHwrFeatureFlag() {
    return this.featureFlagService
      .getFeatureFlag('health-worker-registry')
      .pipe(takeUntil(this.destroy$));
  }
  getFacilityRegistryFeatureFlag() {
    return this.featureFlagService
      .getFeatureFlag('facility-registry')
      .pipe(takeUntil(this.destroy$));
  }
}
