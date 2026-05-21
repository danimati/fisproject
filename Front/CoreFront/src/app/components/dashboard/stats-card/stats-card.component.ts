import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatsCardData {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white overflow-hidden rounded-lg shadow">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div [class]="getIconClasses()">
              <!-- Icon placeholder - can be customized per card type -->
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">{{ data.title }}</dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">{{ data.value }}</div>
                
                <!-- Change indicator -->
                <div *ngIf="data.change" 
                     [class]="getChangeClasses()"
                     class="ml-2 flex items-baseline text-sm font-semibold">
                  <svg *ngIf="data.change.type !== 'neutral'" 
                        class="h-4 w-4 flex-shrink-0 self-center" 
                        fill="currentColor" viewBox="0 0 20 20">
                    <path *ngIf="data.change.type === 'increase'" 
                          fill-rule="evenodd" 
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0v-7.586l-2.293 2.293a1 1 0 01-1.414-1.414l4-4z" 
                          clip-rule="evenodd" />
                    <path *ngIf="data.change.type === 'decrease'" 
                          fill-rule="evenodd" 
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 1.414l-4 4z" 
                          clip-rule="evenodd" />
                  </svg>
                  {{ data.change.value }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .icon-blue {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    .icon-green {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .icon-yellow {
      background-color: #fed7aa;
      color: #92400e;
    }
    
    .icon-red {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    .icon-purple {
      background-color: #e9d5ff;
      color: #6b21a8;
    }
    
    .change-increase {
      color: #059669;
    }
    
    .change-decrease {
      color: #dc2626;
    }
    
    .change-neutral {
      color: #6b7280;
    }
  `]
})
export class StatsCardComponent {
  @Input() data: StatsCardData = {
    title: '',
    value: 0
  };

  getIconClasses(): string {
    const classes = ['p-3', 'rounded-md'];
    
    if (this.data.color) {
      classes.push(`icon-${this.data.color}`);
    } else {
      classes.push('icon-blue'); // default
    }
    
    return classes.join(' ');
  }

  getChangeClasses(): string {
    if (!this.data.change) return '';
    
    const classes = [];
    
    if (this.data.change.type === 'increase') {
      classes.push('change-increase');
    } else if (this.data.change.type === 'decrease') {
      classes.push('change-decrease');
    } else {
      classes.push('change-neutral');
    }
    
    return classes.join(' ');
  }
}
