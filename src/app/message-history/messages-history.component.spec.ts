import { MessagesHistoryService } from './messages-history.service';
import { FeedBackHistoryComponent } from './messages-history.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MomentModule } from 'angular2-moment';
import { MarkdownModule } from 'angular2-markdown';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from './../utils/local-storage.service';
describe('FeedBackHistoryComponent', () => {
  let component: FeedBackHistoryComponent;
  let fixture: ComponentFixture<FeedBackHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [VirtualScrollModule, MomentModule, MarkdownModule.forRoot()],
      declarations: [ FeedBackHistoryComponent ],
      providers: [ MessagesHistoryService,   AppSettingsService, LocalStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBackHistoryComponent);
    component = fixture.componentInstance;

    let service = fixture.debugElement.injector.get(MessagesHistoryService);

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
