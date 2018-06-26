import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdCheckboxModule } from '@angular/material';

import { SharedModule, DialogModule } from 'primeng/primeng';

import { NgSelectModule } from '@ng-select/ng-select';
import { DataCacheService } from '../shared/services/data-cache.service';
import { RetrospectiveSettingsComponent, RetrospectiveBannerComponent,
  EditRetroVisitProviderComponent, RetrospectiveContainerComponent } from './components';
import { RetrospectiveDataEntryService } from './services/retrospective-data-entry.service';
import { UserDefaultPropertiesService
} from '../user-default-properties/user-default-properties.service';
import { BusyComponent } from '../shared/busy-loader/busy.component';
import { LocationFilterComponent
} from '../shared/locations/location-filter/location-filter.component';
import { PatientService } from '../patient-dashboard/services/patient.service';
import { PatientProgramService } from './../patient-dashboard/programs/patient-programs.service';
import { ProgramService } from './../patient-dashboard/programs/program.service';
import { ProgramWorkFlowResourceService } from './../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from
  './../openmrs-api/program-workflow-state-resource.service';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgSelectModule,
    MdCheckboxModule,
    SharedModule,
    DialogModule,
  ],
  exports: [MdCheckboxModule, NgSelectModule, RetrospectiveSettingsComponent, BusyComponent,
    LocationFilterComponent, RetrospectiveContainerComponent,
    RetrospectiveBannerComponent, EditRetroVisitProviderComponent],
  declarations: [BusyComponent, RetrospectiveSettingsComponent, RetrospectiveBannerComponent,
    EditRetroVisitProviderComponent, LocationFilterComponent, RetrospectiveContainerComponent],
  providers: [ DataCacheService, RetrospectiveDataEntryService, PatientService,
    UserDefaultPropertiesService, PatientProgramService , ProgramService ,
    ProgramWorkFlowResourceService, ProgramWorkFlowStateResourceService],
})
export class RetrospectiveDataEntryModule { }
