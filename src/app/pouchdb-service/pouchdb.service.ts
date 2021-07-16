import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
(window as any).global = window;
import * as PouchDB from "pouchdb/dist/pouchdb";
PouchDB.plugin(require("pouchdb-upsert"));

const REMOTE_COUCH_DB_ADDRESS = "http://admin:dev@localhost:5984/location1";
/* This a simple service loading pouchdb into the app it uses hardcoded credentials for simplicity and will
need couchdb listening locally with an user admin with password dev to work. It also needs the database location1 to be available*/
@Injectable()
export class PouchdbService {
  private _pouchDB: any;
  private _couchDB: any;
  private _remoteCouchDBAddress: string;
  private _pouchDbName: string;
  // rxjs observables to broadcast sync status
  syncStatus = new BehaviorSubject<boolean>(false);
  couchDbUp = new BehaviorSubject<boolean>(false);

  // URL of CouchDB (hardwired above)
  remoteCouchDBAddress: string = REMOTE_COUCH_DB_ADDRESS;

  // initiate adapter class and hook up the observables
  constructor() {
    // this._pouchDbAdapter = new PouchDbAdapter(REMOTE_COUCH_DB_ADDRESS);
    // this.syncStatus = this._pouchDbAdapter.syncStatus.asObservable();
    // this.couchdbUp = this._pouchDbAdapter.couchDbUp.asObservable();
    // this._pouchDB = new PouchDB('location1');
    // this._couchDB = new PouchDB(this.remoteCouchDBAddress);
    // this._pouchDB.replicate.from(this._couchDB, {
    //   live: true,
    //   retry: true
    // })
    //   .on('paused', err => { this.syncStatusUpdate(); })
    //   .on('change', info => {
    //     console.log('C2P CHANGE: ', info);
    //     this.syncStatusUpdate();
    //   })
    //   .on('error', err => {
    //     // TODO: Write error handling and display message to user
    //     console.error('C2P Error: ', err);
    //   })
    //   .on('active', info => {
    //     // TODO: Write code when sync is resume after pause/error
    //     console.log('C2P Resume: ', info);
    //   });
    // this._pouchDB.replicate.to(this._couchDB, {
    //   live: true,
    //   retry: true
    // })
    //   .on('paused', err => { this.syncStatusUpdate(); })
    //   .on('change', info => {
    //     console.log('P2C CHANGE: ', info);
    //     this.syncStatusUpdate();
    //   })
    //   .on('error', err => {
    //     // TODO: Write error handling and display message to user
    //     console.error('P2C Error: ', err);
    //   })
    //   .on('active', info => {
    //     // TODO: Write code when sync is resume after pause/error
    //     console.log('P2C Resume: ', info);
    //   });
  }
  // function to call the below functions
  // then update the rxjs BehaviourSubjects with the
  // results
  private syncStatusUpdate(): void {
    this.checkPouchCouchSync().then((result) => {
      this.syncStatus.next(result);
    });
    this.checkCouchUp().then((result) => {
      this.couchDbUp.next(result);
    });
  }

  // part of the JSON returned by PouchDB from the info() method
  // is 'update_seq'. When these numbers are equal then the databases
  // are in sync. The way its buried in the JSON means some string
  // functions are required to extract it
  private checkPouchCouchSync(): Promise<boolean> {
    // if both objects exist then make a Promise from both their
    // info() methods
    if (this._pouchDB && this._couchDB) {
      return (
        Promise.all([this._pouchDB.info(), this._couchDB.info()])
          // using the 0 and 1 items in the array of two
          // that is produced by the Promise
          // Do some string trickery to get a number for update_seq
          // and return 'true' if the numbers are equal.
          .then((results: any[]) => {
            return (
              Number(String(results[0].update_seq).split("-")[0]) ===
              Number(String(results[1].update_seq).split("-")[0])
            );
          })
          // on error just resolve as false
          .catch((error) => false)
      );
    } else {
      // if one of the PouchDB or CouchDB objects doesn't exist yet
      // return resolve false
      return Promise.resolve(false);
    }
  }

  // fairly self explanatory function to make a
  // GET http request to the URL and return false
  // if an error status or a timeout occurs, true if
  // successful.
  private checkCouchUp(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", this._remoteCouchDBAddress, true);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      xhr.onerror = () => {
        resolve(false);
      };
      xhr.send();
    });
  }
}
