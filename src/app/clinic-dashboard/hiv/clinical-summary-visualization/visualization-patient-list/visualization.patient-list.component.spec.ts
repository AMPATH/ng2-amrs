import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DateTimePickerModule } from 'ngx-openmrs-formentry';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { VisualizationPatientListComponent } from './visualization.patient-list.component';

describe('Daily-schedule clinic flow component Tests', () => {
    let comp: VisualizationPatientListComponent;
    let fixture: ComponentFixture<VisualizationPatientListComponent>;

    beforeEach(async() => {
        TestBed.configureTestingModule({
            imports: [DateTimePickerModule,
                NgxMyDatePickerModule.forRoot(),
            ],
            declarations: [VisualizationPatientListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(VisualizationPatientListComponent);
        comp = fixture.componentInstance;
    });

});
