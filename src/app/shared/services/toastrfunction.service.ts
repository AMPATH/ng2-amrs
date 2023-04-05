import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrfunctionService {
  constructor(private toastr: ToastrService) {}

  public showToastr(type: string, message: string, title: string) {
    const options: Partial<IndividualConfig> = {
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressAnimation: 'increasing'
    };

    switch (type) {
      case 'success':
        this.toastr.success(message, title, options);
        break;
      case 'error':
        this.toastr.error(message, title, options);
        break;
      case 'warning':
        this.toastr.warning(message, title, options);
        break;
      case 'info':
        this.toastr.info(message, title, options);
        break;
      default:
        break;
    }
  }
}
