import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  showError(error: any): void {
    console.log('ErrorHandlerService.showError called with:', error);
    const messages = this.extractErrorMessages(error);
    console.log('Extracted messages:', messages);
    messages.forEach(msg => {
      this.toast({
        type: 'error',
        message: msg,
        duration: 5000
      });
    });
  }

  showSuccess(message: string): void {
    this.toast({
      type: 'success',
      message,
      duration: 3000
    });
  }

  showWarning(message: string): void {
    this.toast({
      type: 'warning',
      message,
      duration: 4000
    });
  }

  showInfo(message: string): void {
    this.toast({
      type: 'info',
      message,
      duration: 3000
    });
  }

  private toast(message: ToastMessage): void {
    this.toastSubject.next(message);
  }

  private extractErrorMessages(error: any): string[] {
    if (!error) return ['An unknown error occurred'];

    // Handle FastAPI/Pydantic validation errors
    if (error.error?.detail && Array.isArray(error.error.detail)) {
      return error.error.detail.map((item: any) => item.msg || 'Validation error');
    }

    // Handle error with detail array directly
    if (error.detail && Array.isArray(error.detail)) {
      return error.detail.map((item: any) => item.msg || 'Validation error');
    }

    // Handle single error message
    if (error.error?.detail) {
      return [error.error.detail];
    }

    if (error.detail) {
      return [error.detail];
    }

    // Handle error message
    if (error.message) {
      return [error.message];
    }

    // Handle HTTP status text
    if (error.statusText) {
      return [error.statusText];
    }

    return ['An unknown error occurred'];
  }
}
