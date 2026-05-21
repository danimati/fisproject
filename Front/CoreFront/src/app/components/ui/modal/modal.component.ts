import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalOptions {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" 
         class="fixed inset-0 z-50 overflow-y-auto"
         (click)="onMaskClick()">
      <!-- Backdrop -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <!-- Modal -->
        <div [class]="getModalClasses()" 
             (click)="$event.stopPropagation()">
          <!-- Header -->
          <div *ngIf="options.title" class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900">{{ options.title }}</h3>
            <button *ngIf="options.closable !== false"
                    (click)="close()"
                    class="rounded-md p-2 text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <ng-content></ng-content>
          </div>
          
          <!-- Footer -->
          <div *ngIf="showFooter" class="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
            <ng-content select="[modal-footer]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .modal-sm {
      max-width: 24rem;
      width: 100%;
    }
    
    .modal-md {
      max-width: 32rem;
      width: 100%;
    }
    
    .modal-lg {
      max-width: 48rem;
      width: 100%;
    }
    
    .modal-xl {
      max-width: 64rem;
      width: 100%;
    }
    
    .modal-full {
      max-width: 95vw;
      width: 100%;
      height: 90vh;
    }
  `]
})
export class ModalComponent {
  @Input() open = false;
  @Input() options: ModalOptions = {};
  @Input() showFooter = false;

  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.open = false;
    this.closeEvent.emit();
  }

  onMaskClick() {
    if (this.options.maskClosable !== false) {
      this.close();
    }
  }

  getModalClasses(): string {
    const classes = [
      'relative',
      'bg-white',
      'rounded-lg',
      'shadow-xl',
      'transform',
      'transition-all'
    ];
    
    // Size classes
    if (this.options.size) {
      classes.push(`modal-${this.options.size}`);
    }
    
    return classes.join(' ');
  }

  // Close on escape key
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.open) {
      this.close();
    }
  }
}
