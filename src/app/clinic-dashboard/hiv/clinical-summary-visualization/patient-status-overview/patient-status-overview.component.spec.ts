
 /* tslint:disable:no-unused-variable */
 /* tslint:disable:import-blacklist */

 import { TestBed, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
 import { Observable, throwError } from 'rxjs';
 import { ClinicDashboardCacheService } from '../../../services/clinic-dashboard-cache.service';
 import {
 ClinicalSummaryVisualizationResourceService
 } from '../../../../etl-api/clinical-summary-visualization-resource.service';
 import { PatientStatusOverviewComponent } from './patient-status-overview.component';
 import {
 TabViewModule, FieldsetModule, ButtonModule, GrowlModule, AccordionModule
 } from 'primeng/primeng';
 import { ChartModule } from 'angular2-highcharts';
 import { Router, ActivatedRoute } from '@angular/router';
 import { PatientStatusIndicatorDefComponent } from './indicator-definition.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
 class DataStub {

 public getPatientCareStatusReport(payload): Observable<any> {
 return Observable.of({ status: 'okay' });
 }

 }
 class ClinicDashboardCacheServiceStub {
 public getCurrentClinic() {
 return Observable.of('');
 }
 }

 const expectedResults = {
 results: [
 {
 location_uuid: 'location-uuid',
 location_id: 13,
 patients: 5294,
 deceased_patients: 49,
 untraceable_patients: 163,
 transferred_out_patients: 166,
 hiv_negative_patients: 2,
 patients_continuing_care: 4238,
 self_disengaged_from_care: 4,
 defaulters: 239,
 transfer_to_MNCH: 7,
 other_patient_care_status: 93
 }]
 };

 describe('PatientStatusOverviewComponent', () => {
 let fixture: ComponentFixture<PatientStatusOverviewComponent>;
 let comp: PatientStatusOverviewComponent;
 let dataStub: ClinicalSummaryVisualizationResourceService;
 const mockRouter = {
   navigate: jasmine.createSpy('navigate')
   };

 beforeEach(async(() => {
   TestBed.configureTestingModule({
   imports: [ TabViewModule, FieldsetModule, ButtonModule, GrowlModule, HttpClientTestingModule,
   AccordionModule, ChartModule.forRoot(require('highcharts'))],
   declarations: [PatientStatusOverviewComponent, PatientStatusIndicatorDefComponent]
   }).overrideComponent(PatientStatusOverviewComponent, {
   set: {
     providers: [
       { provide: ClinicalSummaryVisualizationResourceService, useClass: DataStub },
       { provide: ClinicDashboardCacheService, useClass: ClinicDashboardCacheServiceStub },
       { provide: Router, useValue: mockRouter },
       {
         provide: ActivatedRoute,
         useValue: { parent: { params: Observable.of({id: 'testId'}) }}
       }
    ],
   }
   }).compileComponents()
   .then(() => {
   fixture = TestBed.createComponent(PatientStatusOverviewComponent);
   comp = fixture.componentInstance;
   dataStub = fixture.debugElement.injector.get(ClinicalSummaryVisualizationResourceService);
   });
 }));

 afterEach(() => {
  TestBed.resetTestingModule();
 });

 it('should be defined', () => {
   expect(comp).toBeTruthy();
 });

 it('should hit the success callback when getPatientCareStatusReport returns success',
   (done)  => {
    const spy = spyOn(dataStub, 'getPatientCareStatusReport').and.returnValue(
    Observable.of(expectedResults)
    );
    comp.getPatientStatusOverviewData();
    fixture.detectChanges();
    expect(spy.calls.any()).toEqual(true);
    done();
 });

 it('should hit the error callback when getPatientCareStatusReport returns an error',
   fakeAsync(() => {
   const spy = spyOn(dataStub, 'getPatientCareStatusReport').and.returnValue(
    throwError({ error: '' })
   );
   comp.getPatientStatusOverviewData();
   tick(50);
   fixture.detectChanges();
   expect(spy.calls.any()).toEqual(true);
 }));
 });
