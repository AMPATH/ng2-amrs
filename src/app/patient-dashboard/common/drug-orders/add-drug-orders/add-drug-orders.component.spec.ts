import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

import { AddDrugOrdersComponent } from './add-drug-orders.component';
import * as _ from 'lodash';

import { DrugOrdersComponent } from '../drug-orders/drug-orders.component';
import { AppFeatureAnalytics } from 'src/app/shared/app-analytics/app-feature-analytics.service';
import { DrugOrderService } from '../drug-order.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap';
import { EditDrugComponent } from '../edit-drug/edit-drug.component';
import { DrugsFilterPipe } from '../drugs-filter.pipe';
import { ConfirmDialogModule, DialogModule } from 'primeng/primeng';
import { DrugOrderSetComponent } from '../drug-order-set/drug-order-set.component';
import { DrugOrderSetDraftComponent } from '../drug-order-set/drug-order-set-draft/drug-order-set-draft.component';
import { DrugSetFilterPipe } from '../drug-order-set/drugSet-filter.pipe';
import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { Angulartics2, RouterlessTracking } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientProgramService } from 'src/app/patient-dashboard/programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from 'src/app/patient-dashboard/programs/program.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { SessionStorageService } from 'src/app/utils/session-storage.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { DrugResourceService } from 'src/app/openmrs-api/drug-resource.service';
import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
import { PersonResourceService } from 'src/app/openmrs-api/person-resource.service';
import { LocationResourceService } from 'src/app/openmrs-api/location-resource.service';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { CacheService } from 'ionic-cache/dist/cache.service';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { PdfViewerModule } from 'ng2-pdf-viewer';
class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
      return true;
  }
}

describe('AddDrugOrdersComponent', () => {
  let component: AddDrugOrdersComponent;
  let fixture: ComponentFixture<AddDrugOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        FormsModule,
        NgxPaginationModule,
        DateTimePickerModule,
        PdfViewerModule,
        ConfirmDialogModule, DialogModule,
        ModalModule.forRoot()],
      providers: [
        DrugsFilterPipe,
        DrugSetFilterPipe,
        DatePipe,
        RouterlessTracking,
        DataCacheService,
        DrugOrdersComponent,
        RoutesProviderService,
        DrugResourceService,
        {
          provide: CacheStorageService, useFactory: () => {
              return new MockCacheStorageService(null, null);
          }
      },
        CacheService,
        ProviderResourceService,
        PersonResourceService,
        LocationResourceService,
        AppSettingsService,
        ConceptResourceService,
        OrderResourceService,
        UserService,
        SessionStorageService,
        ProgramEnrollmentResourceService,
        ProgramService,
        PatientProgramService,
        EncounterResourceService,
        LocalStorageService,
        PatientService,
        ProgramWorkFlowResourceService,
        PatientResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramResourceService,
        DrugOrderService],
      declarations: [AddDrugOrdersComponent,
        DrugOrdersComponent,
        DrugsFilterPipe,
        DrugSetFilterPipe,
        DrugOrderSetComponent,
        DrugOrderSetDraftComponent,
        EditDrugComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrugOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
