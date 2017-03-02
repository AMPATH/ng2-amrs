import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {
  idleTimeout = 5000;
  timeoutID;
  _state: InternalStateType = {};
  idleTimer: Subject<any> = new Subject();
  constructor() {

  }

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }


  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }
  setupIdleTimer(idleTimeout) {
    this.idleTimeout = idleTimeout;
    window.addEventListener('mousemove', this.resetTimer.bind(this), false);
    window.addEventListener('mousedown', this.resetTimer.bind(this), false);
    window.addEventListener('keypress', this.resetTimer.bind(this), false);
    window.addEventListener('DOMMouseScroll', this.resetTimer.bind(this), false);
    window.addEventListener('mousewheel', this.resetTimer.bind(this), false);
    window.addEventListener('touchmove', this.resetTimer.bind(this), false);
    window.addEventListener('MSPointerMove', this.resetTimer.bind(this), false);

    this.startTimer();
    return this.idleTimer;
  }

  startTimer() {
    this.timeoutID = window.setTimeout(this.goInactive.bind(this), this.idleTimeout);
  }

  resetTimer(e) {
    window.clearTimeout(this.timeoutID);

    this.goActive();
  }

  goInactive() {
    this.idleTimer.next({ idle: true });
  }

  goActive(emit?: boolean) {
    if (emit) {
      this.idleTimer.next({ idle: false });
    }
    this.startTimer();
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }


}
