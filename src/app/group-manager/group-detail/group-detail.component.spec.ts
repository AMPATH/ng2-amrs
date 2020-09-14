import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { GroupDetailComponent } from './group-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonsModule } from 'ngx-bootstrap';
import { NgamrsSharedModule } from 'src/app/shared/ngamrs-shared.module';
import { GroupDetailSummaryComponent } from './group-detail-summary.component';
import { MatCardModule, MatRadioModule } from '@angular/material';
import { PatientSearchComponent } from 'src/app/patient-search/patient-search.component';
import { GroupEditorComponent } from '../group-editor/group-editor-component';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

class MockActivatedRoute {
  public params = Observable.of([{ id: 1 }]);
  public snapshot = {
    queryParams: { filter: '' }
  };
}

describe('Group Detail Component Tests', () => {
  let component: GroupDetailComponent;
  let fixture: ComponentFixture<GroupDetailComponent>;
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
      declarations: [
        GroupDetailComponent,
        GroupDetailSummaryComponent,
        GroupEditorComponent,
        PatientSearchComponent
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GroupDetailComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
