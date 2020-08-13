import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportViewComponent } from './report-view.component';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MultiSelectModule } from 'primeng/primeng';

describe('ReportViewCompoent', () => {

    let component: ReportViewComponent;
    let fixture: ComponentFixture<ReportViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpClientTestingModule
            ],
            imports: [
                DomSanitizer,
                MultiSelectModule
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ReportViewComponent);
            component = fixture.componentInstance;
        });
    });

    it('should be created', () => {
        pending();
    });
});
