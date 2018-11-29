import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonsModule } from 'ngx-bootstrap';
import { NgamrsSharedModule } from 'src/app/shared/ngamrs-shared.module';
import { MatCardModule, MatRadioModule } from '@angular/material';
import { PatientSearchComponent } from 'src/app/patient-search/patient-search.component';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupEditorComponent } from './group-editor-component';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DepartmentProgramsConfigService } from 'src/app/etl-api/department-programs-config.service';

class MockActivatedRoute {
    public params = Observable.of([{ 'id': 1 }]);
    public snapshot = {
        queryParams: { filter: '' }
    };
}

class MockCacheStorageService {
    constructor(a, b) {
    }

    public ready() {
        return true;
    }
}

describe('Group Editor Component Tests', () => {
    let component: GroupEditorComponent;
    let fixture: ComponentFixture<GroupEditorComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                AgGridModule,
                ButtonsModule,
                NgamrsSharedModule,
                MatCardModule,
                MatRadioModule,
                CommonModule,
                RouterTestingModule


            ],
            declarations: [GroupEditorComponent,
                GroupEditorComponent,
                PatientSearchComponent],
            providers: [
                DatePipe,
                CacheService,
                DepartmentProgramsConfigService,
                {
                    provide: CacheStorageService, useuseFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
                {
                    provide: ActivatedRoute,
                    useClass: MockActivatedRoute
                },
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(GroupEditorComponent);
                component = fixture.componentInstance;
            });
    }));

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

});
