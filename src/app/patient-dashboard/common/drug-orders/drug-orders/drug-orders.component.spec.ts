import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrdersComponent } from './drug-orders.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmDialogModule, DialogModule } from 'primeng/primeng';
import { ModalModule } from 'ngx-bootstrap';
import { DrugsFilterPipe } from '../drugs-filter.pipe';
import { DrugSetFilterPipe } from '../drug-order-set/drugSet-filter.pipe';
import { DatePipe } from '@angular/common';
import { RouterlessTracking } from 'angulartics2';
import { DataCacheService } from 'src/app/shared/services/data-cache.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { DrugResourceService } from 'src/app/openmrs-api/drug-resource.service';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { CacheService } from 'ionic-cache';
import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
import { PersonResourceService } from 'src/app/openmrs-api/person-resource.service';
import { LocationResourceService } from 'src/app/openmrs-api/location-resource.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { UserService } from 'src/app/openmrs-api/user.service';
import { SessionStorageService } from 'src/app/utils/session-storage.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramService } from 'src/app/patient-dashboard/programs/program.service';
import { PatientProgramService } from 'src/app/patient-dashboard/programs/patient-programs.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { DrugOrderService } from '../drug-order.service';
import { AddDrugOrdersComponent } from '../add-drug-orders/add-drug-orders.component';
import { DrugOrderSetComponent } from '../drug-order-set/drug-order-set.component';
import { DrugOrderSetDraftComponent } from '../drug-order-set/drug-order-set-draft/drug-order-set-draft.component';
import { EditDrugComponent } from '../edit-drug/edit-drug.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockCacheStorageService {
    constructor(a, b) { }
    public ready() {
        return true;
    }
  }
  class UserServiceStub {
    person = {
        display: 'test persion',
        personUuid: 'xbxla'
    };
    getLoggedInUser() {
        return {
            person: this.person
        };
    }
}
class FakeuserDefaultPropertiesService {
  location = {
    display: 'test location',
    personUuid: 'dxblatest'
  };
  getCurrentUserDefaultLocationObject() {
    return {
      location: this.location
    };
  }
}

describe('DrugOrdersComponent', () => {
  let component: DrugOrdersComponent;
  let fixture: ComponentFixture<DrugOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule,
            FormsModule,
            NgxPaginationModule,
            DateTimePickerModule,
            BrowserAnimationsModule,
            NoopAnimationsModule,
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
            { provide: UserDefaultPropertiesService, useClass: FakeuserDefaultPropertiesService },
            { provide: UserService, useClass: UserServiceStub },
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
    fixture = TestBed.createComponent(DrugOrdersComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
