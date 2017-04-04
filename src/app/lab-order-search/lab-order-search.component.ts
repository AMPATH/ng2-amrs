import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { OrderResourceService } from '../openmrs-api/order-resource.service';


@Component({
  selector: 'lab-order-search',
  templateUrl: './lab-order-search.component.html',
  styleUrls: ['./lab-order-search.component.css']
})
export class LabOrderSearchComponent implements OnInit {
  @Output() onOrderRecieved = new EventEmitter<any>();
  public orderId: string;
  public isResetButton: boolean = true;
  public adjustedInputMargin: string = '240px';
  public isLoading: boolean = false;
  public hasError: boolean = false;
  private hasBeenSearched = false;

  constructor(private orderResourceService: OrderResourceService) {
  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.adjustedInputMargin = '0';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (this.orderId && this.orderId.length > 4 && event.keyCode === 13) {
      this.searchOrderId();
    }
  }

  onPaste(event) {
    // detect the end of barcode reading
    let search = event.target.value;
    if (search.substr(-1) === '$') {
      if (!this.hasBeenSearched) {
        this.orderId = this.formatOrderId(search);
        this.searchOrderId();
      }
    }
  }

  formatOrderId(value: string) {
    return value.replace('$', '');
  }

  onValueChange(value) {
    if (this.orderId.length > 0) {
      this.isResetButton = true;
    }
    this.orderId = this.formatOrderId(value);
  }

  searchOrderId() {
    if (window.innerWidth > 768) {
      this.adjustedInputMargin = '267px';
    }
    this.hasBeenSearched = true;
    this.isLoading = true;
    this.orderResourceService.searchOrdersById(this.orderId).subscribe((resp) => {
      this.onOrderRecieved.emit(resp);
      this.hasBeenSearched = false;
      this.resetSearch();
    }, (err) => {
      this.hasError = true;
      this.isLoading = false;
      this.hasBeenSearched = false;
      this.resetInputMargin();
    });
  }

  resetSearch() {
    this.isResetButton = false;
    this.isLoading = false;
    this.hasError = false;
    this.hasBeenSearched = false;
    this.resetInputMargin();
  }

  public resetInputMargin() {
    if (window.innerWidth > 768) {
      this.adjustedInputMargin = '240px';
    }
  }

}
