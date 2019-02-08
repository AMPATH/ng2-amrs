import { Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

import * as _ from 'lodash';

import { DrugOrdersComponent } from '../drug-orders/drug-orders.component';
import { AppFeatureAnalytics } from 'src/app/shared/app-analytics/app-feature-analytics.service';
import { DrugOrderService } from '../drug-order.service';
import { EditDrugComponent } from '../edit-drug/edit-drug.component';



@Component({
  selector: 'app-add-drug-orders',
  templateUrl: './add-drug-orders.component.html',
  styleUrls: ['./add-drug-orders.component.css'],
})

export class AddDrugOrdersComponent implements OnInit {
  @Output() childEvent = new EventEmitter();
  @Output() changeDraft = new EventEmitter();
  public patient: any;
  public error: string;
  public subscription: Subscription;
  public drugs = [];
  public title = 'Drug Search';
  public locations = [];
  public frequencies = [];
  public unit = [];
  public quantityUnits = [];
  public hasConductedSearch = false;
  public isResetButton = true;
  public isLoading = false;
  public lastSearchString = '';
  public noMatchingResults = false;
  public adjustInputMargin = '240px';
  public freqs = [];
  public durationUnits;
  public drugName: string;
  public location: string;
  public dose: number;
  public dosageForm: string;
  public doseStrength: string;
  public dosageFormv: string;
  public sentence: string;
  public routes = [];
  public routev: string;
  public frequency: string;
  public routed: string;
  public asNeeded = false;
  public asNeededReason: string;
  public dosingInstructions: string;
  public refills: number;
  public encounter: string;
  public personUuid: string;
  public orderer: string;
  public ordererName: string;
  public startDate = new Date();
  public quantity: number;
  public quantityUnit: string;
  public selectedDrug: string;
  public selectedLocation: string;
  public drugList = false;
  public totalDrugs: number;
  public locationList = false;
  public currentDate;
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public action = 'NEW';
  public submittedDrugOrder;
  public searchingDrug = true;
  private patientIdentifer: any;
  public sentenceArray = [];
  public editDrug = false;
  public hideResults = true;
  public doseUnits = 'Mg';

  constructor(

    @Inject(DrugOrdersComponent) private drurOrder: DrugOrdersComponent,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private drugOrderService: DrugOrderService,
  ) { }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Orders Loaded', 'ngOnInit');
  }

  public findDrug(searchText) {
    this.totalDrugs = 0;
    this.hideResults = false;
    this.drugList = true;
    this.hasConductedSearch = true;
    this.isLoading = true;
    this.drugOrderService.findDrug(searchText).subscribe((data) => {
      this.drugs = data;
    });
    this.isLoading = false;
    this.isResetButton = true;
  }

  public selectDrug(drug) {
    this.editDrug = false;
    console.log(drug);
    this.selectedDrug = drug;
    this.searchingDrug = false;
    this.editDrug = true;
  }
  public resetSearchList() {
    this.isResetButton = false;
    this.isLoading = false;
    this.drugName = '';
    this.hasConductedSearch = false;
    this.hideResults = true;
    this.resetInputMargin();
    this.noMatchingResults = false;
  }

  public resetInputMargin() {
    if (window.innerWidth > 768) {
      this.adjustInputMargin = '240px';
    }
  }

  public close() {
    this.drurOrder.addOrder(false);
  }
  public drugDraft(status) {
    if (status === true) {
      this.childEvent.emit(status);
      const dataToParent = JSON.parse(localStorage.getItem('drug')).length;
      this.changeDraft.emit(dataToParent);

    }
   }
  public changeDrug (show) {
    this.editDrug = false;
    this.searchingDrug = true;
  }

}
