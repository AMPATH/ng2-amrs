import { Directive, Input } from '@angular/core';
import { FormEntryModule } from 'ng2-openmrs-formentry';
import { PatientEncounterObservationsComponent } from './patient-encounter-observations.component';
import { TestBed } from '@angular/core/testing';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PrettyEncounterViewerComponent } from '../formentry/pretty-encounter-viewer.component';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';

@Directive({
  selector: `modal-header`
})
export class FakeModalHeaderDirective {
  @Input('show-close') public showClose: boolean;
}

@Directive({
  selector: `modal-body`
})
export class FakeModalBodyDirective {
}

export class FakeEncounterResourceService {
}

describe('Component: PatientEncounterObservationsComponent', () => {
  let component: PatientEncounterObservationsComponent;
  let encounter: any;
  let processedObs: any;
  let fixture: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatientEncounterObservationsComponent,
        FakeModalHeaderDirective,
        FakeModalBodyDirective,
        ModalComponent,
        PrettyEncounterViewerComponent
      ],
      imports: [ModalModule.forRoot(), FormEntryModule],
      providers: [
        {
          provide: EncounterResourceService,
          useFactory: () => {
            return new FakeEncounterResourceService();
          }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientEncounterObservationsComponent);
    component = fixture.componentInstance;
    encounter = {
      'obs': [
        {
          'concept': {
            'name': {
              'display': 'SKIN EXAM FINDINGS'
            }
          },
          'value': {
            'display': 'RASH'
          },
          'groupMembers': null
        },
        {
          'concept': {
            'name': {
              'display': 'TUBERCULOSIS TREATMENT COMPLETED DATE'
            }
          },
          'value': 120.0,
          'groupMembers': null
        },
        {
          'concept': {
            'name': {
              'display': 'TUBERCULOSIS TREATMENT COMPLETED DATE'
            }
          },
          'groupMembers': [
            {
              'concept': {
                'display': 'TUBERCULOSIS TREATMENT PLAN'
              },
              'value': {
                'display': 'CONTINUE REGIMEN'
              }
            }
          ]
        }
      ]
    };
    processedObs = component.processEncounter(encounter);
  });

  it('should be be defined', () => {
    expect(component).toBeDefined();
  });

  it('should process an encounter with an object observation value', () => {
    expect(processedObs[0].label).toEqual('SKIN EXAM FINDINGS');
    expect(processedObs[0].value).toEqual('RASH');
  });

  it('should process an encounter with non-object observation value', () => {
    expect(processedObs[1].label).toEqual('TUBERCULOSIS TREATMENT COMPLETED DATE');
    expect(processedObs[1].value).toEqual(120.0);
  });

  it('should process an encounter observation with groupMembers', () => {
    expect(processedObs[2].label).toEqual('TUBERCULOSIS TREATMENT COMPLETED DATE');
    expect(processedObs[2].has_children).toBeTruthy();
    expect(processedObs[2].value[0].label).toEqual('TUBERCULOSIS TREATMENT PLAN');
    expect(processedObs[2].value[0].value).toEqual('CONTINUE REGIMEN');
  });

});
