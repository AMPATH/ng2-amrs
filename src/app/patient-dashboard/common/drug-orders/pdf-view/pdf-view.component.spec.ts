import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewComponent } from './pdf-view.component';

describe('PdfViewComponent', () => {
  let component: PdfViewComponent;
  let fixture: ComponentFixture<PdfViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PdfViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
