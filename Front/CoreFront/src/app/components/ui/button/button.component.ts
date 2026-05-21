import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="onClick($event)"
      class="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <!-- Loading spinner -->
      <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      <!-- Left icon -->
      <svg *ngIf="leftIcon && !loading" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="leftIcon"></path>
      </svg>

      <!-- Button content -->
      <span>{{ content }}</span>

      <!-- Right icon -->
      <svg *ngIf="rightIcon && !loading" class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="rightIcon"></path>
      </svg>
    </button>
  `,
  styles: [`
    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }
    
    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: #4b5563;
    }
    
    .btn-outline {
      background-color: transparent;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .btn-outline:hover:not(:disabled) {
      background-color: #f9fafb;
    }
    
    .btn-ghost {
      background-color: transparent;
      color: #374151;
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: #f3f4f6;
    }
    
    .btn-danger {
      background-color: #ef4444;
      color: white;
    }
    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
    }
    
    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      height: 2rem;
    }
    
    .btn-md {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      height: 2.5rem;
    }
    
    .btn-lg {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      height: 3rem;
    }
    
    .btn-full-width {
      width: 100%;
    }
  `]
})
export class ButtonComponent {
  @Input() content = '';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() leftIcon = '';
  @Input() rightIcon = '';
  @Input() fullWidth = false;

  @Output() buttonClick = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }

  getButtonClasses(): string {
    const classes = [];
    
    // Variant classes
    classes.push(`btn-${this.variant}`);
    
    // Size classes
    classes.push(`btn-${this.size}`);
    
    // Full width
    if (this.fullWidth) {
      classes.push('btn-full-width');
    }
    
    return classes.join(' ');
  }
}
