import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      {{ content }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1;
    }
    
    .badge-primary {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    .badge-secondary {
      background-color: #f3f4f6;
      color: #374151;
    }
    
    .badge-success {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .badge-warning {
      background-color: #fed7aa;
      color: #92400e;
    }
    
    .badge-error {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    .badge-info {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    .badge-pill {
      border-radius: 9999px;
    }
    
    .badge-outline {
      background-color: transparent;
      border: 1px solid;
    }
    
    .badge-outline.badge-primary {
      border-color: #3b82f6;
      color: #3b82f6;
    }
    
    .badge-outline.badge-secondary {
      border-color: #6b7280;
      color: #6b7280;
    }
    
    .badge-outline.badge-success {
      border-color: #10b981;
      color: #10b981;
    }
    
    .badge-outline.badge-warning {
      border-color: #f59e0b;
      color: #f59e0b;
    }
    
    .badge-outline.badge-error {
      border-color: #ef4444;
      color: #ef4444;
    }
    
    .badge-outline.badge-info {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  `]
})
export class BadgeComponent {
  @Input() content = '';
  @Input() variant: BadgeVariant = 'primary';
  @Input() pill = false;
  @Input() outline = false;

  getBadgeClasses(): string {
    const classes = ['badge'];
    
    // Variant class
    classes.push(`badge-${this.variant}`);
    
    // Shape classes
    if (this.pill) {
      classes.push('badge-pill');
    }
    
    if (this.outline) {
      classes.push('badge-outline');
    }
    
    return classes.join(' ');
  }
}
