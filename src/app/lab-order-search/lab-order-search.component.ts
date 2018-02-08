import { Component, Output, OnInit, EventEmitter, Input } from '@angular/core';
import { OrderResourceService } from '../openmrs-api/order-resource.service';

@Component({
  selector: 'lab-order-search',
  templateUrl: './lab-order-search.component.html',
  styleUrls: ['./lab-order-search.component.css']
})
export class LabOrderSearchComponent implements OnInit {
  @Output() public onOrderRecieved = new EventEmitter<any>();
  @Output() public onReset = new EventEmitter<any>();
  public orderId: string = '';
  public isResetButton: boolean = true;
  public adjustedInputMargin: string = '240px';
  public isLoading: boolean = false;
  public hasError: boolean = false;
  public orderDeleted: boolean = false;
  private _reset: boolean = false;
  private _orderPostSuccessful: boolean = false;

  @Input()
  set reset(value) {
    if (value === true && this.orderId.length > 0) {
      this.orderId = '';
    }
    this._reset = value;
  }

  get reset() {
    return this._reset;
  }

  private hasBeenSearched = false;

  private customOrderObjectDefinition: string = 'custom:(display,uuid,orderNumber,voided,' +
    'accessionNumber,orderReason,orderReasonNonCoded,urgency,action,commentToFulfiller,' +
    'dateActivated,instructions,orderer:default,encounter:full,patient:(uuid,display,' +
    'identifiers:(identifier,uuid,preferred,' +
    'identifierType:(uuid,name,format,formatDescription,validator)),' +
    'person:(uuid,display,gender,birthdate,dead,age,deathDate,' +
    'causeOfDeath,preferredName:(uuid,preferred,givenName,middleName,familyName),'
    + 'attributes,preferredAddress:(uuid,preferred,address1,address2,cityVillage,' +
    'stateProvince,country,postalCode,countyDistrict,address3,address4,address5,' +
    'address6))),concept:ref)';

  constructor(private orderResourceService: OrderResourceService) {
  }

  public ngOnInit() {
    if (window.innerWidth <= 768) {
      this.adjustedInputMargin = '0';
    }
  }

  public onKeyPress(event: KeyboardEvent) {
    if (this.orderId && this.orderId.length > 4 && event.keyCode === 13) {
      this.searchOrderId();
    }
  }

  public onPaste(event) {
    // detect the end of barcode reading
    const search = event.target.value;
    if (search.substr(-1) === '$') {
      if (!this.hasBeenSearched) {
        this.orderId = this.formatOrderId(search);
        this.searchOrderId();
      }
    }
  }

  public formatOrderId(value: string) {
    return value.replace('$', '');
  }

  public onValueChange(value) {
    if (this.orderId.length > 0) {
      this.isResetButton = true;
    }
    this.orderId = this.formatOrderId(value);
  }

  public searchOrderId() {
    if (window.innerWidth > 768) {
      this.adjustedInputMargin = '267px';
    }
    this.isResetButton = false;
    this.hasBeenSearched = true;
    this.isLoading = true;
    this.orderResourceService.searchOrdersById(this.orderId, false,
      this.customOrderObjectDefinition)
      .subscribe((resp) => {
        if (resp && resp.orderVoided) {
          this.orderDeleted = true;
        } else {
          this.orderDeleted = false;
          this.onOrderRecieved.emit(resp);
        }
        this.hasBeenSearched = false;
        this.isLoading = false;
        this.hasError = false;
        this.isResetButton = true;
        // this.resetSearch();
      }, (err) => {
        this.hasError = true;
        this.isLoading = false;
        this.orderDeleted = false;
        this.hasBeenSearched = false;
        this.resetInputMargin();
      });
  }

  public resetInputMargin() {
    if (window.innerWidth > 768) {
      this.adjustedInputMargin = '240px';
    }
  }

  get isEnabled() {
    return this.isLoading;
  }

  public resetSearch() {
    this.orderId = '';
    this.isResetButton = false;
    this.isLoading = false;
    this.hasError = false;
    this.orderDeleted = false;
    this.hasBeenSearched = false;
    this.resetInputMargin();
    this.onReset.emit();
  }

}
