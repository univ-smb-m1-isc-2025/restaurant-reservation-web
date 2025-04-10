import { Component } from '@angular/core';
import { Toast, ToastType } from '@/app/core/models/toast';
import { CommonModule } from '@angular/common';
import { ToastService } from '@/app/core/services/toast.service';

@Component({
  selector: 'toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html'
})
export class ToastComponent {

  constructor(public toastService : ToastService){}

  removeToast(toast: Toast) {
    this.toastService.remove(toast);
  }

  isToastSuccess(toast: Toast) {
    return toast.type == ToastType.SUCCESS
  }

  isToastError(toast: Toast) {
    return toast.type == ToastType.ERROR
  }
}
