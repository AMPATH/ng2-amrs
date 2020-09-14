import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Encounter } from './encounter.model';
import { Patient } from './patient.model';
import { PersonAddress } from './address.model';
import { ConceptClass } from './concept-class.model';
import { Concept } from './concept-model';
import { ConceptName } from './concept-name.model';
import { EncounterType } from './encounter-type.model';
import { Form } from './form.model';
import { Location } from './location.model';
import { PatientIdentifier } from './patient-identifier.model';
import { PatientIdentifierType } from './patient-identifier-type.model';
import { Person } from './person.model';
import { PersonAttribute } from './person-attribute.model';
import { PersonAttributeType } from './person-attribute-type.model';
import { Program } from './program.model';
import { ProgramEnrollment } from './program-enrollment.model';
import { Provider } from './provider.model';
import { Relationship } from './relationship.model';
import { RelationshipType } from './relationship-type.model';
import { User } from './user.model';
import { Visit } from './visit.model';
import { Vital } from './vital.model';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [],
  exports: []
})
export class ModelsModule {}
