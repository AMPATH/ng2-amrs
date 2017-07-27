import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { StaticNavBarComponent } from './static-navbar/static-navbar.component';
import { NavigationService } from './navigation.service';
import { PatientSideNavComponent
} from './side-navigation/patient-side-nav/patient-side-nav.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [SideNavigationComponent, StaticNavBarComponent, PatientSideNavComponent],
  declarations: [SideNavigationComponent, StaticNavBarComponent, PatientSideNavComponent],
  providers: [NavigationService]
})
export class NavigationModule {
}
