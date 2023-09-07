import { Component, OnInit } from '@angular/core';
import { DrugOrderService } from '../drug-order.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-drug-order-list',
  templateUrl: './drug-order-list.component.html',
  styleUrls: ['./drug-order-list.component.css']
})
export class DrugOrderListComponent implements OnInit {
  dataSource: any[] = []; // This will hold the original data from the endpoint
  filteredDrugOrders: any[] = []; // This will hold the filtered "drugorder" type orders
  drugOrderlist: any[] = [];

  constructor(private orderService: DrugOrderService) { }

  ngOnInit() {
    const patientUuid = '66e1f837-3ae2-4b52-bda0-daff28db3da5';
    this.orderService.getOrdersForPatient(patientUuid).subscribe(data => {
      this.dataSource = data.results;
      this.filterDrugOrders();
    });
  }

  filterDrugOrders() {
    this.filteredDrugOrders = this.dataSource.filter(order => order.type === 'drugorder');
    this.fetchDetailsFromLinks();
  }

  fetchDetailsFromLinks() {
    this.filteredDrugOrders.forEach(order => {
      const linkUri = order.links[0].uri; // Assuming there's always a single link
      this.orderService.getDetailsFromLink(linkUri).subscribe(details => {
        details.isCollapsed = true;
        this.drugOrderlist.push(details); // Push the details to the array
      });
    });
  }

  toggleItem(item: any) {
    item.isCollapsed = !item.isCollapsed;
  }
}
