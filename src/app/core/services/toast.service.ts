import { Injectable } from '@angular/core';
import { Toast, ToastType } from '../models/toast';


@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];

  create(message: string, type: ToastType) {
    const toast = new Toast(
      message,
      type
    )

    this.toasts.push(toast);

    setTimeout(() => {
      this.remove(toast);
    }, toast.duration);
  }

  remove(toast: Toast) {
    const index = this.toasts.indexOf(toast);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }
}
