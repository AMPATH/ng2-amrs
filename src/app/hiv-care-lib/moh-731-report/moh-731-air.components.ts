import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface TableData {
  name: string;
  age: number;
  city: string;
  status: string;
}

@Component({
  selector: 'moh-731-air',
  templateUrl: './moh-731-air.component.html',
  styleUrls: ['./moh-731-air.component.css']
})
export class Moh731AirComponent implements OnInit {
  @Input() rowData: any[] = [];
  @Input() combinedData: any[] = [];
  @Input() sectionDefs: any[] = [];
  @Input() startDate: Date;
  @Input() endDate: Date;
  @Input() isReleased: boolean;
  @Output() indicatorSelected = new EventEmitter();

  sortField = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isLoading = false;
  filteredData: any[] = [];

  ngOnInit() {
    this.processData();
  }

  public processDataToKHIS() {
    console.log('process air data', this.combinedData);
  }

  processData() {
    this.isLoading = true;
    try {
      if (this.rowData && this.sectionDefs) {
        this.filteredData = [...this.rowData];
      }
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  filterData(): any[] {
    let filtered = [...this.filteredData];

    // Apply search filter if searchTerm exists
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        return this.sectionDefs.some((def) => {
          const value = item[def.name];
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return this.sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'fa fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa fa-sort-asc' : 'fa fa-sort-desc';
  }

  getStatusClass(status: string): string {
    switch (status ? status.toLowerCase() : '') {
      case 'synced':
        return 'label-success';
      case 'pending':
        return 'label-warning';
      case 'error':
        return 'label-danger';
      default:
        return 'label-default';
    }
  }

  retrySync(item: TableData) {
    // Add logic to retry syncing
    console.log('Retry sync for:', item);
  }

  resolveError(item: TableData) {
    // Add logic to resolve the error
    console.log('Resolve error for:', item);
  }

  onIndicatorClick(indicator: any) {
    this.indicatorSelected.emit(indicator);
  }
}
