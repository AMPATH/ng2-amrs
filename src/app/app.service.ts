import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
export interface InternalStateType {
  [key: string]: any;
}

@Injectable()
export class AppState {
  public idleTimeout = 5000;
  public idleTimer: Subject<any> = new Subject();
  public _state: InternalStateType = {};
  private timeoutID;
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

  public get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }
  public setupIdleTimer(idleTimeout) {
    // console.log('calling setupIdleTimer');
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

  public startTimer() {
    this.timeoutID = setTimeout(this.goInactive.bind(this),
      this.idleTimeout);
    // console.log('calling timeoutid', this.timeoutID, window);
  }

  public resetTimer(e) {

    // let taskid = this.timeoutID.data.handleId;
    // console.log('Resetting timer!', this.timeoutID, taskid);
    window.clearTimeout(this.timeoutID);
    this.goActive();
    /*
   if (this.timeoutID.cancelFn) {
     clearTimeout(this.timeoutID);
   }
   this.goActive(true);
   */
  }

  public goInactive() {
    // console.log('trying to go inative', this.idleTimer);
    this.idleTimer.next({ idle: true });
  }

  public goActive(emit?: boolean) {
    // TODO: Change the signature of the function to remove the emit param
    // goActive should always make the app become active
    // emit param is confusing and makes the feature hard to debug
    this.idleTimer.next({ idle: false });
    this.startTimer();
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }

}
