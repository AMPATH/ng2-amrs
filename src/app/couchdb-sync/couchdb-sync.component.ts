import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-couchdb-sync',
  templateUrl: './couchdb-sync.component.html',
  styleUrls: ['./couchdb-sync.component.css']
})
export class CouchdbSyncComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public onDoneClick() {
    this.router.navigate(['/login']);
  }

}
