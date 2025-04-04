export enum ToastType {
  SUCCESS, ERROR, INFO
}

export class Toast {
  id: number;
  message: string;
  duration: number;
  type: ToastType;

  constructor(message: string, type: ToastType, duration = 3500) {
    this.id = new Date().getTime();
    this.message = message;
    this.type = type;
    this.duration = duration;
  }
}
