import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationResourceService } from './location-resource.service';
import { AppSettingsModule } from '../app-settings/app-settings.module';
import { FormsResourceService } from './forms-resource.service';
import { EncounterResourceService } from './encounter-resource.service';
import { PatientResourceService } from './patient-resource.service';
import { ProgramEnrollmentResourceService } from './program-enrollment-resource.service';
import { ProgramResourceService } from './program-resource.service';
import { UserService } from './user.service';
import { ProviderResourceService } from './provider-resource.service';
import { PersonResourceService } from './person-resource.service';
import { ConceptResourceService } from './concept-resource.service';
import { VisitResourceService } from './visit-resource.service';
import { OrderResourceService } from './order-resource.service';
import { PatientRelationshipResourceService } from './patient-relationship-resource.service';
import {
  PatientRelationshipTypeResourceService
 } from './patient-relationship-type-resource.service';
import { PatientIdentifierTypeResService } from './patient-identifierTypes-resource.service';
import { PatientCreationResourceService } from './patient-creation-resource.service';
import { ObsResourceService } from './obs-resource.service';
import { CommunityGroupService } from './community-group-resource.service';
import { CommunityGroupMemberService } from './community-group-member-resource.service';
import { CommunityGroupAttributeService } from './community-group-attribute-resource.service';
import { CommunityGroupLeaderService } from './community-group-leader-resource.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, AppSettingsModule],
  declarations: [],
  providers: [
    LocationResourceService,
    FormsResourceService,
    PatientResourceService,
    EncounterResourceService,
    ProgramResourceService,
    ProgramEnrollmentResourceService,
    CommunityGroupMemberService,
    UserService,
    ProviderResourceService,
    PersonResourceService,
    ConceptResourceService,
    VisitResourceService,
    OrderResourceService,
    PatientRelationshipResourceService,
    PatientRelationshipTypeResourceService,
    PatientIdentifierTypeResService,
    PatientCreationResourceService,
    ObsResourceService,
    CommunityGroupService,
    CommunityGroupMemberService,
    CommunityGroupAttributeService,
    CommunityGroupLeaderService,
  ],
  exports: []
})

export class OpenmrsApi {
}
