import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService, ToastMessage } from '../../services/error-handler.service';
import { Subscription } from 'rxjs';

interface ToastItem extends ToastMessage {
  id: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <div 
        *ngFor="let toast of toasts" 
        [class]="getToastClasses(toast.type)"
        class="min-w-[300px] max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in pointer-events-auto">
        <span class="text-xl flex-shrink-0" [class]="getIconClass(toast.type)">
          {{ getIcon(toast.type) }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium break-words">{{ toast.message }}</p>
        </div>
        <button 
          (click)="removeToast(toast.id)"
          class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2">
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: ToastItem[] = [];
  private idCounter = 0;
  private subscription: Subscription | null = null;

  constructor(private errorHandlerService: ErrorHandlerService) {}

  ngOnInit(): void {
    console.log('ToastComponent initialized');
    this.subscription = this.errorHandlerService.toast$.subscribe(message => {
      console.log('ToastComponent received message:', message);
      this.addToast(message);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private addToast(message: ToastMessage): void {
    const toast: ToastItem = {
      ...message,
      id: this.idCounter++
    };
    this.toasts.push(toast);

    // Auto-remove after duration
    const duration = message.duration || 3000;
    setTimeout(() => {
      this.removeToast(toast.id);
    }, duration);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getToastClasses(type: string): string {
    switch (type) {
      case 'error':
        return 'bg-red-50 border border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border border-gray-200 text-gray-800';
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'error':
        return '✕';
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  }
}
