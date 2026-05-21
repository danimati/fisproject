import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <!-- Label -->
      <label *ngIf="label" 
             class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>

      <!-- Select -->
      <select 
        [value]="value" 
        [disabled]="disabled"
        [class]="getSelectClasses()"
        (change)="onChange($event)"
        class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        
        <!-- Placeholder option -->
        <option *ngIf="placeholder" value="" disabled>{{ placeholder }}</option>
        
        <!-- Options -->
        <option *ngFor="let option of options" 
                [value]="option.value" 
                [disabled]="option.disabled">
          {{ option.label }}
        </option>
      </select>

      <!-- Error message -->
      <p *ngIf="error" class="text-sm font-medium text-red-600">
        {{ error }}
      </p>

      <!-- Helper text -->
      <p *ngIf="helperText && !error" class="text-sm text-gray-500">
        {{ helperText }}
      </p>
    </div>
  `,
  styles: [`
    .select-error {
      border-color: #ef4444 !important;
    }
    
    .select-error:focus {
      ring-color: #ef4444 !important;
    }
  `]
})
export class SelectComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value: string | number = '';
  @Input() options: SelectOption[] = [];
  @Input() error = '';
  @Input() helperText = '';
  @Input() required = false;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string | number>();

  onChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }

  getSelectClasses(): string {
    const classes = [];
    
    if (this.error) {
      classes.push('select-error');
    }
    
    return classes.join(' ');
  }
}
