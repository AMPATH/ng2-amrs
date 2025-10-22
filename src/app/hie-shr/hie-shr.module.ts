import { NgModule } from '@angular/core';
import { ShrRendererComponent } from './shr-renderer/shr-renderer.component';
import { ShrPatientComponent } from './shr-patient/shr-patient.component';
import { ShrEncounterComponent } from './shr-encounter/shr-encounter.component';
import { ShrConditionComponent } from './shr-condition/shr-condition.component';
import { ShrServiceRequestComponent } from './shr-service-request/shr-service-request.component';
import { ShrObservationComponent } from './shr-observation/shr-observation.component';
import { ShrSpecimenComponent } from './shr-specimen/shr-specimen.component';
import { HieShrHelperService } from './hie-shr-helper.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ShrCodingComponent } from './shr-coding/shr-coding.component';
import { ShrIdentifierDetailsComponent } from './shr-identifier/details/shr-identifier-details.component';
import { ShrMedicationRequestDetailsComponent } from './shr-medication-request/shr-medication-request-details.component';

@NgModule({
  imports: [CommonModule],
  providers: [HieShrHelperService],
  declarations: [
    ShrRendererComponent,
    ShrPatientComponent,
    ShrEncounterComponent,
    ShrConditionComponent,
    ShrServiceRequestComponent,
    ShrObservationComponent,
    ShrSpecimenComponent,
    ShrCodingComponent,
    ShrIdentifierDetailsComponent,
    ShrMedicationRequestDetailsComponent
  ],
  exports: [ShrRendererComponent]
})
export class HieShrModule {}
