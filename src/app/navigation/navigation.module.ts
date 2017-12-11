import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { StaticNavBarComponent } from './static-navbar/static-navbar.component';
import { NavigationService } from './navigation.service';
import { PatientSideNavComponent
} from './side-navigation/patient-side-nav/patient-side-nav.component';
import { FormUpdaterService } from '../patient-dashboard/common/formentry/form-updater.service';
import { FormOrderMetaDataService }
from '../patient-dashboard/common/forms/form-order-metadata.service';
import { FormSchemaService } from '../patient-dashboard/common/formentry/form-schema.service';
import { FormSchemaCompiler } from 'ng2-openmrs-formentry';
import { FormsResourceService } from '../openmrs-api/forms-resource.service';
import { FormListService } from '../patient-dashboard/common/forms/form-list.service';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgamrsSharedModule
  ],
  exports: [SideNavigationComponent, StaticNavBarComponent, PatientSideNavComponent],
  declarations: [SideNavigationComponent, StaticNavBarComponent, PatientSideNavComponent],
  providers: [NavigationService,
    FormUpdaterService,
    FormOrderMetaDataService,
    FormSchemaService,
    FormSchemaCompiler,
    FormListService ],

})
export class NavigationModule {
}
