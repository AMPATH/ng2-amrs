import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Practitioner } from 'src/app/models/practitioner.model';

@Component({
  selector: 'app-practitioner-detail-modal',
  templateUrl: './practitioner-detail-modal.component.html',
  styleUrls: ['./practitioner-detail-modal.component.css']
})
export class PractitionerDetailModalComponent {
  @Input() practitioner: Practitioner | null = null;
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  getLicenseStatus(licenseEnd: string): { text: string; class: string } {
    const endDate = new Date(licenseEnd);
    const today = new Date();
    const daysUntilExpiration = Math.floor(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration < 0) {
      return { text: 'Expired', class: 'label-danger' };
    } else if (daysUntilExpiration < 30) {
      return { text: 'Expiring Soon', class: 'label-warning' };
    } else {
      return { text: 'Active', class: 'label-success' };
    }
  }
}
