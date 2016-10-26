import {
  inject,
  TestBed
} from '@angular/core/testing';

// Load the implementations that should be tested
import { LoginComponent } from './login.component';
import {provideRoutes } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoginComponent,
      provideRoutes([])
    ],
    imports: [
      RouterTestingModule
    ]
  }));

  it('should have required variables', inject([ LoginComponent ], (loginComponent: LoginComponent) => {
    expect(loginComponent.loginSuccess).toBeTruthy();
    expect(loginComponent.loginFailure).toBeTruthy();
    expect(loginComponent.error).toBe(undefined);
  }));
});
