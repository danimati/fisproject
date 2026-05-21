import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
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

      <!-- Input -->
      <input 
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        [class]="getInputClasses()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
        class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />

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
    .input-error {
      border-color: #ef4444 !important;
    }
    
    .input-error:focus {
      ring-color: #ef4444 !important;
    }
  `]
})
export class InputComponent {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'number' | 'password' | 'tel' = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() error = '';
  @Input() helperText = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() name = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  isFocused = false;

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  onBlur() {
    this.isFocused = false;
    this.blur.emit();
  }

  onFocus() {
    this.isFocused = true;
    this.focus.emit();
  }

  getInputClasses(): string {
    const classes = [];
    
    if (this.error) {
      classes.push('input-error');
    }
    
    return classes.join(' ');
  }
}
