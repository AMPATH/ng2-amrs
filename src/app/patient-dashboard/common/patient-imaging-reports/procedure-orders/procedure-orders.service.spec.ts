// import { TestBed, inject } from '@angular/core/testing';

// import { ProcedureOrdersService } from './procedure-orders.service';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
// import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
// import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
// import { FileUploadResourceService } from 'src/app/etl-api/file-upload-resource.service';
// import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
// import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
// import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
// import { UserService } from 'src/app/openmrs-api/user.service';
// import { FormsModule } from '@angular/forms';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CacheModule } from 'ionic-cache';
// import { PatientDashboardCommonModule } from '../patient-dashboard.common.module';
// import { ModalModule } from 'ngx-bootstrap';
// import { ToastrModule } from 'ngx-toastr';

// describe('ProcedureOrdersService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports:
//         [
//           FormsModule,
//           PatientDashboardCommonModule,
//           HttpClientTestingModule,
//           CacheModule.forRoot(),
//           ModalModule.forRoot(),
//           CacheModule.forRoot(),
//           ToastrModule.forRoot()
//         ],
//       providers: [ProcedureOrdersService,
//         UserService,
//         OrderResourceService,
//         ProcedureOrdersService,
//         EncounterResourceService,
//         UserDefaultPropertiesService,
//         FileUploadResourceService,
//         ConceptResourceService,
//         ObsResourceService],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA,
//         NO_ERRORS_SCHEMA]
//     });
//   });

//   it('should be created', inject([ProcedureOrdersService], (service: ProcedureOrdersService) => {
//     expect(service).toBeTruthy();
//   }));
// });
